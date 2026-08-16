import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export interface CustomerDoc {
  _id: ObjectId;
  phone: string; // E.164, e.g. +15551234567
  name: string | null;
  createdAt: Date;
}

export async function getCustomersCollection() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "mysite";
  return client.db(dbName).collection<CustomerDoc>("customers");
}

export async function findOrCreateCustomerByPhone(phone: string) {
  const customers = await getCustomersCollection();
  const existing = await customers.findOne({ phone });
  if (existing) return existing;

  const doc: CustomerDoc = {
    _id: new ObjectId(),
    phone,
    name: null,
    createdAt: new Date(),
  };
  await customers.insertOne(doc);
  return doc;
}
