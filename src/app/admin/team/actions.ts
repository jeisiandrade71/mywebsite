"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  createTeamMember,
  deleteTeamMember,
  findTeamMemberByEmail,
  setTeamMemberActive,
  type TeamRole,
} from "@/lib/teamMembers";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    throw new Error("Não autorizado.");
  }
}

export async function createTeamMemberAction(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const role = String(formData.get("role") || "helper") as TeamRole;

  if (!email || !password || !name) {
    throw new Error("Nome, email e senha são obrigatórios.");
  }
  if (password.length < 8) {
    throw new Error("A senha precisa ter pelo menos 8 caracteres.");
  }

  const existing = await findTeamMemberByEmail(email);
  if (existing) {
    throw new Error("Já existe alguém cadastrado com esse email.");
  }

  await createTeamMember({ email, password, name, phone, role });
  revalidatePath("/admin/team");
}

export async function toggleTeamMemberActiveAction(
  id: string,
  active: boolean
) {
  await requireAdmin();
  await setTeamMemberActive(id, active);
  revalidatePath("/admin/team");
}

export async function deleteTeamMemberAction(id: string) {
  await requireAdmin();
  await deleteTeamMember(id);
  revalidatePath("/admin/team");
}
