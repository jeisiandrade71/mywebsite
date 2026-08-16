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
