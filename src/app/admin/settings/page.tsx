import { getBusinessSettings } from "@/lib/businessSettings";
import { updateSettingsAction } from "./actions";

export default async function SettingsPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Configurações
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Esses dados alimentam as respostas automáticas da IA.
        </p>
      </div>

      <form
        action={updateSettingsAction}
        className="flex max-w-xl flex-col gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Nome do negócio</label>
          <input
            name="businessName"
            defaultValue={settings.businessName}
            required
            className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Horário de funcionamento</label>
          <input
            name="hours"
            defaultValue={settings.hours}
            required
            className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">
            Instruções para a IA (tom de voz, como agir, etc.)
          </label>
          <textarea
            name="aiInstructions"
            defaultValue={settings.aiInstructions}
            rows={5}
            required
            className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <button
          type="submit"
          className="self-start rounded bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Salvar
        </button>
      </form>
    </div>
  );
}
