import { NextResponse } from "next/server";
import { roleplayReply } from "@/lib/ai";

export const runtime = "nodejs";

type HistoryMsg = { role: "user" | "assistant"; content: string };

function isHistoryMsg(m: unknown): m is HistoryMsg {
  if (!m || typeof m !== "object") return false;
  const obj = m as Record<string, unknown>;
  return (
    (obj.role === "user" || obj.role === "assistant") &&
    typeof obj.content === "string"
  );
}

function normalizeHistory(input: unknown): HistoryMsg[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(isHistoryMsg)
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => ({}));
    const obj = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

    const scenarioContext =
      typeof obj.scenarioContext === "string" ? obj.scenarioContext.slice(0, 2000) : "";
    const history = normalizeHistory(obj.history);
    const userMessage =
      typeof obj.userMessage === "string" ? obj.userMessage.slice(0, 1000) : "";

    if (!userMessage.trim()) {
      return NextResponse.json({ error: "userMessage is required" }, { status: 400 });
    }

    const reply = await roleplayReply(scenarioContext, history, userMessage);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[api/ai/roleplay] error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
