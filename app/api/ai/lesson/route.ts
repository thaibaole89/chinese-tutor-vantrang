import { NextResponse } from "next/server";
import { generateLesson } from "@/lib/ai";

export const runtime = "nodejs";

const MIN_DAY = 1;
const MAX_DAY = 365;
const MAX_TOPIC = 200;
const DEFAULT_TOPIC = "business chinese";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => ({}));
    const obj = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

    const rawDay = obj.day;
    const dayNumber =
      typeof rawDay === "number"
        ? rawDay
        : typeof rawDay === "string" && /^\d+$/.test(rawDay)
        ? Number(rawDay)
        : NaN;

    if (!Number.isInteger(dayNumber) || dayNumber < MIN_DAY || dayNumber > MAX_DAY) {
      return NextResponse.json(
        { error: `day must be integer ${MIN_DAY}-${MAX_DAY}` },
        { status: 400 },
      );
    }

    const topicRaw = typeof obj.topic === "string" ? obj.topic.trim() : "";
    const topic = (topicRaw || DEFAULT_TOPIC).slice(0, MAX_TOPIC);

    const lesson = await generateLesson(dayNumber, topic);
    return NextResponse.json({ lesson });
  } catch (err) {
    console.error("[api/ai/lesson] error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
