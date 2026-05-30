"use client";

import { useMemo, useState } from "react";
import type { QuizQuestion, QuizResult } from "@/lib/types";
import { saveQuizResult, uid } from "@/lib/storage";

interface Props {
  lessonId: string;
  questions: QuizQuestion[];
  onComplete?: (result: QuizResult) => void;
}

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/[，。！？,.!?\s]+/g, "");
}

function hasChinese(s: string): boolean {
  return /[一-鿿]/.test(s);
}

function isCorrect(q: QuizQuestion, userAnswer: string): boolean {
  const a = norm(userAnswer);
  const expected = norm(q.answer);

  if (q.type === "roleplay_response") {
    return hasChinese(userAnswer) && userAnswer.trim().length >= 6;
  }

  if (q.type === "vi_to_zh") {
    if (!hasChinese(userAnswer)) return false;
    if (a === expected) return true;
    const ratio = Math.min(a.length, expected.length) / Math.max(a.length, expected.length);
    if (ratio < 0.7) return false;
    return expected.includes(a) || a.includes(expected);
  }

  return a === expected;
}

const LABEL: Record<QuizQuestion["type"], string> = {
  vi_to_zh: "Dịch sang tiếng Trung",
  zh_to_vi: "Dịch sang tiếng Việt",
  choose_pinyin: "Chọn pinyin đúng",
  complete_sentence: "Điền vào chỗ trống",
  roleplay_response: "Viết câu trả lời ngắn",
};

export function MiniQuiz({ lessonId, questions, onComplete }: Props) {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [answers, setAnswers] = useState<
    Array<{ questionId: string; userAnswer: string; correct: boolean }>
  >([]);
  const [done, setDone] = useState(false);

  const q = questions[idx];
  const score = useMemo(() => answers.filter((a) => a.correct).length, [answers]);

  // Recognition questions where pinyin is useful as a hint (not the answer).
  // choose_pinyin → answer IS pinyin, never hint. vi_to_zh → would defeat
  // purpose. zh_to_vi + complete_sentence → safe to hint.
  const canHintPinyin =
    !!q?.pinyin &&
    (q.type === "zh_to_vi" || q.type === "complete_sentence");

  if (!q && !done) return null;

  if (done) {
    return (
      <div className="border border-hairline bg-canvas p-8 text-center space-y-3">
        <div className="label-uppercase text-muted">Kết quả</div>
        <div className="text-6xl font-bold leading-none">
          {score} <span className="text-muted-soft font-light">/ {questions.length}</span>
        </div>
        <p className="text-sm font-light text-body">Bạn đã hoàn thành mini quiz hôm nay.</p>
      </div>
    );
  }

  const handleCheck = () => {
    if (revealed) return;
    setRevealed(true);
    const correct = isCorrect(q, answer);
    setAnswers([...answers, { questionId: q.id, userAnswer: answer, correct }]);
  };

  const handleNext = () => {
    if (!revealed) return;
    setAnswer("");
    setRevealed(false);
    setHintShown(false);
    if (idx + 1 >= questions.length) {
      const result: QuizResult = {
        id: uid("quiz"),
        lessonId,
        score: answers.filter((a) => a.correct).length,
        total: questions.length,
        answers,
        createdAt: new Date().toISOString(),
      };
      saveQuizResult(result);
      onComplete?.(result);
      setDone(true);
      return;
    }
    setIdx(idx + 1);
  };

  return (
    <div className="border border-hairline bg-canvas p-6 space-y-5">
      <div className="flex items-center justify-between">
        <span className="label-uppercase text-muted">{LABEL[q.type]}</span>
        <span className="text-xs font-light text-muted">
          {idx + 1} / {questions.length}
        </span>
      </div>
      <div>
        <div className="text-xl font-bold leading-snug">
          <span
            className={
              q.type === "zh_to_vi" || q.type === "choose_pinyin" || q.type === "complete_sentence"
                ? "zh"
                : ""
            }
          >
            {q.prompt}
          </span>
        </div>
        {/* Tap-to-reveal pinyin hint for recognition questions. */}
        {canHintPinyin ? (
          hintShown || revealed ? (
            <div className="mt-2 text-sm font-light text-muted tracking-[0.3px]">
              {q.pinyin}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setHintShown(true)}
              className="mt-2 text-[12px] font-bold tracking-[1px] uppercase text-bmw-blue hover:underline"
            >
              Xem pinyin ›
            </button>
          )
        ) : null}
      </div>

      {q.type === "choose_pinyin" && q.options ? (
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt) => {
            const isSelected = answer === opt;
            const showCorrect = revealed && opt === q.answer;
            const showWrong = revealed && isSelected && opt !== q.answer;
            return (
              <button
                key={opt}
                type="button"
                aria-pressed={isSelected}
                onClick={() => !revealed && setAnswer(opt)}
                className={`h-12 px-4 text-sm font-bold tracking-[0.5px] border transition ${
                  showCorrect
                    ? "bg-green-600 border-green-600 text-white"
                    : showWrong
                    ? "bg-red-600 border-red-600 text-white"
                    : isSelected
                    ? "bg-ink-900 border-ink-900 text-white"
                    : "bg-canvas border-hairline-strong text-ink-900 hover:border-ink-900"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={
            q.type === "zh_to_vi"
              ? "Nhập tiếng Việt..."
              : q.type === "complete_sentence"
              ? "Điền từ còn thiếu..."
              : "Nhập câu trả lời..."
          }
          className={`text-input ${q.type !== "zh_to_vi" ? "zh" : ""}`}
          disabled={revealed}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              revealed ? handleNext() : handleCheck();
            }
          }}
        />
      )}

      {revealed ? (
        <div className="border border-hairline bg-surface-soft p-4">
          <div className="label-uppercase text-muted mb-2">Đáp án</div>
          <div className={`text-lg font-bold ${q.type === "zh_to_vi" ? "" : "zh"}`}>{q.answer}</div>
          {q.explanationVi ? (
            <div className="text-sm font-light text-body mt-2">{q.explanationVi}</div>
          ) : null}
        </div>
      ) : null}

      <div className="flex justify-end gap-2">
        {!revealed ? (
          <button
            type="button"
            onClick={handleCheck}
            className="btn-primary"
            disabled={!answer.trim()}
          >
            KIỂM TRA
          </button>
        ) : (
          <button type="button" onClick={handleNext} className="btn-primary">
            {idx + 1 >= questions.length ? "XEM KẾT QUẢ" : "CÂU TIẾP"}
          </button>
        )}
      </div>
    </div>
  );
}
