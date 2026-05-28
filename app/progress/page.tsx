"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProgressSummary } from "@/components/ProgressSummary";
import { getProgressSnapshot, getQuizResults } from "@/lib/storage";
import { getAllLessons } from "@/lib/lessonData";
import type { Lesson, ProgressSnapshot, QuizResult } from "@/lib/types";

export default function ProgressPage() {
  const [snapshot, setSnapshot] = useState<ProgressSnapshot | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const lessonsById = new Map<string, Lesson>(getAllLessons().map((l) => [l.id, l]));

  useEffect(() => {
    setSnapshot(getProgressSnapshot());
    setResults(getQuizResults());
  }, []);

  return (
    <section className="px-6 py-section space-y-12">
      <header>
        <div className="label-uppercase text-muted">Progress</div>
        <h1 className="text-4xl font-bold mt-2">Tiến độ học tập</h1>
      </header>

      {snapshot ? (
        <ProgressSummary snapshot={snapshot} />
      ) : (
        <div className="text-sm font-light text-muted">Đang tải...</div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Quiz gần đây</h2>
        {results.length === 0 ? (
          <div className="border border-hairline bg-canvas p-12 text-center">
            <p className="text-base font-light text-muted">
              Chưa có quiz nào.{" "}
              <Link href="/" className="btn-text-link">
                BẮT ĐẦU BÀI HỌC
              </Link>
            </p>
          </div>
        ) : (
          <ul className="space-y-px bg-hairline border border-hairline">
            {results.slice(0, 10).map((r) => {
              const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
              const lesson = lessonsById.get(r.lessonId);
              return (
                <li
                  key={r.id}
                  className="bg-canvas p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="text-base font-bold truncate">
                      {lesson ? `Day ${lesson.day}: ${lesson.titleVi}` : `Lesson ${r.lessonId}`}
                    </div>
                    {lesson ? (
                      <div className="zh text-sm font-light text-body truncate mt-1">
                        {lesson.titleZh}
                      </div>
                    ) : null}
                    <div className="text-xs font-light text-muted mt-1 tracking-[0.3px]">
                      {new Date(r.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold leading-none">
                      {r.score}
                      <span className="text-muted-soft font-light">/{r.total}</span>
                    </div>
                    <div className="text-xs font-normal text-muted mt-1 tracking-[0.3px]">
                      {pct}%
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Hồ sơ học tập</h2>
        <Link href="/onboarding" className="btn-secondary inline-flex">
          CHỈNH PROFILE
        </Link>
      </div>
    </section>
  );
}
