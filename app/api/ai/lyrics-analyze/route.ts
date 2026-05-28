import { NextResponse } from "next/server";
import { analyzeLyrics } from "@/lib/ai";

export const runtime = "nodejs";

const MAX_LYRICS = 3000;
const MAX_META = 120;

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => ({}));
    const obj = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
    const lyrics = typeof obj.lyrics === "string" ? obj.lyrics.slice(0, MAX_LYRICS).trim() : "";
    const title = typeof obj.title === "string" ? obj.title.slice(0, MAX_META).trim() : undefined;
    const artistNote =
      typeof obj.artistNote === "string" ? obj.artistNote.slice(0, MAX_META).trim() : undefined;

    if (!lyrics) {
      return NextResponse.json({ error: "lyrics is required" }, { status: 400 });
    }

    const analysis = await analyzeLyrics(lyrics, title, artistNote);
    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("[api/ai/lyrics-analyze] error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
