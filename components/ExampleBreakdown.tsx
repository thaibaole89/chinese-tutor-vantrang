"use client";

import { breakdownFor } from "@/data/exampleBreakdowns";
import { SpeakButton } from "./SpeakButton";

interface Props {
  /** the example sentence (hanzi) */
  zh: string;
  /** Vietnamese translation of the whole sentence */
  vi?: string;
  /** honour the global pinyin toggle */
  showPinyin: boolean;
}

/**
 * Enriched "Ví dụ" block for the Card-First Home: the example sentence with a
 * listen button, word-grouped pinyin (toggle-aware), the Vietnamese meaning,
 * and a word-by-word breakdown so the learner picks up extra vocabulary.
 *
 * Pinyin + breakdown come from the pre-generated, offline data file
 * (data/exampleBreakdowns.ts). When a sentence has no breakdown entry it still
 * renders the sentence, listen button and Vietnamese — nothing breaks.
 *
 * NOTE: contains a <button> (SpeakButton), so it must never be nested inside
 * another <button>. CardFirstHome renders it as a sibling of the reveal toggle.
 */
export function ExampleBreakdown({ zh, vi, showPinyin }: Props) {
  const bd = breakdownFor(zh);

  return (
    <div className="border-t border-hairline pt-3">
      {/* Header: label + listen */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted">
          Ví dụ
        </span>
        <SpeakButton text={zh} size="sm" tone="ghost" label="Nghe câu ví dụ" />
      </div>

      {/* Sentence — Chinese, then pinyin (toggle-aware), then Vietnamese */}
      <div className="zh text-base font-bold leading-snug">{zh}</div>
      {showPinyin && bd?.pinyin ? (
        <div className="text-xs font-light text-muted mt-1">{bd.pinyin}</div>
      ) : null}
      {vi ? <div className="text-sm font-light text-body mt-1.5">{vi}</div> : null}

      {/* Word-by-word breakdown — extra vocab from the sentence */}
      {bd && bd.tokens.length > 0 ? (
        <div className="mt-3">
          <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-muted mb-1.5">
            Bóc tách từ
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {bd.tokens.map((t, i) => (
              <li
                key={`${t.w}-${i}`}
                className="inline-flex flex-col items-center text-center border border-hairline bg-surface-soft px-2 py-1"
              >
                <span className="zh text-sm font-bold leading-tight">{t.w}</span>
                {showPinyin ? (
                  <span className="text-[10px] font-light text-muted leading-tight mt-0.5">
                    {t.py}
                  </span>
                ) : null}
                {t.vi ? (
                  <span className="text-[11px] font-light text-body leading-tight mt-0.5">
                    {t.vi}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
