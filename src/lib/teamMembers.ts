import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export type TeamRole = "teamLead" | "helper";

export interface TeamMemberDoc {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  role: TeamRole;
  active: boolean;
  createdAt: Date;
}

export async function getTeamMembersCollection() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "mysite";
  return client.db(dbName).collection<TeamMemberDoc>("teamMembers");
}

export async function findTeamMemberByEmail(email: string) {
  const members = await getTeamMembersCollection();
  return members.findOne({ email: email.toLowerCase() });
}

export async function listTeamMembers() {
  const members = await getTeamMembersCollection();
  return members.find().sort({ createdAt: -1 }).toArray();
}

export async function createTeamMember(input: {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: TeamRole;
}) {
  const members = await getTeamMembersCollection();
  const passwordHash = await bcrypt.hash(input.password, 12);
  const doc: TeamMemberDoc = {
    _id: new ObjectId(),
    email: input.email.toLowerCase(),
    passwordHash,
    name: input.name,
    phone: input.phone,
    role: input.role,
    active: true,
    createdAt: new Date(),
  };
  await members.insertOne(doc);
  return doc;
}

export async function setTeamMemberActive(id: string, active: boolean) {
  const members = await getTeamMembersCollection();
  await members.updateOne({ _id: new ObjectId(id) }, { $set: { active } });
}

export async function deleteTeamMember(id: string) {
  const members = await getTeamMembersCollection();
  await members.deleteOne({ _id: new ObjectId(id) });
}
