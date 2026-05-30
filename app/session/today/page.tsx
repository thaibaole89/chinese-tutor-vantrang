"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LearningVisual } from "@/components/LearningVisual";
import { SpeakButton } from "@/components/SpeakButton";
import { todaysRealFeedItem } from "@/lib/realFeed";
import { CATEGORY_LABEL, categoryGroupFor } from "@/lib/realFeed";
import {
  getMistakes,
  getProgressSnapshot,
  incrementMistakeReview,
  markMistakeMastered,
  upsertVocabAsFlashcards,
} from "@/lib/storage";
import type { Mistake, ProgressSnapshot } from "@/lib/types";

type Step = 1 | 2 | 3;

const DIFFICULTY_LABEL: Record<"easy" | "medium" | "hard", string> = {
  easy: "Dễ",
  medium: "Trung bình",
  hard: "Khó",
};

const STEP_META: Record<Step, { label: string; time: string; cta: string }> = {
  1: { label: "Đầu vào — Tiếng Trung thật", time: "5 phút", cta: "MỞ KHÁM PHÁ" },
  2: { label: "Luyện nói", time: "10 phút", cta: "BẮT ĐẦU NÓI" },
  3: { label: "Ôn lỗi", time: "5 phút", cta: "VỀ TRANG CHỦ" },
};

// Lifestyle WeChat practice prompts for Vân Trang — travel, drama, friends,
// family, online comments. No business / MOU / VIP-host / project content.
const WECHAT_PROMPTS = [
  "Nhắn host Airbnb xác nhận giờ check-in muộn (tới 11h đêm).",
  "Hỏi lễ tân khách sạn giờ ăn sáng + cách lấy xe đi sân bay.",
  "Khen bạn Trung Quốc set ảnh Tết, hỏi chụp ở đâu, dùng giọng thân.",
  "Reply 1 comment Xiaohongshu hỏi quán lẩu nào ngon ở Thành Đô.",
  "Nhắn bạn đồng hành dời lịch tour sáng mai từ 8h sang 9h.",
  "Comment Weibo của diễn viên mình thích sau khi xem tập mới.",
  "Hỏi shop online TQ giá ship Việt Nam + thời gian giao 1 món đồ.",
];

function todaysPrompt(): string {
  const day = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return WECHAT_PROMPTS[day % WECHAT_PROMPTS.length];
}

