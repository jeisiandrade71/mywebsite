"use client";

import { useState } from "react";
import type { ServiceDoc } from "@/lib/services";
import {
  deleteServiceAction,
  toggleServiceActiveAction,
  updateServiceAction,
} from "./actions";

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ServiceRow({
  service,
}: {
  service: Pick<
    ServiceDoc,
    "name" | "description" | "priceCents" | "durationMinutes" | "active"
  > & { _id: string };
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <tr className="border-b border-zinc-200 dark:border-zinc-800">
        <td colSpan={5} className="p-3">
          <form
            action={async (formData) => {
              await updateServiceAction(service._id, formData);
              setEditing(false);
            }}
            className="flex flex-wrap items-end gap-2"
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500">Nome</label>
              <input
                name="name"
                defaultValue={service.name}
                required
                className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500">Descrição</label>
              <input
                name="description"
                defaultValue={service.description}
                className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500">Preço (R$)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={(service.priceCents / 100).toFixed(2)}
                required
                className="w-24 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500">Duração (min)</label>
              <input
                name="durationMinutes"
                type="number"
                min="1"
                defaultValue={service.durationMinutes}
                required
                className="w-20 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <button
              type="submit"
              className="rounded bg-black px-3 py-1.5 text-sm text-white dark:bg-white dark:text-black"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
            >
              Cancelar
            </button>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-zinc-200 dark:border-zinc-800">
      <td className="p-3">
        <div className="font-medium text-black dark:text-white">
          {service.name}
        </div>
        <div className="text-xs text-zinc-500">{service.description}</div>
      </td>
      <td className="p-3 text-sm">{formatPrice(service.priceCents)}</td>
      <td className="p-3 text-sm">{service.durationMinutes} min</td>
      <td className="p-3 text-sm">
        {service.active ? (
          <span className="text-green-600 dark:text-green-400">Ativo</span>
        ) : (
          <span className="text-zinc-500">Inativo</span>
        )}
      </td>
      <td className="p-3 text-right text-sm">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditing(true)}
            className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            Editar
          </button>
          <button
            onClick={() => toggleServiceActiveAction(service._id, !service.active)}
            className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            {service.active ? "Desativar" : "Ativar"}
          </button>
          <button
            onClick={() => {
              if (confirm(`Excluir "${service.name}"?`)) {
                deleteServiceAction(service._id);
              }
            }}
            className="text-red-600 hover:text-red-700 dark:text-red-400"
          >
            Excluir
          </button>
        </div>
      </td>
    </tr>
  );
}
