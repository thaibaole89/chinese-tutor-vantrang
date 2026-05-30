"use client";

import { usePinyinPreference } from "@/lib/pinyinPreference";

interface Props {
  /** Compact mode = icon + short label only (for nav bar). */
  size?: "sm" | "md";
  /** Optional className for layout integration. */
  className?: string;
}

/**
 * Global pinyin show/hide toggle. Tiny pill button — "Hiện pinyin" /
 * "Ẩn pinyin" — that flips the global preference and any subscribed
 * vocabulary / dialogue / flashcard component re-renders instantly.
 *
 * Placed in NavBar by default. Can also be embedded directly into a
 * lesson header if a page wants its own copy.
 */
export function PinyinToggle({ size = "sm", className = "" }: Props) {
  const { showPinyin, toggle } = usePinyinPreference();
  const pad = size === "sm" ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={showPinyin}
      aria-label={showPinyin ? "Ẩn pinyin" : "Hiện pinyin"}
      className={`inline-flex items-center gap-1.5 ${pad} font-bold uppercase tracking-[1px] border transition ${
        showPinyin
          ? "bg-ink-900 text-white border-ink-900"
          : "bg-canvas text-muted border-hairline-strong hover:text-ink-900 hover:border-ink-900"
      } ${className}`}
    >
      <span aria-hidden="true">{showPinyin ? "拼" : "拼"}</span>
      <span>{showPinyin ? "Ẩn pinyin" : "Hiện pinyin"}</span>
    </button>
  );
}
