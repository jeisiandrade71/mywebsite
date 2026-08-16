import clientPromise from "@/lib/mongodb";

async function getDbStatus() {
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || "mysite";
    await client.db(dbName).command({ ping: 1 });
    return { ok: true, db: dbName };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

export default async function Home() {
  const status = await getDbStatus();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-semibold text-black dark:text-zinc-50">
        Hello, World!
      </h1>
      <p
        className={
          status.ok
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }
      >
        {status.ok
          ? `MongoDB conectado (db: ${status.db})`
          : `Falha ao conectar no MongoDB: ${status.error}`}
      </p>
    </div>
  );
}
