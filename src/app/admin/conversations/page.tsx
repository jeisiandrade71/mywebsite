import Link from "next/link";
import { listConversationsWithCustomers } from "@/lib/conversations";

export default async function ConversationsPage() {
  const conversations = await listConversationsWithCustomers();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Conversas
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Mensagens recebidas dos clientes por SMS.
        </p>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-zinc-200 text-xs text-zinc-500 dark:border-zinc-800">
            <th className="p-3 font-medium">Cliente</th>
            <th className="p-3 font-medium">Canal</th>
            <th className="p-3 font-medium">IA</th>
            <th className="p-3 font-medium">Última mensagem</th>
          </tr>
        </thead>
        <tbody>
          {conversations.map((conversation) => (
            <tr
              key={conversation._id.toString()}
              className="border-b border-zinc-200 dark:border-zinc-800"
            >
              <td className="p-3">
                <Link
                  href={`/admin/conversations/${conversation._id.toString()}`}
                  className="font-medium text-black hover:underline dark:text-white"
                >
                  {conversation.customer.name || conversation.customer.phone}
                </Link>
              </td>
              <td className="p-3 text-sm uppercase">{conversation.channel}</td>
              <td className="p-3 text-sm">
                {conversation.aiEnabled ? (
                  <span className="text-green-600 dark:text-green-400">
                    Ativa
                  </span>
                ) : (
                  <span className="text-zinc-500">Desligada</span>
                )}
              </td>
              <td className="p-3 text-sm text-zinc-500">
                {new Date(conversation.lastMessageAt).toLocaleString("pt-BR")}
              </td>
            </tr>
          ))}
          {conversations.length === 0 && (
            <tr>
              <td colSpan={4} className="p-3 text-sm text-zinc-500">
                Nenhuma conversa ainda. Manda um SMS pro número{" "}
                {process.env.TWILIO_SMS_NUMBER} pra testar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
