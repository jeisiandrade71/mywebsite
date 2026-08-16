"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { acceptHelperSlot, getBookingsCollection } from "@/lib/bookings";
import { getTeamMembersCollection } from "@/lib/teamMembers";
import { sendEmail } from "@/lib/email";

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

  try {
    const bookings = await getBookingsCollection();
    const booking = await bookings.findOne({ _id: new ObjectId(bookingId) });
    if (booking?.teamLeadId) {
      const members = await getTeamMembersCollection();
      const [teamLead, helper] = await Promise.all([
        members.findOne({ _id: booking.teamLeadId }),
        members.findOne({ _id: new ObjectId(session.user.id) }),
      ]);
      if (teamLead) {
        await sendEmail({
          to: teamLead.email,
          subject: `Vaga preenchida — ${booking.serviceName}`,
          html: `<p><strong>${helper?.name || session.user.email}</strong> aceitou ajudar em <strong>${booking.serviceName}</strong>.</p>
<p><strong>Vagas:</strong> ${booking.helperIds.length}/${booking.helperSlots}</p>
<p>Confira em /team.</p>`,
        });
      }
    }
  } catch (error) {
    console.error("Falha ao enviar e-mail de vaga aceita:", error);
  }
}
