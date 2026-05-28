"use client";

import type { CorrectionResult, ErrorType } from "@/lib/types";
import { SpeakButton } from "./SpeakButton";

interface Props {
  result: CorrectionResult;
  onSave?: () => void;
  saved?: boolean;
}

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

export function CorrectionPanel({ result, onSave, saved }: Props) {
  return (
    <div className="border border-hairline bg-canvas p-6 space-y-5">
      <Section label="原句 / Câu gốc">
        <div className="zh text-lg font-bold">{result.originalSentence}</div>
      </Section>

      {result.issues.length ? (
        <Section label="问题 / Vấn đề">
          <ul className="space-y-1 list-disc list-inside text-sm font-light text-body">
            {result.issues.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section label="正确说法 / Câu đúng">
        <div className="flex items-start gap-3">
          <div className="zh text-xl font-bold flex-1">{result.correctedSentence}</div>
          <SpeakButton text={result.correctedSentence} size="sm" />
        </div>
        <div className="text-xs font-normal text-muted mt-2 tracking-[0.3px]">{result.pinyin}</div>
      </Section>

      <Section label="越南语解释 / Giải thích">
        <p className="text-sm font-light text-body">{result.explanationVi}</p>
      </Section>

      <Section label="更自然的说法 / Cách nói tự nhiên hơn">
        <div className="flex items-start gap-3">
          <div className="zh text-lg font-bold flex-1">{result.moreNaturalVersion}</div>
          <SpeakButton text={result.moreNaturalVersion} size="sm" />
        </div>
      </Section>

      <Section label="练习 / Câu luyện tập">
        <ul className="space-y-2">
          {[result.practice1, result.practice2].filter(Boolean).map((p, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="zh text-base font-light text-body flex-1">{p}</span>
              <SpeakButton text={p} size="sm" tone="ghost" />
            </li>
          ))}
        </ul>
      </Section>

      {result.errorTypes.length ? (
        <div className="flex flex-wrap gap-2">
          {result.errorTypes.map((t) => (
            <span key={t} className="chip-accent">
              {ERROR_LABEL[t] || t}
            </span>
          ))}
        </div>
      ) : null}

      {onSave ? (
        <div className="pt-4 border-t border-hairline flex justify-end">
          <button
            type="button"
            onClick={onSave}
            disabled={saved}
            className={saved ? "btn-secondary" : "btn-primary"}
          >
            {saved ? "✓ ĐÃ LƯU" : "LƯU VÀO MISTAKE LOG"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label-uppercase text-muted mb-2">{label}</div>
      {children}
    </div>
  );
}
