import { NextResponse } from "next/server";
import twilioClient from "@/lib/twilio";

export async function GET() {
  try {
    const messages = await twilioClient.messages.list({ limit: 1 });
    return NextResponse.json({
      ok: true,
      credentialsValid: true,
      sampleMessageCount: messages.length,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
