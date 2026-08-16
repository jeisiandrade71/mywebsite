import Anthropic from "@anthropic-ai/sdk";
import { getBusinessSettings } from "@/lib/businessSettings";
import { listActiveServices } from "@/lib/services";
import { listMessagesByConversation } from "@/lib/messages";
import type { CustomerDoc } from "@/lib/customers";
import type { ConversationDoc } from "@/lib/conversations";

const client = new Anthropic();

const PROPOSE_BOOKING_TOOL: Anthropic.Tool = {
  name: "propose_booking",
  description:
    "Registra um pedido de agendamento do cliente como pendente, para confirmação manual da administradora. Use quando o cliente já indicou o serviço desejado e uma preferência de data/horário.",
  input_schema: {
    type: "object",
    properties: {
      serviceName: {
        type: "string",
        description: "Nome do serviço solicitado pelo cliente",
      },
      preferredDate: {
        type: "string",
        description:
          "Data e horário preferidos pelo cliente, em texto livre (ex: 'sexta-feira à tarde', 'dia 20 às 14h')",
      },
      notes: {
        type: "string",
        description: "Detalhes adicionais relevantes para o agendamento",
      },
    },
    required: ["serviceName", "preferredDate"],
  },
};

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

async function buildSystemPrompt() {
  const [settings, services] = await Promise.all([
    getBusinessSettings(),
    listActiveServices(),
  ]);

  const servicesText = services.length
    ? services
        .map(
          (s) =>
            `- ${s.name}: ${formatPrice(s.priceCents)}, ${s.durationMinutes} min. ${s.description}`
        )
        .join("\n")
    : "Nenhum serviço cadastrado ainda.";

  return `Você é a assistente de atendimento via SMS de "${settings.businessName}".

Horário de funcionamento: ${settings.hours}

Serviços oferecidos:
${servicesText}

Instruções: ${settings.aiInstructions}

Responda sempre em português do Brasil, em mensagens curtas (é SMS). Nunca invente preços ou serviços fora da lista acima. Se não souber algo, diga que a administradora vai confirmar.`;
}

export async function generateAiReply(
  conversation: ConversationDoc,
  _customer: CustomerDoc,
  onBookingProposed: (input: {
    serviceName: string;
    preferredDate: string;
    notes: string;
  }) => Promise<void>
): Promise<string> {
  const system = await buildSystemPrompt();
  const history = await listMessagesByConversation(
    conversation._id.toString()
  );

  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.direction === "inbound" ? "user" : "assistant",
    content: m.body,
  }));

  let finalText = "";

  for (let i = 0; i < 3; i++) {
    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      system,
      thinking: { type: "adaptive" },
      output_config: { effort: "low" },
      tools: [PROPOSE_BOOKING_TOOL],
      messages,
    });

    const textBlocks = response.content.filter(
      (b): b is Anthropic.TextBlock => b.type === "text"
    );
    finalText = textBlocks
      .map((b) => b.text)
      .join("\n")
      .trim();

    if (response.stop_reason !== "tool_use") {
      break;
    }

    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type === "tool_use" && block.name === "propose_booking") {
        const input = block.input as {
          serviceName: string;
          preferredDate: string;
          notes?: string;
        };
        await onBookingProposed({
          serviceName: input.serviceName,
          preferredDate: input.preferredDate,
          notes: input.notes || "",
        });
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content:
            "Agendamento pendente registrado. A administradora vai confirmar.",
        });
      }
    }
    messages.push({ role: "user", content: toolResults });
  }

  return finalText || "Recebemos sua mensagem, já te respondemos em breve.";
}
