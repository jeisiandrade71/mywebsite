import { NextResponse } from "next/server";
import { validateRequest } from "twilio";
import { findOrCreateCustomerByPhone } from "@/lib/customers";
import { findOrCreateOpenConversation, touchConversation } from "@/lib/conversations";
import { createMessage } from "@/lib/messages";

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

  // A resposta automática por IA entra numa fase seguinte; por enquanto a
  // mensagem só fica salva pra ser respondida manualmente pelo painel.

  return twiml();
}
