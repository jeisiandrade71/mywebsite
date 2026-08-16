import { auth } from "@/auth";
import { listJobsForTeamLead, listOpenJobsForHelpers } from "@/lib/bookings";
import { listTeamMembers } from "@/lib/teamMembers";
import { ObjectId } from "mongodb";
import { acceptJobAction } from "./actions";

function formatDate(date: Date | null) {
  if (!date) return "Sem data definida";
  return new Date(date).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatPay(cents: number | null) {
  if (cents === null) return null;
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default async function TeamDashboard() {
  const session = await auth();
  if (!session) return null;

  const { role, id, name, email } = session.user;

  if (role === "helper") {
    const jobs = await listOpenJobsForHelpers();
    const myOpenJobs = jobs.filter(
      (j) => !j.helperIds?.some((h: ObjectId) => h.toString() === id)
    );

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Olá, {name || email}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Vagas disponíveis pra ajudar.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {myOpenJobs.map((job) => {
            const accept = acceptJobAction.bind(null, job._id.toString());
            const slotsLeft = (job.helperSlots || 0) - (job.helperIds?.length || 0);
            return (
              <div
                key={job._id.toString()}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <div className="font-medium text-black dark:text-white">
                  {job.serviceName}
                </div>
                <div className="text-sm text-zinc-500">
                  {formatDate(job.start)} · {slotsLeft} vaga(s) disponível(is)
                  {formatPay(job.helperPayCents) ? ` · ${formatPay(job.helperPayCents)}` : ""}
                </div>
                <form action={accept} className="mt-2">
                  <button
                    type="submit"
                    className="rounded bg-teal-600 px-3 py-1.5 text-sm font-medium text-white"
                  >
                    Aceitar
                  </button>
                </form>
              </div>
            );
          })}
          {myOpenJobs.length === 0 && (
            <p className="text-sm text-zinc-500">
              Nenhuma vaga disponível no momento.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (role === "teamLead") {
    const jobs = await listJobsForTeamLead(new ObjectId(id));
    const teamMembers = await listTeamMembers();
    const helperNames = new Map(teamMembers.map((m) => [m._id.toString(), m.name]));

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Olá, {name || email}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Trabalhos onde você é a chefe de equipe responsável.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <div
              key={job._id.toString()}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="font-medium text-black dark:text-white">
                {job.serviceName} — {job.customer.name || job.customer.phone}
              </div>
              <div className="text-sm text-zinc-500">
                {formatDate(job.start)} · Status: {job.status}
              </div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Helpers ({job.helperIds?.length || 0}/{job.helperSlots || 0}):{" "}
                {job.helperIds && job.helperIds.length > 0
                  ? job.helperIds
                      .map((h: ObjectId) => helperNames.get(h.toString()) || "—")
                      .join(", ")
                  : "nenhuma ainda"}
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <p className="text-sm text-zinc-500">
              Nenhum trabalho atribuído a você ainda.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold text-black dark:text-white">
        Olá, {name || email}
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Você está logada como administradora — use o painel /admin.
      </p>
    </div>
  );
}
