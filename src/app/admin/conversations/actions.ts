"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getConversationById, setConversationAiEnabled, touchConversation } from "@/lib/conversations";
import { getCustomersCollection } from "@/lib/customers";
import { createMessage } from "@/lib/messages";
import { sendSms } from "@/lib/twilio";

async function requireSession() {
  const session = await auth();
  if (!session) {
    throw new Error("Não autenticado.");
  }
}

export async function replyToConversationAction(
  conversationId: string,
  formData: FormData
) {
  await requireSession();

  const body = String(formData.get("body") || "").trim();
  if (!body) return;

  const conversation = await getConversationById(conversationId);
  if (!conversation) throw new Error("Conversa não encontrada.");

  const customers = await getCustomersCollection();
  const customer = await customers.findOne({ _id: conversation.customerId });
  if (!customer) throw new Error("Cliente não encontrado.");

  const message = await sendSms(customer.phone, body);

  await createMessage({
    conversationId: conversation._id,
    direction: "outbound",
    sender: "admin",
    body,
    twilioSid: message.sid,
  });

  await touchConversation(conversation._id);

  revalidatePath(`/admin/conversations/${conversationId}`);
  revalidatePath("/admin/conversations");
}

export async function toggleConversationAiAction(
  conversationId: string,
  aiEnabled: boolean
) {
  await requireSession();
  await setConversationAiEnabled(conversationId, aiEnabled);
  revalidatePath(`/admin/conversations/${conversationId}`);
  revalidatePath("/admin/conversations");
}
