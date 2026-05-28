"use client";

import { useState } from "react";
import type { LyricsAnalysis, LyricsLine } from "@/lib/types";
import { SpeakButton } from "./SpeakButton";

/**
 * Karaoke-style lyrics analyzer. Strictly user-provided text — the app
 * never bundles, fetches, scrapes, or hotlinks lyrics. The original-sample
 * in the placeholder is written specifically for this app, not from any
 * copyrighted song.
 */

const SAMPLE_TITLE = "(Tiêu đề — bạn tự đặt, app không tra cứu)";
const SAMPLE_ARTIST = "(Tên ca sĩ — chỉ để ghi chú riêng cho bạn)";

const SAMPLE_LYRICS = `夜风轻轻吹，月亮挂在窗
我想起那条街，那杯热茶的香
时间一直走，心还停在你的方向`;

const DAILY_LABEL: Record<LyricsLine["dailyUse"], string> = {
  yes: "✓ Dùng được",
  careful: "⚠ Cẩn thận",
  no: "✗ Văn vẻ, đừng dùng",
};

const DAILY_TONE: Record<LyricsLine["dailyUse"], string> = {
  yes: "bg-emerald-50 text-emerald-800 border-emerald-200",
  careful: "bg-amber-50 text-amber-800 border-amber-200",
  no: "bg-rose-50 text-rose-800 border-rose-200",
};

