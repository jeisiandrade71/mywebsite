import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface BookingDoc {
  _id: ObjectId;
  customerId: ObjectId;
  serviceId: ObjectId | null;
  serviceName: string;
  start: Date | null;
  notes: string;
  status: BookingStatus;
  createdAt: Date;
}

export async function getBookingsCollection() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "mysite";
  return client.db(dbName).collection<BookingDoc>("bookings");
}

export async function createBooking(input: {
  customerId: ObjectId;
  serviceId: ObjectId | null;
  serviceName: string;
  start: Date | null;
  notes: string;
}) {
  const bookings = await getBookingsCollection();
  const doc: BookingDoc = {
    _id: new ObjectId(),
    ...input,
    status: "pending",
    createdAt: new Date(),
  };
  await bookings.insertOne(doc);
  return doc;
}

export async function listBookings() {
  const bookings = await getBookingsCollection();
  return bookings.find().sort({ start: 1 }).toArray();
}

export async function listBookingsWithCustomers() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "mysite";
  const db = client.db(dbName);

  return db
    .collection<BookingDoc>("bookings")
    .aggregate([
      { $sort: { start: 1, createdAt: 1 } },
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

export async function setBookingStatus(id: string, status: BookingStatus) {
  const bookings = await getBookingsCollection();
  await bookings.updateOne({ _id: new ObjectId(id) }, { $set: { status } });
}

export async function confirmBooking(id: string, start: Date) {
  const bookings = await getBookingsCollection();
  await bookings.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "confirmed", start } }
  );
}
