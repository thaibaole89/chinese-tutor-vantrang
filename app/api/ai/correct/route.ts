import { NextResponse } from "next/server";
import { correctSentence } from "@/lib/ai";

export const runtime = "nodejs";

const MAX_SENTENCE = 1000;
const MAX_CONTEXT = 2000;

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => ({}));
    const obj = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

    const sentence =
      typeof obj.sentence === "string" ? obj.sentence.slice(0, MAX_SENTENCE) : "";
    const context =
      typeof obj.context === "string" ? obj.context.slice(0, MAX_CONTEXT) : "";

    if (!sentence.trim()) {
      return NextResponse.json({ error: "sentence is required" }, { status: 400 });
    }

    const correction = await correctSentence(sentence, context);
    return NextResponse.json({ correction });
  } catch (err) {
    console.error("[api/ai/correct] error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
