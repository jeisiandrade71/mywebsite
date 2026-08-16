"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { acceptHelperSlot } from "@/lib/bookings";

export async function acceptJobAction(bookingId: string) {
  const session = await auth();
  if (!session || (session.user.role !== "helper" && session.user.role !== "admin")) {
    throw new Error("Não autorizado.");
  }

  const accepted = await acceptHelperSlot(bookingId, new ObjectId(session.user.id));
  if (!accepted) {
    throw new Error("Essa vaga já foi preenchida.");
  }

  revalidatePath("/team");
}
