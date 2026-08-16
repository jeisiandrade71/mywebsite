"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { updateBusinessSettings } from "@/lib/businessSettings";

export async function updateSettingsAction(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Não autenticado.");

  await updateBusinessSettings({
    businessName: String(formData.get("businessName") || "").trim(),
    hours: String(formData.get("hours") || "").trim(),
    aiInstructions: String(formData.get("aiInstructions") || "").trim(),
  });

  revalidatePath("/admin/settings");
}
