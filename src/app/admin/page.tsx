export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold text-black dark:text-white">
        Dashboard
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Bem-vinda! Próximos agendamentos e conversas recentes vão aparecer
        aqui.
      </p>
    </div>
  );
}
