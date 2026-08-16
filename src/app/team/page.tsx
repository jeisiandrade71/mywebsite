import { auth } from "@/auth";

export default async function TeamDashboard() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold text-black dark:text-white">
        Olá, {session?.user?.name || session?.user?.email}
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Nenhuma vaga disponível ainda — isso chega na próxima fase.
      </p>
    </div>
  );
}
