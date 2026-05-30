"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  type Card,
  type CardTopic,
  TOPIC_FILTERS,
  cardCountsByTopic,
  filterCards,
  getAllCards,
} from "@/lib/cardAdapter";
import { usePinyinPreference } from "@/lib/pinyinPreference";
import { SpeakButton } from "./SpeakButton";
import { getFlashcards, upsertVocabAsFlashcards } from "@/lib/storage";

/** localStorage key for saved-card IDs (separate from full flashcards). */
const SAVED_CARDS_KEY = "ctb.savedCards.v1";

function readSaved(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(SAVED_CARDS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.map(String)) : new Set();
  } catch {
    return new Set();
  }
}
function writeSaved(s: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVED_CARDS_KEY, JSON.stringify(Array.from(s)));
  } catch {
    /* quota */
  }
}

/**
 * Card-First Home — Vân Trang opens the app, sees ONE phrase, taps to
 * reveal Vietnamese, listens, saves if useful, moves to next.
 *
 * Filter pills (horizontal scroll) re-bucket the deck in place. Pinyin
 * toggle uses the existing global hook so it stays in sync with the
 * NavBar toggle. Audio reuses SpeakButton (speechSynthesis zh-CN).
 *
 * Saved cards: stored as ID set in localStorage AND upserted as full
 * flashcards via the existing storage helper, so the /flashcards page
 * picks them up without any wiring change.
 */
