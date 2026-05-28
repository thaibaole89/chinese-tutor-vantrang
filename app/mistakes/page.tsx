"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMistakes, incrementMistakeReview, markMistakeMastered } from "@/lib/storage";
import { SpeakButton } from "@/components/SpeakButton";
import type { ErrorType, Mistake } from "@/lib/types";

const ERROR_LABEL: Record<ErrorType, string> = {
  grammar: "Ngữ pháp",
  vocabulary: "Từ vựng",
  pronunciation: "Phát âm",
  fluency: "Lưu loát",
  cultural_context: "Văn hoá",
  word_order: "Trật tự từ",
  measure_word: "Lượng từ",
  tone: "Thanh điệu",
  register: "Văn phong",
};

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [filter, setFilter] = useState<"open" | "all">("open");

  useEffect(() => {
    setMistakes(getMistakes());
  }, []);

  const visible = filter === "open" ? mistakes.filter((m) => !m.mastered) : mistakes;

  return (
    <section className="px-6 py-section">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="label-uppercase text-muted">Mistake log</div>
          <h1 className="text-4xl font-bold mt-2">Lỗi đang ôn</h1>
          <p className="text-sm font-light text-muted mt-2">
            {mistakes.length} lỗi đã lưu • {mistakes.filter((m) => !m.mastered).length} đang ôn
          </p>
        </div>
        <div className="flex border-b border-hairline">
          <button
            type="button"
            onClick={() => setFilter("open")}
            className={`mr-6 ${
              filter === "open" ? "category-tab category-tab-active" : "category-tab"
            }`}
          >
            Đang ôn
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={
              filter === "all" ? "category-tab category-tab-active" : "category-tab"
            }
          >
            Tất cả
          </button>
        </div>
      </header>

      {visible.length === 0 ? (
        <div className="border border-hairline bg-canvas p-12 text-center space-y-3">
          <p className="text-base font-light text-body">Chưa có lỗi nào được lưu.</p>
          <p className="text-sm font-light text-muted">
            Vào{" "}
            <Link href="/roleplay" className="btn-text-link">
              ROLE-PLAY
            </Link>{" "}
            để luyện và lưu lỗi đầu tiên.
          </p>
        </div>
      ) : (
        <ul className="space-y-px bg-hairline border border-hairline">
          {visible.map((m) => (
            <li key={m.id} className="bg-canvas p-6 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="label-uppercase text-muted">Câu gốc</div>
                  <div className="zh text-lg font-bold mt-1">{m.originalSentence}</div>
                </div>
                <span className="chip">
                  {new Date(m.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>

              <div>
                <div className="label-uppercase text-muted">Câu đúng</div>
                <div className="mt-1 flex items-start gap-3">
                  <div className="zh text-lg font-bold flex-1">{m.correctedSentence}</div>
                  <SpeakButton text={m.correctedSentence} size="sm" />
                </div>
                <div className="text-xs font-normal text-muted mt-1 tracking-[0.3px]">
                  {m.pinyin}
                </div>
              </div>

              {m.explanationVi ? (
                <p className="text-sm font-light text-body">{m.explanationVi}</p>
              ) : null}

              {m.betterVersion ? (
                <div>
                  <div className="label-uppercase text-muted">Tự nhiên hơn</div>
                  <div className="mt-1 flex items-start gap-3">
                    <div className="zh text-lg font-bold flex-1">{m.betterVersion}</div>
                    <SpeakButton text={m.betterVersion} size="sm" />
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-hairline">
                <div className="flex flex-wrap gap-1.5">
                  {m.errorTypes.map((e) => (
                    <span key={e} className="chip-accent">
                      {ERROR_LABEL[e] || e}
                    </span>
                  ))}
                  {m.context ? <span className="chip">{m.context}</span> : null}
                  <span className="chip">đã ôn {m.reviewCount}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMistakes(incrementMistakeReview(m.id))}
                    className="btn-secondary text-xs"
                  >
                    +1 ÔN
                  </button>
                  <button
                    type="button"
                    onClick={() => setMistakes(markMistakeMastered(m.id, !m.mastered))}
                    className={m.mastered ? "btn-secondary text-xs" : "btn-primary text-xs"}
                  >
                    {m.mastered ? "✓ ĐÃ THUỘC" : "ĐÁNH DẤU THUỘC"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
