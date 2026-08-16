import { NextResponse } from "next/server";
import { validateRequest } from "twilio";
import { findOrCreateCustomerByPhone } from "@/lib/customers";
import { findOrCreateOpenConversation, touchConversation } from "@/lib/conversations";
import { createMessage } from "@/lib/messages";
import { generateAiReply } from "@/lib/ai";
import { createBooking } from "@/lib/bookings";
import { getServicesCollection } from "@/lib/services";
import { sendSms } from "@/lib/twilio";
import { listAdminEmails } from "@/lib/admins";
import { sendEmail } from "@/lib/email";

function twiml(xml = "") {
  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response>${xml}</Response>`, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}

export async function POST(request: Request) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    return NextResponse.json(
      { error: "Missing TWILIO_AUTH_TOKEN" },
      { status: 500 }
    );
  }

  const rawBody = await request.text();
  const params = Object.fromEntries(new URLSearchParams(rawBody));

  const signature = request.headers.get("x-twilio-signature") || "";
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host");
  const url = `${proto}://${host}${new URL(request.url).pathname}`;

  const valid = validateRequest(authToken, signature, url, params);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const from = params.From;
  const body = params.Body || "";
  const messageSid = params.MessageSid || null;

  if (!from) {
    return twiml();
  }

  const customer = await findOrCreateCustomerByPhone(from);
  const conversation = await findOrCreateOpenConversation(
    customer._id,
    "sms"
  );

  await createMessage({
    conversationId: conversation._id,
    direction: "inbound",
    sender: "customer",
    body,
    twilioSid: messageSid,
  });

  await touchConversation(conversation._id);

  if (conversation.aiEnabled) {
    try {
      const replyText = await generateAiReply(
        conversation,
        customer,
        async ({ serviceName, preferredDate, notes }) => {
          const services = await getServicesCollection();
          const matchedService = await services.findOne({
            name: { $regex: `^${serviceName}$`, $options: "i" },
          });
          await createBooking({
            customerId: customer._id,
            serviceId: matchedService?._id ?? null,
            serviceName,
            start: null,
            notes: `Preferência do cliente: ${preferredDate}. ${notes}`.trim(),
          });

          try {
            const adminEmails = await listAdminEmails();
            await Promise.all(
              adminEmails.map((email) =>
                sendEmail({
                  to: email,
                  subject: `Novo pedido de agendamento — ${serviceName}`,
                  html: `<p>Um cliente pediu <strong>${serviceName}</strong> por SMS.</p>
<p><strong>Cliente:</strong> ${customer.name || customer.phone}</p>
<p><strong>Preferência de data:</strong> ${preferredDate}</p>
<p><strong>Notas:</strong> ${notes || "—"}</p>
<p>Confirme em /admin/bookings.</p>`,
                })
              )
            );
          } catch (error) {
            console.error("Falha ao enviar e-mail de novo pedido:", error);
          }
        }
      );

      const sent = await sendSms(from, replyText);

      await createMessage({
        conversationId: conversation._id,
        direction: "outbound",
        sender: "ai",
        body: replyText,
        twilioSid: sent.sid,
      });

      await touchConversation(conversation._id);
    } catch (error) {
      console.error("AI reply failed:", error);
    }
  }

  return twiml();
}
