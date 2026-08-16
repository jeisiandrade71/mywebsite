import clientPromise from "@/lib/mongodb";

export interface BusinessSettingsDoc {
  _id: "singleton";
  businessName: string;
  hours: string;
  aiInstructions: string;
  updatedAt: Date;
}

const DEFAULTS: Omit<BusinessSettingsDoc, "updatedAt"> = {
  _id: "singleton",
  businessName: "Minha Empresa de Limpeza",
  hours: "Segunda a sexta, 8h às 18h",
  aiInstructions:
    "Seja simpática, breve e direta. Responda dúvidas sobre preço, horário e serviços com base na lista de serviços fornecida. Se o cliente quiser agendar, pergunte o serviço desejado, data e horário preferidos.",
};

export async function getBusinessSettingsCollection() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "mysite";
  return client
    .db(dbName)
    .collection<BusinessSettingsDoc>("businessSettings");
}

export async function getBusinessSettings() {
  const settings = await getBusinessSettingsCollection();
  const existing = await settings.findOne({ _id: "singleton" });
  if (existing) return existing;

  const doc: BusinessSettingsDoc = { ...DEFAULTS, updatedAt: new Date() };
  await settings.insertOne(doc);
  return doc;
}

export async function updateBusinessSettings(input: {
  businessName: string;
  hours: string;
  aiInstructions: string;
}) {
  const settings = await getBusinessSettingsCollection();
  await settings.updateOne(
    { _id: "singleton" },
    { $set: { ...input, updatedAt: new Date() } },
    { upsert: true }
  );
}
