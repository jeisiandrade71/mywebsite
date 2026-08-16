"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  createService,
  deleteService,
  setServiceActive,
  updateService,
} from "@/lib/services";

async function requireSession() {
  const session = await auth();
  if (!session) {
    throw new Error("Não autenticado.");
  }
}

function parseServiceForm(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceReais = Number(formData.get("price") || 0);
  const durationMinutes = Number(formData.get("durationMinutes") || 0);

  if (!name) throw new Error("Nome é obrigatório.");
  if (!Number.isFinite(priceReais) || priceReais < 0) {
    throw new Error("Preço inválido.");
  }
  if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    throw new Error("Duração inválida.");
  }

  return {
    name,
    description,
    priceCents: Math.round(priceReais * 100),
    durationMinutes,
  };
}

export async function createServiceAction(formData: FormData) {
  await requireSession();
  const input = parseServiceForm(formData);
  await createService(input);
  revalidatePath("/admin/services");
}

export async function updateServiceAction(id: string, formData: FormData) {
  await requireSession();
  const input = parseServiceForm(formData);
  await updateService(id, input);
  revalidatePath("/admin/services");
}

export async function toggleServiceActiveAction(
  id: string,
  active: boolean
) {
  await requireSession();
  await setServiceActive(id, active);
  revalidatePath("/admin/services");
}

export async function deleteServiceAction(id: string) {
  await requireSession();
  await deleteService(id);
  revalidatePath("/admin/services");
}
