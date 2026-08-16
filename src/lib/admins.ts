import clientPromise from "@/lib/mongodb";

export interface AdminDoc {
  _id?: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export async function getAdminsCollection() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "mysite";
  return client.db(dbName).collection<AdminDoc>("admins");
}

export async function findAdminByEmail(email: string) {
  const admins = await getAdminsCollection();
  return admins.findOne({ email: email.toLowerCase() });
}

export async function listAdminEmails() {
  const admins = await getAdminsCollection();
  const docs = await admins.find().toArray();
  return docs.map((a) => a.email);
}