export function CardFirstHome() {
  const allCards = useMemo(() => getAllCards(), []);
  const counts = useMemo(() => cardCountsByTopic(allCards), [allCards]);

  const [topic, setTopic] = useState<CardTopic | "all">("all");
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);
  const { showPinyin, toggle: togglePinyin } = usePinyinPreference();

  // Hydrate saved-card set on mount
  useEffect(() => {
    setSaved(readSaved());
  }, []);

  const filtered = useMemo(() => filterCards(allCards, topic), [allCards, topic]);
  const card = filtered[idx];

  // Reset position + reveal state when filter changes or filtered set shrinks
  useEffect(() => {
    setIdx(0);
    setRevealed(false);
  }, [topic]);

  const handleNext = () => {
    setRevealed(false);
    setSavedFeedback(null);
    setIdx((i) => (i + 1) % Math.max(1, filtered.length));
  };

  const handleSave = () => {
    if (!card) return;
    if (saved.has(card.id)) return;
    // Update local saved set
    const next = new Set(saved);
    next.add(card.id);
    setSaved(next);
    writeSaved(next);
    // Persist into the full flashcard store so /flashcards shows it.
    upsertVocabAsFlashcards(
      [
        {
          id: card.id,
          hanzi: card.chinese,
          pinyin: card.pinyin,
          vietnameseMeaning: card.vietnamese,
          synonyms: [],
          exampleZh: card.exampleChinese || "",
          exampleVi: card.exampleVietnamese || "",
          tags: [card.topic, "saved-from-home"],
          frequencyLevel: "high",
        },
      ],
      { sourceTag: "saved-from-home" },
    );
    setSavedFeedback("✓ Đã lưu vào Thẻ từ");
    window.setTimeout(() => setSavedFeedback(null), 1800);
  };

  const isSaved = card ? saved.has(card.id) : false;

  return (
    <section className="px-4 sm:px-6 pt-4 pb-section">
      {/* ----------------- TOP BAR: pinyin toggle + counter ----------------- */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted">
          {filtered.length > 0 ? `${idx + 1} / ${filtered.length}` : "—"}
        </div>
        <button
          type="button"
          onClick={togglePinyin}
          className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted hover:text-ink-900 border border-hairline px-2 py-1 transition"
          aria-pressed={showPinyin}
        >
          {showPinyin ? "Ẩn pinyin" : "Hiện pinyin"}
        </button>
      </div>

      {/* ----------------- FILTER PILLS ----------------- */}
      <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 mb-5">
        <ul className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TOPIC_FILTERS.filter(
            (f) => f.value === "all" || (counts[f.value] || 0) > 0,
          ).map((f) => {
            const active = topic === f.value;
            return (
              <li key={f.value} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setTopic(f.value)}
                  aria-pressed={active}
                  className={`px-3.5 h-9 inline-flex items-center gap-1.5 text-[13px] font-bold tracking-[0.3px] border transition whitespace-nowrap ${
                    active
                      ? "bg-ink-900 text-white border-ink-900"
                      : "bg-canvas text-ink-900 border-hairline-strong hover:border-ink-900"
                  }`}
                >
                  <span aria-hidden="true">{f.emoji}</span>
                  <span>{f.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ----------------- MAIN CARD ----------------- */}
      {!card ? (
        <div className="border border-hairline bg-canvas p-10 text-center text-sm font-light text-muted">
          Chưa có thẻ nào cho chủ đề này.
        </div>
      ) : (
        <div className="border border-hairline bg-canvas overflow-hidden">
          {/* Header strip — topic chip + saved feedback */}
          <div className="px-5 pt-4 pb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-muted">
              <span aria-hidden="true">
                {TOPIC_FILTERS.find((f) => f.value === card.topic)?.emoji}
              </span>
              {card.topicLabel}
            </span>
            <span className="text-[11px] font-light text-muted tracking-[0.3px]">
              {card.type === "phrase" ? "Mẫu câu" : "Từ vựng"} · {card.difficulty}
            </span>
          </div>

          {/* Card body — tap to reveal */}
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            aria-pressed={revealed}
            className="block w-full text-left px-5 pt-2 pb-6 min-h-[280px] sm:min-h-[340px] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ink-900"
          >
            {/* Chinese — large */}
            <div className="zh text-[34px] sm:text-[42px] font-bold leading-tight break-words">
              {card.chinese}
            </div>

            {/* Pinyin — smaller, muted */}
            {showPinyin && card.pinyin ? (
              <div className="mt-2 text-sm sm:text-base font-light text-muted tracking-[0.3px] break-words">
                {card.pinyin}
              </div>
            ) : null}

            {/* Vietnamese & details — revealed on tap */}
            {revealed ? (
              <div className="mt-5 space-y-3">
                <div className="text-lg sm:text-xl font-bold leading-snug">{card.vietnamese}</div>
                {card.context ? (
                  <div className="text-xs font-light text-body leading-relaxed bg-amber-50/70 border border-amber-100 px-3 py-2">
                    💡 {card.context}
                  </div>
                ) : null}
                {card.exampleChinese ? (
                  <div className="border-t border-hairline pt-3">
                    <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted mb-1.5">
                      Ví dụ
                    </div>
                    <div className="zh text-base font-bold leading-snug">{card.exampleChinese}</div>
                    {showPinyin && card.examplePinyin ? (
                      <div className="text-xs font-light text-muted mt-1">{card.examplePinyin}</div>
                    ) : null}
                    {card.exampleVietnamese ? (
                      <div className="text-sm font-light text-body mt-1.5">
                        {card.exampleVietnamese}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-6 text-[11px] font-bold uppercase tracking-[1.5px] text-bmw-blue">
                Chạm để xem nghĩa ›
              </div>
            )}
          </button>

          {/* Action row — Nghe · Lưu · Câu tiếp */}
          <div className="px-3 sm:px-5 py-3 border-t border-hairline flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <SpeakButton text={card.chinese} size="md" tone="default" />
              <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted hidden sm:inline">
                Nghe
              </span>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaved}
              className={`flex-1 h-11 px-3 text-[12px] font-bold uppercase tracking-[1px] border transition ${
                isSaved
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 cursor-default"
                  : "bg-canvas text-ink-900 border-hairline-strong hover:border-ink-900"
              }`}
            >
              {isSaved ? "✓ Đã lưu" : "Lưu"}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-[2] h-11 px-3 text-[12px] font-bold uppercase tracking-[1px] bg-ink-900 text-white border border-ink-900 hover:bg-ink-700 transition"
            >
              Câu tiếp ›
            </button>
          </div>
          {savedFeedback ? (
            <div
              role="status"
              className="px-5 pb-3 text-[11px] font-bold tracking-[0.5px] text-emerald-700"
            >
              {savedFeedback}
            </div>
          ) : null}
        </div>
      )}

      {/* ----------------- SECONDARY MENU (light, not a tab bar) ----------------- */}
      <div className="mt-8 pt-6 border-t border-hairline">
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted mb-3">
          Thêm
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-hairline border border-hairline">
          {[
            { href: "/flashcards", emoji: "🗂", label: "Thẻ từ" },
            { href: "/mistakes", emoji: "⚠️", label: "Lỗi cần ôn" },
            { href: "/domain-packs", emoji: "📚", label: "Chủ đề" },
            { href: "/session/today", emoji: "🌅", label: "Phiên 20 phút" },
            { href: "/wechat-coach", emoji: "💬", label: "WeChat Coach" },
            { href: "/lyrics-mode", emoji: "🎵", label: "Lời bài hát" },
          ].map((it) => (
            <li key={it.href} className="bg-canvas">
              <Link
                href={it.href}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-soft transition"
              >
                <span className="text-lg leading-none" aria-hidden="true">
                  {it.emoji}
                </span>
                <span className="text-[13px] font-bold tracking-[0.3px]">{it.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
