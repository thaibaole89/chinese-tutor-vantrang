"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { FlashcardState, ReviewStatus } from "@/lib/types";
import { SpeakButton } from "./SpeakButton";

interface Props {
  card: FlashcardState;
  onSetStatus: (status: ReviewStatus) => void;
  /**
   * Image-first mode: front shows visual + hanzi + pinyin only.
   * Vietnamese meaning is hidden behind "Show meaning" button.
   */
  imageFirst?: boolean;
}

const STATUSES: ReviewStatus[] = ["new", "learning", "familiar", "mastered"];
const STATUS_LABEL: Record<ReviewStatus, string> = {
  new: "New",
  learning: "Learning",
  familiar: "Familiar",
  mastered: "Mastered",
};

export function Flashcard({ card, onSetStatus, imageFirst = false }: Props) {
  const [flipped, setFlipped] = useState(false);

  // Reset flip when card changes (so navigation prev/next always starts at front).
  useEffect(() => {
    setFlipped(false);
  }, [card.id]);

  const hint = card.visualHint;
  const hasLocalImg = !!hint?.imageSrc;

  return (
    <div className="w-full">
      <div className={`flip ${flipped ? "flipped" : ""} h-[360px] sm:h-[420px]`}>
        <div className="flip-inner">
          {/* Front — surface-card plate, image-first if enabled */}
          <button
            type="button"
            aria-pressed={flipped}
            aria-hidden={flipped}
            tabIndex={flipped ? -1 : 0}
            aria-label={imageFirst ? "Hiện nghĩa flashcard" : "Xem nghĩa flashcard"}
            onClick={() => setFlipped(true)}
            className="flip-face bg-surface-card border border-hairline p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden"
          >
            <div className="label-uppercase text-muted mb-3">
              {imageFirst ? "Image first — bấm để xem nghĩa" : "Tap để xem nghĩa"}
            </div>

            {/* Local image > emoji */}
            {hasLocalImg ? (
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-3 overflow-hidden rounded-lg">
                <Image
                  src={hint!.imageSrc!}
                  alt={hint?.altVi || `Hình cho ${card.hanzi}`}
                  fill
                  sizes="(max-width: 640px) 112px, 144px"
                  className="object-cover"
                />
              </div>
            ) : hint?.emoji ? (
              <span
                className="text-5xl sm:text-6xl mb-2 leading-none select-none"
                aria-label={hint?.altVi || `Biểu tượng cho ${card.hanzi}`}
              >
                {hint.emoji}
              </span>
            ) : null}

            <div className="zh text-5xl sm:text-6xl font-bold leading-none mb-3">{card.hanzi}</div>
            <div className="flex items-center gap-3">
              <span className="text-base text-muted font-light">{card.pinyin}</span>
              <SpeakButton text={card.hanzi} size="md" />
            </div>

            {/* In image-first mode, memory hook + tags hidden until back. */}
            {!imageFirst && hint?.memoryHookVi ? (
              <p className="mt-4 max-w-[26ch] text-xs font-light text-body leading-snug bg-amber-50/70 border border-amber-100 px-3 py-2">
                💡 {hint.memoryHookVi}
              </p>
            ) : null}

            {!imageFirst ? (
              <div className="mt-6 flex gap-1.5 flex-wrap justify-center">
                {card.tags.slice(0, 3).map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1.5px] text-bmw-blue">
                HIỆN NGHĨA ›
              </span>
            )}
          </button>

          {/* Back — canvas + hairline */}
          <button
            type="button"
            aria-pressed={flipped}
            aria-hidden={!flipped}
            tabIndex={flipped ? 0 : -1}
            aria-label="Ẩn nghĩa flashcard"
            onClick={() => setFlipped(false)}
            className="flip-face flip-back bg-canvas border border-hairline p-6 sm:p-8 flex flex-col items-start text-left cursor-pointer overflow-y-auto"
          >
            <div className="label-uppercase text-muted">Nghĩa</div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold leading-tight">
              {card.vietnameseMeaning}
            </div>
            {card.synonyms.length ? (
              <div className="mt-2 text-sm font-light text-muted">
                Đồng nghĩa:{" "}
                <span className="zh text-ink-900">{card.synonyms.join(" / ")}</span>
              </div>
            ) : null}
            {hint?.memoryHookVi ? (
              <p className="mt-3 text-xs font-light text-body leading-snug bg-amber-50/70 border border-amber-100 px-3 py-2 w-full">
                💡 {hint.memoryHookVi}
              </p>
            ) : null}
            <div className="mt-4 border-t border-hairline pt-3 w-full">
              <div className="label-uppercase text-muted">Ví dụ</div>
              <div className="mt-2 flex items-start gap-3">
                <div className="zh text-lg sm:text-xl flex-1 font-bold">{card.exampleZh}</div>
                <SpeakButton text={card.exampleZh} size="sm" />
              </div>
              <div className="text-sm font-light text-muted mt-1">{card.exampleVi}</div>
            </div>
            {card.tags.length ? (
              <div className="mt-3 flex gap-1.5 flex-wrap">
                {card.tags.slice(0, 4).map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 flex-wrap">
        <span className="label-uppercase text-muted mr-2">Status:</span>
        {STATUSES.map((s) => {
          const active = card.reviewStatus === s;
          return (
            <button
              key={s}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetStatus(s);
              }}
              className={`px-4 py-2 text-[12px] font-bold uppercase tracking-[1.5px] border transition ${
                active
                  ? "bg-ink-900 text-white border-ink-900"
                  : "bg-canvas text-muted border-hairline-strong hover:text-ink-900 hover:border-ink-900"
              }`}
            >
              {STATUS_LABEL[s]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
