import { listBookingsWithCustomers } from "@/lib/bookings";
import { listActiveServices } from "@/lib/services";
import { listTeamMembers } from "@/lib/teamMembers";
import {
  assignHelperSlotsAction,
  cancelBookingAction,
  confirmBookingAction,
  createBookingAction,
  reopenBookingAction,
} from "./actions";

function formatPay(cents: number | null) {
  if (cents === null) return null;
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Date(date).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function BookingsPage() {
  const [bookings, services, teamMembers] = await Promise.all([
    listBookingsWithCustomers(),
    listActiveServices(),
    listTeamMembers(),
  ]);

  const teamLeads = teamMembers.filter((m) => m.role === "teamLead" && m.active);
  const teamLeadNames = new Map(
    teamMembers.map((m) => [m._id.toString(), m.name])
  );

  const pending = bookings.filter((b) => b.status === "pending");
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Agenda
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Pedidos de agendamento criados pela IA aparecem como pendentes até
          você confirmar a data/horário.
        </p>
      </div>

      <form
        action={createBookingAction}
        className="flex flex-wrap items-end gap-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Telefone do cliente</label>
          <input
            name="phone"
            placeholder="+15551234567"
            required
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Serviço</label>
          <select
            name="serviceId"
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            {services.map((s) => (
              <option key={s._id.toString()} value={s._id.toString()}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Data e horário</label>
          <input
            name="start"
            type="datetime-local"
            required
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Notas</label>
          <input
            name="notes"
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-black px-3 py-1.5 text-sm text-white dark:bg-white dark:text-black"
        >
          Criar e confirmar
        </button>
      </form>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-500">
          Pendentes ({pending.length})
        </h2>
        {pending.length === 0 && (
          <p className="text-sm text-zinc-500">Nenhum pedido pendente.</p>
        )}
        {pending.map((b) => {
          const confirmAction = confirmBookingAction.bind(null, b._id.toString());
          const cancelAction = cancelBookingAction.bind(null, b._id.toString());
          return (
            <div
              key={b._id.toString()}
              className="rounded-lg border border-amber-300 p-4 dark:border-amber-800"
            >
              <div className="font-medium text-black dark:text-white">
                {b.serviceName} — {b.customer.name || b.customer.phone}
              </div>
              <div className="text-sm text-zinc-500">{b.notes}</div>
              <form action={confirmAction} className="mt-2 flex items-end gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-500">
                    Confirmar para (data/horário)
                  </label>
                  <input
                    name="start"
                    type="datetime-local"
                    required
                    className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded bg-black px-3 py-1.5 text-sm text-white dark:bg-white dark:text-black"
                >
                  Confirmar
                </button>
              </form>
              <form action={cancelAction} className="mt-2">
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  Cancelar pedido
                </button>
              </form>
            </div>
          );
        })}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-500">
          Confirmados ({confirmed.length})
        </h2>
        {confirmed.length === 0 && (
          <p className="text-sm text-zinc-500">Nenhum agendamento confirmado.</p>
        )}
        {confirmed.map((b) => {
          const cancelAction = cancelBookingAction.bind(null, b._id.toString());
          const assignAction = assignHelperSlotsAction.bind(null, b._id.toString());
          const helperCount = b.helperIds?.length || 0;
          const helperSlots = b.helperSlots || 0;
          return (
            <div
              key={b._id.toString()}
              className="rounded-lg border border-green-300 p-4 dark:border-green-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-black dark:text-white">
                    {formatDate(b.start)} — {b.serviceName}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {b.customer.name || b.customer.phone}
                    {b.notes ? ` · ${b.notes}` : ""}
                  </div>
                </div>
                <form action={cancelAction}>
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Cancelar
                  </button>
                </form>
              </div>

              <div className="mt-3 border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
                {helperSlots > 0 ? (
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Chefe: {b.teamLeadId ? teamLeadNames.get(b.teamLeadId.toString()) || "—" : "—"}
                    {" · "}
                    Vagas: {helperCount}/{helperSlots}
                    {formatPay(b.helperPayCents) ? ` · ${formatPay(b.helperPayCents)} por helper` : ""}
                  </p>
                ) : (
                  <p className="text-zinc-500">Sem vagas de helper abertas.</p>
                )}
                <form action={assignAction} className="mt-2 flex flex-wrap items-end gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-500">Chefe de equipe</label>
                    <select
                      name="teamLeadId"
                      defaultValue={b.teamLeadId?.toString() || ""}
                      className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      <option value="">Nenhuma</option>
                      {teamLeads.map((tl) => (
                        <option key={tl._id.toString()} value={tl._id.toString()}>
                          {tl.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-500">Vagas de helper</label>
                    <input
                      name="helperSlots"
                      type="number"
                      min="0"
                      defaultValue={helperSlots}
                      className="w-20 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-500">Valor por helper (US$)</label>
                    <input
                      name="helperPay"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={
                        b.helperPayCents !== null ? (b.helperPayCents / 100).toFixed(2) : ""
                      }
                      className="w-24 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
                  >
                    Salvar
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </section>

      {cancelled.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-zinc-500">
            Cancelados ({cancelled.length})
          </h2>
          {cancelled.map((b) => {
            const reopenAction = reopenBookingAction.bind(null, b._id.toString());
            return (
              <div
                key={b._id.toString()}
                className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 opacity-60 dark:border-zinc-800"
              >
                <div>
                  <div className="font-medium text-black dark:text-white">
                    {b.serviceName} — {b.customer.name || b.customer.phone}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {formatDate(b.start) || "Sem data"}
                  </div>
                </div>
                <form action={reopenAction}>
                  <button
                    type="submit"
                    className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                  >
                    Reabrir como pendente
                  </button>
                </form>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
