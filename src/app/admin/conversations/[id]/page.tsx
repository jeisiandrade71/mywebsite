import { notFound } from "next/navigation";
import { getConversationById } from "@/lib/conversations";
import { getCustomersCollection } from "@/lib/customers";
import { listMessagesByConversation } from "@/lib/messages";
import {
  replyToConversationAction,
  toggleConversationAiAction,
} from "../actions";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const conversation = await getConversationById(id);
  if (!conversation) notFound();

  const customers = await getCustomersCollection();
  const customer = await customers.findOne({ _id: conversation.customerId });
  const messages = await listMessagesByConversation(id);

  const replyAction = replyToConversationAction.bind(null, id);
  const toggleAction = toggleConversationAiAction.bind(
    null,
    id,
    !conversation.aiEnabled
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            {customer?.name || customer?.phone}
          </h1>
          <p className="text-sm text-zinc-500">{customer?.phone}</p>
        </div>
        <form action={toggleAction}>
          <button
            type="submit"
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
          >
            {conversation.aiEnabled ? "Desligar IA nessa conversa" : "Ligar IA nessa conversa"}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        {messages.map((message) => (
          <div
            key={message._id.toString()}
            className={
              message.direction === "inbound"
                ? "self-start rounded-lg bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800"
                : "self-end rounded-lg bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
            }
          >
            <div>{message.body}</div>
            <div className="mt-1 text-[10px] opacity-60">
              {message.sender} · {new Date(message.createdAt).toLocaleString("pt-BR")}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-zinc-500">Nenhuma mensagem ainda.</p>
        )}
      </div>

      <form action={replyAction} className="flex gap-2">
        <textarea
          name="body"
          required
          rows={2}
          placeholder="Escreva uma resposta…"
          className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
