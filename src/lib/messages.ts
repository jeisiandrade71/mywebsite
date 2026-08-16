import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export type MessageSender = "customer" | "ai" | "admin";

export interface MessageDoc {
  _id: ObjectId;
  conversationId: ObjectId;
  direction: "inbound" | "outbound";
  sender: MessageSender;
  body: string;
  twilioSid: string | null;
  createdAt: Date;
}

export async function getMessagesCollection() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "mysite";
  return client.db(dbName).collection<MessageDoc>("messages");
}

export async function createMessage(input: {
  conversationId: ObjectId;
  direction: "inbound" | "outbound";
  sender: MessageSender;
  body: string;
  twilioSid?: string | null;
}) {
  const messages = await getMessagesCollection();
  const doc: MessageDoc = {
    _id: new ObjectId(),
    conversationId: input.conversationId,
    direction: input.direction,
    sender: input.sender,
    body: input.body,
    twilioSid: input.twilioSid ?? null,
    createdAt: new Date(),
  };
  await messages.insertOne(doc);
  return doc;
}

export async function listMessagesByConversation(conversationId: string) {
  const messages = await getMessagesCollection();
  return messages
    .find({ conversationId: new ObjectId(conversationId) })
    .sort({ createdAt: 1 })
    .toArray();
}
