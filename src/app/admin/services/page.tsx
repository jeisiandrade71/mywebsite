import { listServices } from "@/lib/services";
import { createServiceAction } from "./actions";
import ServiceRow from "./ServiceRow";

export default async function ServicesPage() {
  const services = await listServices();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Serviços
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Serviços oferecidos — a IA usa essa lista para responder perguntas
          de preço e disponibilidade.
        </p>
      </div>

      <form
        action={createServiceAction}
        className="flex flex-wrap items-end gap-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Nome</label>
          <input
            name="name"
            required
            placeholder="Limpeza padrão"
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Descrição</label>
          <input
            name="description"
            placeholder="Limpeza geral do apartamento"
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Preço (US$)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="150.00"
            className="w-24 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Duração (min)</label>
          <input
            name="durationMinutes"
            type="number"
            min="1"
            required
            placeholder="120"
            className="w-20 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-black px-3 py-1.5 text-sm text-white dark:bg-white dark:text-black"
        >
          Adicionar
        </button>
      </form>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-zinc-200 text-xs text-zinc-500 dark:border-zinc-800">
            <th className="p-3 font-medium">Serviço</th>
            <th className="p-3 font-medium">Preço</th>
            <th className="p-3 font-medium">Duração</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <ServiceRow
              key={service._id.toString()}
              service={{ ...service, _id: service._id.toString() }}
            />
          ))}
          {services.length === 0 && (
            <tr>
              <td colSpan={5} className="p-3 text-sm text-zinc-500">
                Nenhum serviço cadastrado ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
