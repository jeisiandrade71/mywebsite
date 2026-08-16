import { listTeamMembers } from "@/lib/teamMembers";
import {
  createTeamMemberAction,
  deleteTeamMemberAction,
  toggleTeamMemberActiveAction,
} from "./actions";

const ROLE_LABELS: Record<string, string> = {
  teamLead: "Chefe de Equipe",
  helper: "Helper",
};

export default async function TeamPage() {
  const members = await listTeamMembers();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Equipe
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Chefes de equipe e helpers entram em{" "}
          <span className="font-mono">/team/login</span> com o email e a
          senha que você definir aqui.
        </p>
      </div>

      <form
        action={createTeamMemberAction}
        className="flex flex-wrap items-end gap-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Nome</label>
          <input
            name="name"
            required
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Telefone</label>
          <input
            name="phone"
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Email</label>
          <input
            name="email"
            type="email"
            required
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Senha temporária</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Papel</label>
          <select
            name="role"
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="helper">Helper</option>
            <option value="teamLead">Chefe de Equipe</option>
          </select>
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
            <th className="p-3 font-medium">Nome</th>
            <th className="p-3 font-medium">Papel</th>
            <th className="p-3 font-medium">Contato</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            const toggleAction = toggleTeamMemberActiveAction.bind(
              null,
              member._id.toString(),
              !member.active
            );
            const deleteAction = deleteTeamMemberAction.bind(
              null,
              member._id.toString()
            );
            return (
              <tr
                key={member._id.toString()}
                className="border-b border-zinc-200 dark:border-zinc-800"
              >
                <td className="p-3 font-medium text-black dark:text-white">
                  {member.name}
                </td>
                <td className="p-3 text-sm">{ROLE_LABELS[member.role]}</td>
                <td className="p-3 text-sm text-zinc-500">
                  {member.email}
                  {member.phone ? ` · ${member.phone}` : ""}
                </td>
                <td className="p-3 text-sm">
                  {member.active ? (
                    <span className="text-green-600 dark:text-green-400">
                      Ativo
                    </span>
                  ) : (
                    <span className="text-zinc-500">Inativo</span>
                  )}
                </td>
                <td className="p-3 text-right text-sm">
                  <div className="flex justify-end gap-3">
                    <form action={toggleAction}>
                      <button
                        type="submit"
                        className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                      >
                        {member.active ? "Desativar" : "Ativar"}
                      </button>
                    </form>
                    <form action={deleteAction}>
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        Excluir
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
          {members.length === 0 && (
            <tr>
              <td colSpan={5} className="p-3 text-sm text-zinc-500">
                Ninguém cadastrado ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
