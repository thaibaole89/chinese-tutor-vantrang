"use client";

import type { Register, SentencePattern, DialogueLine } from "@/lib/types";
import { SpeakButton } from "./SpeakButton";
import { usePinyinPreference } from "@/lib/pinyinPreference";

// Vietnamese labels — Vân Trang lifestyle context. Old corporate labels
// ("Business polite", "Firm negotiation") replaced.
const REGISTER_LABEL: Record<Register, string> = {
  casual: "Thân mật",
  wechat: "WeChat",
  business_polite: "Lịch sự",
  firm_negotiation: "Trang trọng",
  formal_written: "Văn viết",
};

const REGISTER_TONE: Record<Register, string> = {
  casual: "bg-rose-50 text-rose-700 border-rose-200",
  wechat: "bg-emerald-50 text-emerald-700 border-emerald-200",
  business_polite: "bg-sky-50 text-sky-700 border-sky-200",
  firm_negotiation: "bg-amber-50 text-amber-800 border-amber-200",
  formal_written: "bg-slate-100 text-slate-700 border-slate-300",
};

export function RegisterBadge({ register }: { register: Register }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-[1px] border rounded-none ${REGISTER_TONE[register]}`}
      title={`Ngữ cảnh: ${REGISTER_LABEL[register]}`}
    >
      {REGISTER_LABEL[register]}
    </span>
  );
}

export function SentencePatternList({ items }: { items: SentencePattern[] }) {
  const { showPinyin } = usePinyinPreference();
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-px bg-hairline border border-hairline">
      {items.map((s) => (
        <li key={s.id} className="bg-canvas p-6">
          <div className="flex items-start gap-3">
            <div className="zh text-xl font-bold flex-1 leading-snug">{s.zh}</div>
            <SpeakButton text={s.zh} size="sm" />
          </div>
          {showPinyin ? (
            <div className="text-xs font-normal text-muted mt-2 tracking-[0.3px]">{s.pinyin}</div>
          ) : null}
          <div className="text-sm font-light text-body mt-2">{s.vi}</div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {s.register ? <RegisterBadge register={s.register} /> : null}
            {s.usageNoteVi ? (
              <div className="inline-block bg-surface-soft border border-hairline px-3 py-1.5 text-xs font-light text-body-strong">
                <span className="label-uppercase text-bmw-blue mr-2">Ghi chú</span>
                {s.usageNoteVi}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DialogueBlock({ lines }: { lines: DialogueLine[] }) {
  const { showPinyin } = usePinyinPreference();
  return (
    <ul className="border-y border-hairline divide-y divide-hairline">
      {lines.map((line, i) => {
        // Highlight Vân Trang's own lines in the dialogue (vs the partner).
        const isUser = /vân trang|vantrang|bạn/i.test(line.speaker);
        return (
          <li
            key={i}
            className={`flex gap-4 px-1 py-4 ${
              isUser ? "bg-surface-soft" : "bg-canvas"
            }`}
          >
            <div className="min-w-[88px]">
              <div className={`label-uppercase ${isUser ? "text-bmw-blue" : "text-muted"}`}>
                {line.speaker}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3">
                <div className="zh text-lg font-bold flex-1 leading-snug">{line.zh}</div>
                <SpeakButton text={line.zh} size="sm" rate={0.85} />
              </div>
              {showPinyin ? (
                <div className="text-xs font-normal text-muted mt-1 tracking-[0.3px]">
                  {line.pinyin}
                </div>
              ) : null}
              <div className="text-sm font-light text-body mt-1">{line.vi}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
