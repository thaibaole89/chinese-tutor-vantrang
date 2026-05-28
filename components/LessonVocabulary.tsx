import type { VocabularyItem } from "@/lib/types";
import { SpeakButton } from "./SpeakButton";

interface Props {
  items: VocabularyItem[];
}

export function LessonVocabulary({ items }: Props) {
  return (
    <ul className="divide-y divide-hairline border-y border-hairline">
      {items.map((v) => (
        <li key={v.id} className="py-4 flex items-start gap-4">
          <div className="min-w-[100px]">
            <div className="flex items-center gap-2">
              <div className="zh text-3xl font-bold leading-none">{v.hanzi}</div>
              <SpeakButton text={v.hanzi} size="sm" tone="ghost" />
            </div>
            <div className="text-xs font-normal text-muted mt-1">{v.pinyin}</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold">{v.vietnameseMeaning}</div>
            <div className="mt-1 flex items-start gap-2">
              <div className="zh text-base font-light text-body flex-1">{v.exampleZh}</div>
              <SpeakButton text={v.exampleZh} size="sm" tone="ghost" />
            </div>
            <div className="text-sm font-light text-muted">{v.exampleVi}</div>
          </div>
          <span
            className={`chip shrink-0 ${v.frequencyLevel === "high" ? "chip-accent" : ""}`}
          >
            {v.frequencyLevel}
          </span>
        </li>
      ))}
    </ul>
  );
}
