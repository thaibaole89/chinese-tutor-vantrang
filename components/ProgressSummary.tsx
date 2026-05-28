import type { ProgressSnapshot } from "@/lib/types";

export function ProgressSummary({ snapshot }: { snapshot: ProgressSnapshot }) {
  const items = [
    { label: "Bài đã học", value: snapshot.lessonsCompleted },
    { label: "Từ vựng", value: snapshot.totalVocabulary },
    { label: "Đã thuộc", value: snapshot.masteredVocabulary },
    { label: "Lỗi đang lặp", value: snapshot.recurringMistakes },
    { label: "Quiz TB", value: `${snapshot.quizAverage}%` },
    { label: "Streak", value: `${snapshot.streak} ngày` },
    { label: "Lần luyện nói", value: snapshot.speakingPracticeCount },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-hairline border border-hairline">
      {items.map((it) => (
        <div key={it.label} className="bg-canvas p-5">
          <div className="label-uppercase text-muted">{it.label}</div>
          <div className="mt-3 text-3xl font-bold leading-none">{it.value}</div>
        </div>
      ))}
    </div>
  );
}
