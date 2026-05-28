"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { LessonVocabulary } from "@/components/LessonVocabulary";
import { SentencePatternList, DialogueBlock } from "@/components/SentencePatternList";
import { MiniQuiz } from "@/components/MiniQuiz";
import { SpeakButton } from "@/components/SpeakButton";
import { getLessonByDay, getNextLesson } from "@/lib/lessonData";
import { markLessonCompleted, getLessonsCompleted } from "@/lib/storage";

type Tab = "vocab" | "patterns" | "dialogue" | "roleplay" | "quiz";

const TAB_LABEL: Record<Tab, string> = {
  vocab: "Từ vựng",
  patterns: "Mẫu câu",
  dialogue: "Hội thoại",
  roleplay: "Role-play",
  quiz: "Quiz",
};

export default function LessonPage() {
  const params = useParams<{ day: string }>();
  const router = useRouter();
  const day = Number(params?.day);
  const lesson = getLessonByDay(day);
  const [tab, setTab] = useState<Tab>("vocab");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (lesson) setCompleted(getLessonsCompleted().includes(lesson.id));
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="px-6 py-section text-center space-y-4">
        <p className="text-lg font-light text-body">Bài học không tồn tại.</p>
        <Link href="/" className="btn-primary inline-flex">
          VỀ DASHBOARD
        </Link>
      </div>
    );
  }

  const handleQuizComplete = () => {
    markLessonCompleted(lesson.id);
    setCompleted(true);
  };

  const next = getNextLesson(lesson.day);

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="bg-ink-900 text-white">
        <div className="px-6 py-section">
          <div className="label-uppercase text-on-dark-soft">
            Tuần {lesson.week} · Day {lesson.day} · {lesson.durationMinutes} phút
          </div>
          <div className="mt-4 flex items-start gap-4">
            <h1 className="zh text-5xl sm:text-6xl font-bold leading-[1.05] flex-1">
              {lesson.titleZh}
            </h1>
            <SpeakButton text={lesson.titleZh} size="md" tone="inverse" />
          </div>
          <div className="mt-3 text-lg font-light text-on-dark-soft">{lesson.titleVi}</div>
          <div className="mt-2 text-sm font-light text-on-dark-soft">🎯 {lesson.objectiveVi}</div>
        </div>
      </section>

      {/* ---------------- Category tabs ---------------- */}
      <div className="border-b border-hairline bg-canvas sticky top-16 z-20">
        <div className="px-6 flex overflow-x-auto gap-8">
          {(Object.keys(TAB_LABEL) as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={tab === t ? "category-tab category-tab-active" : "category-tab"}
            >
              {TAB_LABEL[t]}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- Body ---------------- */}
      <section className="px-6 py-section">
        {tab === "vocab" ? <LessonVocabulary items={lesson.vocabulary} /> : null}
        {tab === "patterns" ? <SentencePatternList items={lesson.sentencePatterns} /> : null}
        {tab === "dialogue" ? <DialogueBlock lines={lesson.dialogue} /> : null}
        {tab === "roleplay" ? (
          <div className="border border-hairline bg-canvas p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="zh text-2xl font-bold flex-1">
                {lesson.roleplayScenario.titleZh}
              </div>
              <SpeakButton text={lesson.roleplayScenario.titleZh} size="sm" />
            </div>
            <div className="text-base font-bold">{lesson.roleplayScenario.titleVi}</div>
            <div className="text-sm font-light text-body">{lesson.roleplayScenario.contextVi}</div>
            <div className="text-xs font-normal text-muted tracking-[0.3px]">
              AI: {lesson.roleplayScenario.aiRole} • You: {lesson.roleplayScenario.userRole}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {lesson.roleplayScenario.targetPhrases.map((p) => (
                <span key={p} className="chip inline-flex items-center gap-2">
                  <span className="zh">{p}</span>
                  <SpeakButton text={p} size="xs" tone="ghost" />
                </span>
              ))}
            </div>
            <Link
              href={`/roleplay?scenario=${lesson.roleplayScenario.id}`}
              className="btn-primary inline-flex mt-2"
            >
              BẮT ĐẦU ROLE-PLAY
            </Link>
          </div>
        ) : null}
        {tab === "quiz" ? (
          <MiniQuiz lessonId={lesson.id} questions={lesson.quiz} onComplete={handleQuizComplete} />
        ) : null}
      </section>

      {/* ---------------- Footer actions ---------------- */}
      <section className="bg-surface-soft border-t border-hairline px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              markLessonCompleted(lesson.id);
              setCompleted(true);
            }}
            className={completed ? "btn-secondary" : "btn-primary"}
          >
            {completed ? "✓ ĐÃ HOÀN THÀNH" : "ĐÁNH DẤU HOÀN THÀNH"}
          </button>
          {next ? (
            <Link href={`/lesson/${next.day}`} className="btn-text-link">
              BÀI TIẾP · DAY {next.day}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/")}
              className="btn-text-link"
            >
              VỀ DASHBOARD
            </button>
          )}
        </div>
      </section>
    </>
  );
}
