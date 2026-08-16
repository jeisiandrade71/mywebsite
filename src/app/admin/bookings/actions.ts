"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { confirmBooking, createBooking, setBookingStatus } from "@/lib/bookings";
import { findOrCreateCustomerByPhone } from "@/lib/customers";
import { getServicesCollection } from "@/lib/services";
import { ObjectId } from "mongodb";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("Não autenticado.");
}

export async function confirmBookingAction(id: string, formData: FormData) {
  await requireSession();
  const startValue = String(formData.get("start") || "");
  if (!startValue) throw new Error("Data e horário são obrigatórios.");
  await confirmBooking(id, new Date(startValue));
  revalidatePath("/admin/bookings");
}

export async function cancelBookingAction(id: string) {
  await requireSession();
  await setBookingStatus(id, "cancelled");
  revalidatePath("/admin/bookings");
}

export async function reopenBookingAction(id: string) {
  await requireSession();
  await setBookingStatus(id, "pending");
  revalidatePath("/admin/bookings");
}

export async function createBookingAction(formData: FormData) {
  await requireSession();

  const phone = String(formData.get("phone") || "").trim();
  const serviceId = String(formData.get("serviceId") || "");
  const startValue = String(formData.get("start") || "");
  const notes = String(formData.get("notes") || "").trim();

  if (!phone) throw new Error("Telefone é obrigatório.");
  if (!startValue) throw new Error("Data e horário são obrigatórios.");

  const customer = await findOrCreateCustomerByPhone(phone);

  const services = await getServicesCollection();
  const service = serviceId
    ? await services.findOne({ _id: new ObjectId(serviceId) })
    : null;

  const booking = await createBooking({
    customerId: customer._id,
    serviceId: service?._id ?? null,
    serviceName: service?.name ?? "Serviço não especificado",
    start: new Date(startValue),
    notes,
  });

  await confirmBooking(booking._id.toString(), new Date(startValue));

  revalidatePath("/admin/bookings");
}
