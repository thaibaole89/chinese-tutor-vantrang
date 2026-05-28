import { NextResponse } from "next/server";
import { wechatCoach } from "@/lib/ai";

export const runtime = "nodejs";

const MAX_INPUT = 1000;

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => ({}));
    const obj = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
    const userInput =
      typeof obj.userInput === "string" ? obj.userInput.slice(0, MAX_INPUT).trim() : "";

    if (!userInput) {
      return NextResponse.json({ error: "userInput is required" }, { status: 400 });
    }

    const result = await wechatCoach(userInput);
    return NextResponse.json({ result });
  } catch (err) {
    console.error("[api/ai/wechat-coach] error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
