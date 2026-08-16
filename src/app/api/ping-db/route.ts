import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || "mysite";
    const result = await client.db(dbName).command({ ping: 1 });
    return NextResponse.json({ ok: true, db: dbName, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
