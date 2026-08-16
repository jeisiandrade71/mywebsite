import BookingCalendar from "@/components/BookingCalendar";
import { listBookingsWithCustomers } from "@/lib/bookings";
import { getServicesCollection } from "@/lib/services";
import { listTeamMembers } from "@/lib/teamMembers";

export default async function CalendarPage() {
  const [bookings, services, teamMembers] = await Promise.all([
    listBookingsWithCustomers(),
    getServicesCollection().then((c) => c.find().toArray()),
    listTeamMembers(),
  ]);

  const serviceDuration = new Map(
    services.map((s) => [s._id.toString(), s.durationMinutes])
  );
  const teamLeads = teamMembers.filter((m) => m.role === "teamLead");

  const events = bookings
    .filter((b) => b.status === "confirmed" && b.start)
    .map((b) => {
      const durationMin = b.serviceId
        ? serviceDuration.get(b.serviceId.toString()) ?? 60
        : 60;
      const start = new Date(b.start as Date);
      const end = new Date(start.getTime() + durationMin * 60000);
      return {
        id: b._id.toString(),
        title: `${b.serviceName} — ${b.customer.name || b.customer.phone}`,
        start: start.toISOString(),
        end: end.toISOString(),
        teamLeadId: b.teamLeadId ? b.teamLeadId.toString() : null,
      };
    });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Calendário
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Visão de mês/semana dos agendamentos confirmados.
        </p>
      </div>

      <BookingCalendar
        events={events}
        teamLeads={teamLeads.map((tl) => ({
          id: tl._id.toString(),
          name: tl.name,
        }))}
      />
    </div>
  );
}
