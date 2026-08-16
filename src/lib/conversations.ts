import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export type Channel = "sms" | "whatsapp" | "email";

export interface ConversationDoc {
  _id: ObjectId;
  customerId: ObjectId;
  channel: Channel;
  status: "open" | "closed";
  aiEnabled: boolean;
  lastMessageAt: Date;
  createdAt: Date;
}

export async function getConversationsCollection() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "mysite";
  return client.db(dbName).collection<ConversationDoc>("conversations");
}

export async function findOrCreateOpenConversation(
  customerId: ObjectId,
  channel: Channel
) {
  const conversations = await getConversationsCollection();
  const existing = await conversations.findOne({
    customerId,
    channel,
    status: "open",
  });
  if (existing) return existing;

  const now = new Date();
  const doc: ConversationDoc = {
    _id: new ObjectId(),
    customerId,
    channel,
    status: "open",
    aiEnabled: true,
    lastMessageAt: now,
    createdAt: now,
  };
  await conversations.insertOne(doc);
  return doc;
}

export async function touchConversation(id: ObjectId) {
  const conversations = await getConversationsCollection();
  await conversations.updateOne(
    { _id: id },
    { $set: { lastMessageAt: new Date() } }
  );
}

export async function setConversationAiEnabled(
  id: string,
  aiEnabled: boolean
) {
  const conversations = await getConversationsCollection();
  await conversations.updateOne(
    { _id: new ObjectId(id) },
    { $set: { aiEnabled } }
  );
}

export async function listConversationsWithCustomers() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "mysite";
  const db = client.db(dbName);

  return db
    .collection<ConversationDoc>("conversations")
    .aggregate([
      { $sort: { lastMessageAt: -1 } },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
    ])
    .toArray();
}

export async function getConversationById(id: string) {
  const conversations = await getConversationsCollection();
  return conversations.findOne({ _id: new ObjectId(id) });
}