export function LyricsMode() {
  const [lyrics, setLyrics] = useState("");
  const [title, setTitle] = useState("");
  const [artistNote, setArtistNote] = useState("");
  const [result, setResult] = useState<LyricsAnalysis | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const analyze = async () => {
    const text = lyrics.trim();
    if (!text || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setActiveIdx(0);
    try {
      const res = await fetch("/api/ai/lyrics-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lyrics: text,
          title: title.trim() || undefined,
          artistNote: artistNote.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setResult(data.analysis as LyricsAnalysis);
    } catch (err) {
      console.error("[lyrics-mode] failed:", err);
      setError("Không phân tích được. Thử lại sau hoặc kiểm tra console.");
    } finally {
      setBusy(false);
    }
  };

  const loadSample = () => {
    setLyrics(SAMPLE_LYRICS);
    setTitle("");
    setArtistNote("");
  };

  return (
    <div className="space-y-8">
      {/* Copyright notice */}
      <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-light text-amber-900">
        <strong className="font-bold">Lưu ý bản quyền:</strong> App không lưu trữ, scrape hoặc
        gửi đi lyrics bài hát thật. Bạn dán chính text bạn đã có (đoạn ngắn để study). Sample
        bên dưới là lyric gốc viết riêng cho app — không phải bài hát có bản quyền.
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          analyze();
        }}
        className="bg-canvas border border-hairline p-6 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="label-uppercase text-muted block mb-1">Tiêu đề (tuỳ chọn)</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={SAMPLE_TITLE}
              maxLength={120}
              className="text-input"
            />
          </label>
          <label className="block">
            <span className="label-uppercase text-muted block mb-1">Ghi chú ca sĩ (tuỳ chọn)</span>
            <input
              type="text"
              value={artistNote}
              onChange={(e) => setArtistNote(e.target.value)}
              placeholder={SAMPLE_ARTIST}
              maxLength={120}
              className="text-input"
            />
          </label>
        </div>

        <label className="block">
          <span className="label-uppercase text-muted block mb-1">
            Lyrics (mỗi dòng / câu trên 1 hàng — tiếng Trung)
          </span>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            rows={6}
            maxLength={3000}
            placeholder="Dán đoạn lyrics tiếng Trung bạn muốn học — mỗi dòng 1 câu."
            className="zh w-full p-3 text-base font-light border border-hairline focus:border-ink-900 outline-none"
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={loadSample} className="btn-text-link">
            DÙNG SAMPLE GỐC (DEMO)
          </button>
          <button type="submit" className="btn-primary" disabled={busy || !lyrics.trim()}>
            {busy ? "ĐANG PHÂN TÍCH..." : "PHÂN TÍCH LYRICS"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="border border-red-600 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      {result ? (
        <>
          {/* Header */}
          <div className="border border-hairline bg-canvas p-5">
            <div className="label-uppercase text-muted">Đang phân tích</div>
            {result.title ? (
              <div className="text-xl font-bold mt-2">{result.title}</div>
            ) : null}
            {result.artistNote ? (
              <div className="text-sm font-light text-muted mt-1">
                Ca sĩ (ghi chú): {result.artistNote}
              </div>
            ) : null}
            <div className="text-xs font-light text-muted mt-2">
              {result.lines.length} dòng — bấm Next/Prev để focus từng dòng.
            </div>
          </div>

          {/* Karaoke list */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="label-uppercase text-muted">Karaoke breakdown</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
                  className="btn-secondary text-xs"
                  disabled={activeIdx === 0}
                >
                  ← TRƯỚC
                </button>
                <span className="text-xs font-light text-muted">
                  {activeIdx + 1} / {result.lines.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIdx(Math.min(result.lines.length - 1, activeIdx + 1))
                  }
                  className="btn-secondary text-xs"
                  disabled={activeIdx + 1 >= result.lines.length}
                >
                  TIẾP →
                </button>
              </div>
            </div>
            <ul className="space-y-px bg-hairline border border-hairline">
              {result.lines.map((line, i) => {
                const active = i === activeIdx;
                return (
                  <li
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`cursor-pointer bg-canvas p-5 transition border-l-4 ${
                      active ? "border-l-bmw-blue bg-bmw-blue/[0.03]" : "border-l-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="label-uppercase text-muted">Dòng {i + 1}</div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-[1px] border px-2 py-0.5 ${
                          DAILY_TONE[line.dailyUse]
                        }`}
                      >
                        {DAILY_LABEL[line.dailyUse]}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div
                        className={`zh flex-1 leading-snug ${
                          active ? "text-2xl font-bold" : "text-lg font-bold opacity-70"
                        }`}
                      >
                        {line.zh}
                      </div>
                      <SpeakButton text={line.zh} size="sm" rate={0.85} />
                    </div>
                    {line.pinyin ? (
                      <div className="text-xs font-normal text-muted mt-1 tracking-[0.3px]">
                        {line.pinyin}
                      </div>
                    ) : null}
                    {line.vi ? (
                      <div className="text-sm font-light text-body mt-1">{line.vi}</div>
                    ) : null}
                    {line.keyPhrases.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {line.keyPhrases.map((p) => (
                          <span key={p} className="chip">
                            <span className="zh">{p}</span>
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {(line.spokenEquivalentZh || line.spokenEquivalentVi) && active ? (
                      <div className="mt-3 bg-surface-soft border border-hairline px-3 py-2">
                        <div className="label-uppercase text-bmw-blue mb-1">
                          Spoken equivalent
                        </div>
                        {line.spokenEquivalentZh ? (
                          <div className="zh text-base font-bold">{line.spokenEquivalentZh}</div>
                        ) : null}
                        {line.spokenEquivalentVi ? (
                          <div className="text-xs font-light text-body mt-1">
                            {line.spokenEquivalentVi}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {line.styleNoteVi && active ? (
                      <div className="mt-2 text-xs font-light text-muted">
                        💡 {line.styleNoteVi}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Shadowing prompts */}
          {result.shadowingPrompts.length ? (
            <div>
              <span className="label-uppercase text-muted block mb-3">
                Listening / Shadowing prompts
              </span>
              <ul className="space-y-2">
                {result.shadowingPrompts.map((p, i) => (
                  <li
                    key={i}
                    className="bg-canvas border border-hairline px-4 py-3 text-sm font-light text-body"
                  >
                    🎙️ {p}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
