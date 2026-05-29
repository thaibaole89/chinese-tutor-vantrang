"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardCard } from "@/components/DashboardCard";
import { ProgressSummary } from "@/components/ProgressSummary";
import { getAllLessons, getTodayLesson, totalLessonCount } from "@/lib/lessonData";
import {
  getLessonsCompleted,
  getMistakes,
  getProgressSnapshot,
  getProfile,
} from "@/lib/storage";
import { todaysRealFeedItem } from "@/lib/realFeed";
import { VisualCard } from "@/components/VisualCard";
import { LearningVisual } from "@/components/LearningVisual";
import type { ProgressSnapshot, UserProfile, VisualSpec } from "@/lib/types";

const CORE_LESSON_VISUAL: VisualSpec = {
  type: "illustration_prompt",
  emoji: "📘",
  gradient: "business",
  altVi: "Minh hoạ bài học tiếng Trung công việc",
  captionVi: "Core Lesson — bài học cốt lõi hôm nay",
  illustrationPrompt:
    "A clean modern textbook page with Chinese characters and pinyin visible at low contrast, blue accent, clean educational illustration, no text overlay, no logos",
};

const WECHAT_DRILL_VISUAL: VisualSpec = {
  type: "illustration_prompt",
  emoji: "💬",
  gradient: "wechat",
  altVi: "Minh hoạ luyện soạn tin nhắn trong 3 tông giọng",
  captionVi: "Soạn tin: thân thiện · lịch sự · cứng rắn",
  illustrationPrompt:
    "Three stacked chat bubbles in different tones (warm, neutral, firm), abstract messaging illustration, no readable text, no logos",
};