export default function TodaySessionPage() {
  const [step, setStep] = useState<Step>(1);
  const [snapshot, setSnapshot] = useState<ProgressSnapshot | null>(null);
  const [openMistakes, setOpenMistakes] = useState<Mistake[]>([]);
  const [savedFlashcardsCount, setSavedFlashcardsCount] = useState<number | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  const feed = todaysRealFeedItem();
  const prompt = todaysPrompt();

  useEffect(() => {
    setSnapshot(getProgressSnapshot());
    setOpenMistakes(getMistakes().filter((m) => !m.mastered).slice(0, 5));
  }, [step]);

  const handleSaveFlashcards = () => {
    const { added } = upsertVocabAsFlashcards(feed.keyVocabulary, {
      tagPrefix: feed.id,
      sourceTag: `real-feed-${feed.sourceType}`,
    });
    setSavedFlashcardsCount(added);
  };

  const handleIncReview = (id: string) => {
    setOpenMistakes(incrementMistakeReview(id).filter((m) => !m.mastered).slice(0, 5));
    setReviewedIds((s) => new Set(s).add(id));
  };

  const handleMastered = (id: string) => {
    setOpenMistakes(markMistakeMastered(id, true).filter((m) => !m.mastered).slice(0, 5));
    setReviewedIds((s) => new Set(s).add(id));
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-ink-900 text-white">
        <div className="px-6 py-section">
          <div className="label-uppercase text-on-dark-soft">Phiên học 20 phút hôm nay</div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold leading-[1.05]">
            Vòng học: nghe → nói → ôn lỗi
          </h1>
          <p className="mt-3 max-w-2xl text-base font-light text-on-dark-soft">
            3 bước, mỗi bước có giới hạn thời gian. Hoàn thành đủ trong 20 phút —
            đầu vào 5' · luyện nói 10' · ôn lỗi 5'.
          </p>
        </div>
      </section>

      {/* Stepper */}
      <div className="border-b border-hairline bg-canvas sticky top-16 z-20">
        <div className="px-6 py-3 flex items-center gap-3 overflow-x-auto">
          <ol className="flex items-center gap-3 sm:gap-6 w-full">
            {([1, 2, 3] as Step[]).map((n) => {
              const active = n === step;
              const done = n < step;
              return (
                <li key={n} className="flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => setStep(n)}
                    className={`w-full text-left flex items-center gap-2 text-[13px] font-bold uppercase tracking-[1.2px] ${
                      active ? "text-ink-900" : done ? "text-emerald-600" : "text-muted"
                    }`}
                  >
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs shrink-0 ${
                        active
                          ? "bg-ink-900 text-white border-ink-900"
                          : done
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-canvas border-hairline-strong text-muted"
                      }`}
                    >
                      {done ? "✓" : n}
                    </span>
                    <span className="flex flex-col min-w-0">
                      <span className="truncate">Bước {n}</span>
                      <span className="text-[10px] font-normal text-muted tracking-[0.3px] truncate">
                        {STEP_META[n].time}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Body */}
      <section className="px-6 py-section">
        {step === 1 ? (
          <article className="border border-hairline bg-canvas overflow-hidden">
            <LearningVisual spec={feed.visual} density="full" />
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="label-uppercase text-bmw-blue">Bước 1 — Đầu vào · 5 phút</div>
                <span className="chip">{CATEGORY_LABEL[categoryGroupFor(feed)]}</span>
                <span className="chip">{DIFFICULTY_LABEL[feed.difficulty]}</span>
              </div>
              <div className="flex items-start gap-3">
                <h2 className="zh text-2xl sm:text-3xl font-bold flex-1">{feed.titleZh}</h2>
                <SpeakButton text={feed.titleZh} size="md" />
              </div>
              <div className="text-base font-bold">{feed.titleVi}</div>

              {/* Key vocab — first 5 */}
              <div>
                <span className="label-uppercase text-muted block mb-2">
                  Từ vựng chính ({feed.keyVocabulary.length})
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {feed.keyVocabulary.slice(0, 5).map((v) => (
                    <li
                      key={v.id}
                      className="flex items-center gap-3 bg-surface-soft border border-hairline px-3 py-2"
                    >
                      <span className="zh text-lg font-bold">{v.hanzi}</span>
                      <SpeakButton text={v.hanzi} size="xs" tone="ghost" />
                      <span className="text-xs font-normal text-muted">{v.pinyin}</span>
                      <span className="text-xs font-light text-body ml-auto truncate">
                        {v.vietnameseMeaning}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm font-light text-body">{feed.usageNotesVi}</p>

              <div className="pt-4 border-t border-hairline flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveFlashcards}
                  className={savedFlashcardsCount !== null ? "btn-secondary" : "btn-primary"}
                >
                  {savedFlashcardsCount !== null
                    ? `✓ ĐÃ LƯU +${savedFlashcardsCount} THẺ`
                    : "LƯU 5 TỪ → FLASHCARDS"}
                </button>
                <Link href="/real-feed" className="btn-secondary">
                  XEM TẤT CẢ
                </Link>
                <button type="button" onClick={() => setStep(2)} className="btn-text-link">
                  BƯỚC 2: LUYỆN NÓI →
                </button>
              </div>
            </div>
          </article>
        ) : null}

        {step === 2 ? (
          <article className="border border-hairline bg-canvas overflow-hidden">
            <LearningVisual
              spec={{
                type: "learning_scene",
                emoji: "🎙️",
                gradient: "wechat",
                altVi: "Bước 2 — luyện nói / soạn tin WeChat",
                captionVi: "Bước 2 / 3 — Luyện nói · 10 phút",
              }}
              density="compact"
            />
            <div className="p-6 space-y-5">
              <div className="label-uppercase text-bmw-blue">
                Bước 2 — Luyện nói · 10 phút
              </div>
              <p className="text-sm font-light text-body">
                Chọn 1 trong 2 — WeChat Drill cho viết tin, hoặc Role-play cho thoại nhiều
                turn. Cả 2 đều hỗ trợ nói (zh-CN) + AI chấm lỗi.
              </p>

              {/* WeChat Drill */}
              <div className="border border-hairline bg-canvas p-5 space-y-3">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <div className="label-uppercase text-muted">Option A — WeChat Drill</div>
                    <div className="text-base font-bold mt-1">Soạn 3 tông giọng cho 1 tình huống</div>
                  </div>
                  <span className="chip">~5 phút</span>
                </div>
                <div className="bg-surface-soft border border-hairline px-4 py-3 text-sm font-light text-body-strong">
                  "{prompt}"
                </div>
                <Link href="/wechat-coach" className="btn-primary inline-flex">
                  LUYỆN VIẾT WECHAT
                </Link>
              </div>

              {/* Role-play */}
              <div className="border border-hairline bg-canvas p-5 space-y-3">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <div className="label-uppercase text-muted">Lựa chọn B — Hội thoại</div>
                    <div className="text-base font-bold mt-1">
                      Hội thoại 3-5 lượt với AI (đời thường)
                    </div>
                  </div>
                  <span className="chip">~8 phút</span>
                </div>
                <p className="text-xs font-light text-muted">
                  Thử các tình huống: check-in khách sạn, gọi món ở quán, hỏi đường, mặc cả ở chợ
                  đêm, đặt taxi/Didi, comment Xiaohongshu, bàn phim với bạn.
                </p>
                <Link
                  href={`/roleplay?scenario=${feed.roleplayScenario.id}`}
                  className="btn-primary inline-flex"
                >
                  BẮT ĐẦU HỘI THOẠI
                </Link>
              </div>

              <div className="pt-4 border-t border-hairline flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                  ← BƯỚC 1
                </button>
                <button type="button" onClick={() => setStep(3)} className="btn-text-link">
                  BƯỚC 3: ÔN LỖI →
                </button>
              </div>
            </div>
          </article>
        ) : null}

        {step === 3 ? (
          <article className="border border-hairline bg-canvas overflow-hidden">
            <LearningVisual
              spec={{
                type: "learning_scene",
                emoji: "🔁",
                gradient: "warm",
                altVi: "Bước 3 — ôn lỗi cũ",
                captionVi: "Bước 3 / 3 — Ôn lỗi · 5 phút",
              }}
              density="compact"
            />
            <div className="p-6 space-y-5">
              <div className="label-uppercase text-bmw-blue">
                Bước 3 — Ôn lỗi · 5 phút
              </div>

              {openMistakes.length === 0 ? (
                <div className="bg-surface-soft border border-hairline px-4 py-5 text-sm font-light text-body">
                  🎉 Không có lỗi nào đang mở — bạn đang on track. Tạo lỗi mới ở step 2 (role-play
                  / WeChat coach) để có vật liệu ôn cho ngày mai.
                </div>
              ) : (
                <>
                  <p className="text-sm font-light text-body">
                    Bấm <strong>+1 ÔN</strong> để tăng review count, hoặc <strong>ĐÁNH DẤU
                    THUỘC</strong> nếu bạn đã nhớ chắc.
                  </p>
                  <ul className="space-y-px bg-hairline border border-hairline">
                    {openMistakes.map((m) => (
                      <li key={m.id} className="bg-canvas p-4 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="label-uppercase text-muted">Câu gốc</div>
                            <div className="zh text-base font-bold">{m.originalSentence}</div>
                          </div>
                          <span className="chip shrink-0">
                            đã ôn {m.reviewCount}
                          </span>
                        </div>
                        <div>
                          <div className="label-uppercase text-muted">Câu đúng</div>
                          <div className="flex items-start gap-2">
                            <div className="zh text-base font-bold flex-1">
                              {m.correctedSentence}
                            </div>
                            <SpeakButton text={m.correctedSentence} size="xs" tone="ghost" />
                          </div>
                          <div className="text-xs font-normal text-muted mt-0.5 tracking-[0.3px]">
                            {m.pinyin}
                          </div>
                        </div>
                        {m.explanationVi ? (
                          <p className="text-xs font-light text-body">{m.explanationVi}</p>
                        ) : null}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-hairline">
                          <button
                            type="button"
                            onClick={() => handleIncReview(m.id)}
                            className="btn-secondary text-xs"
                          >
                            +1 ÔN
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMastered(m.id)}
                            className="btn-primary text-xs"
                          >
                            ĐÁNH DẤU THUỘC
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Session summary */}
              <div className="bg-surface-soft border border-hairline p-4 mt-4">
                <div className="label-uppercase text-bmw-blue mb-2">Tổng kết phiên</div>
                <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <SummaryItem label="Flashcards saved" value={savedFlashcardsCount ?? 0} />
                  <SummaryItem label="Mistakes reviewed" value={reviewedIds.size} />
                  <SummaryItem
                    label="Speaking attempts"
                    value={snapshot?.speakingPracticeCount ?? 0}
                  />
                  <SummaryItem label="Streak" value={`${snapshot?.streak ?? 0} ngày`} />
                </ul>
                <p className="text-xs font-light text-body mt-3">
                  <strong className="font-bold">Tomorrow focus:</strong>{" "}
                  {openMistakes.length > 2
                    ? `Còn ${openMistakes.length} lỗi mở — ưu tiên ôn lại trước khi học thêm.`
                    : `Mistakes đã sạch — sang category mới trong Real Feed hoặc làm 1 pack Domain.`}
                </p>
              </div>

              <div className="pt-4 border-t border-hairline flex flex-wrap justify-between gap-3">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary">
                  ← STEP 2
                </button>
                <Link href="/" className="btn-primary">
                  HOÀN THÀNH PHIÊN HỌC
                </Link>
              </div>
            </div>
          </article>
        ) : null}
      </section>
    </>
  );
}

function SummaryItem({ label, value }: { label: string; value: number | string }) {
  return (
    <li>
      <div className="label-uppercase text-muted">{label}</div>
      <div className="mt-1 text-xl font-bold leading-none">{value}</div>
    </li>
  );
}
