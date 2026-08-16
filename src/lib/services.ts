import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export interface ServiceDoc {
  _id: ObjectId;
  name: string;
  description: string;
  priceCents: number;
  durationMinutes: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getServicesCollection() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "mysite";
  return client.db(dbName).collection<ServiceDoc>("services");
}

export async function listServices() {
  const services = await getServicesCollection();
  return services.find().sort({ createdAt: -1 }).toArray();
}

export async function listActiveServices() {
  const services = await getServicesCollection();
  return services.find({ active: true }).sort({ name: 1 }).toArray();
}

export async function createService(input: {
  name: string;
  description: string;
  priceCents: number;
  durationMinutes: number;
}) {
  const services = await getServicesCollection();
  const now = new Date();
  await services.insertOne({
    _id: new ObjectId(),
    ...input,
    active: true,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateService(
  id: string,
  input: {
    name: string;
    description: string;
    priceCents: number;
    durationMinutes: number;
  }
) {
  const services = await getServicesCollection();
  await services.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...input, updatedAt: new Date() } }
  );
}

export async function setServiceActive(id: string, active: boolean) {
  const services = await getServicesCollection();
  await services.updateOne(
    { _id: new ObjectId(id) },
    { $set: { active, updatedAt: new Date() } }
  );
}

export async function deleteService(id: string) {
  const services = await getServicesCollection();
  await services.deleteOne({ _id: new ObjectId(id) });
}