export default function DashboardPage() {
  const [hydrated, setHydrated] = useState(false);
  const [snapshot, setSnapshot] = useState<ProgressSnapshot | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [mistakesToReview, setMistakesToReview] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Phase 1.7 — no auto-seed; Flashcards page offers explicit CTA.
    setSnapshot(getProgressSnapshot());
    setCompletedIds(getLessonsCompleted());
    setMistakesToReview(getMistakes().filter((m) => !m.mastered).length);
    setProfile(getProfile());
    setHydrated(true);
  }, []);

  const totalLessons = totalLessonCount();
  const today = getTodayLesson(completedIds);
  const isAllDone = completedIds.length >= totalLessons;
  const allLessons = getAllLessons();
  const realFeedToday = todaysRealFeedItem();

  return (
    <>
      {/* ---------------- Dark hero band — Today's 20-Min Session is the dominant CTA ---------------- */}
      <section className="bg-ink-900 text-white">
        <div className="px-6 py-section">
          <div className="label-uppercase text-on-dark-soft">15-20 phút mỗi ngày · Chinese Tutor Vân Trang</div>
          <h1 className="mt-4 text-5xl sm:text-6xl font-bold leading-[1.05]">
            Chào {hydrated ? (profile?.name || "Vân Trang") : "Vân Trang"} ✿
          </h1>
          <p className="mt-3 max-w-xl text-base font-light text-on-dark-soft">
            Một phiên ngắn: bài học hôm nay → 1 đoạn thật từ phim / mạng xã hội / báo → luyện
            viết tin WeChat. Hoàn thành trong ~20 phút.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/session/today"
              className="inline-flex items-center justify-center px-8 min-h-[56px] text-[14px] font-bold tracking-[0.5px] bg-bmw-blue text-white hover:bg-bmw-blue-active transition"
            >
              BẮT ĐẦU PHIÊN 20 PHÚT ›
            </Link>
            <Link href={`/lesson/${today.day}`} className="btn-secondary-on-dark">
              CHỈ HỌC BÀI HÔM NAY
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px bg-surface-dark-elevated">
            <Metric label="Streak" value={`${snapshot?.streak ?? 0}`} suffix="ngày" />
            <Metric
              label="Vocab"
              value={`${snapshot?.totalVocabulary ?? 0}`}
              suffix={`${snapshot?.masteredVocabulary ?? 0} thuộc`}
            />
            <Metric label="Mistakes" value={`${mistakesToReview}`} suffix="cần ôn" />
            <Metric label="Quiz TB" value={`${snapshot?.quizAverage ?? 0}%`} suffix="trung bình" />
          </ul>
          {isAllDone ? (
            <div className="mt-4 text-xs font-light text-on-dark-soft">
              ✓ Đã hoàn thành tất cả {totalLessons} bài Tuần 1 — sẵn sàng cho Week 2.
            </div>
          ) : null}
        </div>
      </section>

      {/* ---------------- 3 daily cards: Core Lesson / Real Chinese / WeChat Drill ---------------- */}
      <section className="px-6 py-section">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-3xl font-bold">Hôm nay học gì</h2>
          <Link href="/domain-packs" className="btn-text-link">
            DOMAIN PACKS
          </Link>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border border-hairline">
          {/* Today's Core Lesson */}
          <li className="bg-canvas">
            <Link href={`/lesson/${today.day}`} className="block group h-full">
              <VisualCard
                spec={CORE_LESSON_VISUAL}
                aspect="16/9"
              />
              <div className="p-5">
                <div className="label-uppercase text-bmw-blue">📘 Today's Core Lesson</div>
                <div className="mt-2 zh text-xl font-bold leading-tight">{today.titleZh}</div>
                <div className="mt-1 text-base font-bold">{today.titleVi}</div>
                <div className="text-xs font-light text-muted mt-1 tracking-[0.3px]">
                  Day {today.day} · {today.durationMinutes} phút · {today.vocabulary.length} từ
                </div>
                <div className="mt-3">
                  <span className="btn-text-link">{isAllDone ? "ÔN LẠI" : "BẮT ĐẦU"}</span>
                </div>
              </div>
            </Link>
          </li>

          {/* Today's Real Chinese */}
          <li className="bg-canvas">
            <Link href="/real-feed" className="block group h-full">
              <LearningVisual spec={realFeedToday.visual} density="compact" />
              <div className="p-5">
                <div className="label-uppercase text-bmw-blue">📰 Today's Real Chinese</div>
                <div className="mt-2 zh text-xl font-bold leading-tight">{realFeedToday.titleZh}</div>
                <div className="mt-1 text-base font-bold">{realFeedToday.titleVi}</div>
                <div className="text-xs font-light text-muted mt-1 tracking-[0.3px]">
                  {realFeedToday.sourceType} · {realFeedToday.difficulty} ·{" "}
                  {realFeedToday.keyVocabulary.length} từ
                </div>
                <div className="mt-3">
                  <span className="btn-text-link">MỞ FEED</span>
                </div>
              </div>
            </Link>
          </li>

          {/* WeChat Drill */}
          <li className="bg-canvas">
            <Link href="/wechat-coach" className="block group h-full">
              <VisualCard spec={WECHAT_DRILL_VISUAL} aspect="16/9" />
              <div className="p-5">
                <div className="label-uppercase text-bmw-blue">💬 WeChat Drill</div>
                <div className="mt-2 zh text-xl font-bold leading-tight">微信练习</div>
                <div className="mt-1 text-base font-bold">Soạn tin 3 tông giọng</div>
                <div className="text-xs font-light text-muted mt-1 tracking-[0.3px]">
                  Thân thiện · lịch sự · cứng rắn
                </div>
                <div className="mt-3">
                  <span className="btn-text-link">SOẠN TIN</span>
                </div>
              </div>
            </Link>
          </li>
        </ul>
      </section>

      {/* ---------------- Model card grid (lessons) ---------------- */}
      <section className="px-6 py-section bg-surface-soft">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-3xl font-bold">Tuần 1</h2>
          <span className="label-uppercase text-muted">
            {completedIds.length}/{totalLessons} hoàn thành
          </span>
        </div>

        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline">
          {allLessons.map((l) => {
            const done = completedIds.includes(l.id);
            return (
              <li key={l.id} className="bg-canvas">
                <Link href={`/lesson/${l.day}`} className="block group">
                  {/* Photo plate */}
                  <div className="bg-surface-card aspect-[16/10] flex items-center justify-center px-6">
                    <div className="zh text-4xl sm:text-5xl font-bold leading-tight text-center group-hover:text-bmw-blue transition">
                      {l.titleZh}
                    </div>
                  </div>
                  {/* Body */}
                  <div className="p-6">
                    <div className="label-uppercase text-muted">Day {l.day}</div>
                    <div className="mt-2 text-lg font-bold leading-snug">{l.titleVi}</div>
                    <div className="mt-1 text-sm font-light text-muted">
                      {l.durationMinutes} phút · {l.vocabulary.length} từ mới
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="btn-text-link">{done ? "ÔN LẠI" : "BẮT ĐẦU"}</span>
                      {done ? (
                        <span className="label-uppercase text-green-600">✓ Done</span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---------------- Quick actions row ---------------- */}
      <section className="bg-surface-soft px-6 py-section">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-hairline border border-hairline">
          <DashboardCard
            title="Flashcards"
            value={`${snapshot?.totalVocabulary ?? 0}`}
            subtitle={`${snapshot?.masteredVocabulary ?? 0} đã thuộc`}
            href="/flashcards"
            cta="Ôn"
          />
          <DashboardCard
            title="Mistakes"
            value={`${mistakesToReview}`}
            subtitle="cần ôn lại"
            href="/mistakes"
            cta="Xem"
          />
          <DashboardCard
            title="Quiz avg"
            value={`${snapshot?.quizAverage ?? 0}%`}
            subtitle="trung bình"
            href="/progress"
            cta="Chi tiết"
          />
        </div>
      </section>

      {/* ---------------- Progress section ---------------- */}
      <section className="px-6 py-section">
        <h2 className="text-3xl font-bold mb-8">Progress</h2>
        {hydrated && snapshot ? (
          <ProgressSummary snapshot={snapshot} />
        ) : (
          <div className="text-sm font-light text-muted">Đang tải...</div>
        )}
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="bg-surface-soft border-t border-hairline px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <FooterCol
            title="Học"
            links={[
              { label: "Hôm nay", href: "/" },
              { label: "Real Feed", href: "/real-feed" },
              { label: "Domain Packs", href: "/domain-packs" },
            ]}
          />
          <FooterCol
            title="Luyện tập"
            links={[
              { label: "WeChat Coach", href: "/wechat-coach" },
              { label: "Role-play", href: "/roleplay" },
              { label: "Flashcards", href: "/flashcards" },
            ]}
          />
          <FooterCol
            title="Ôn tập"
            links={[
              { label: "Mistakes", href: "/mistakes" },
              { label: "Progress", href: "/progress" },
            ]}
          />
          <FooterCol
            title="Hồ sơ"
            links={[{ label: "Onboarding", href: "/onboarding" }]}
          />
        </div>
        <div className="mt-12 pt-6 border-t border-hairline text-xs font-light text-muted tracking-[0.3px]">
          © {new Date().getFullYear()} Chinese Tutor Vân Trang — Local-first study app.
        </div>
      </footer>
    </>
  );
}

function Metric({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <li className="bg-surface-dark-elevated p-4 sm:p-5">
      <div className="label-uppercase text-on-dark-soft">{label}</div>
      <div className="mt-2 text-2xl sm:text-3xl font-bold leading-none">{value}</div>
      <div className="text-xs font-light text-on-dark-soft mt-1">{suffix}</div>
    </li>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <div className="label-uppercase text-ink-900 mb-3">{title}</div>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm font-light text-muted hover:text-ink-900">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
