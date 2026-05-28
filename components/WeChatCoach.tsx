"use client";

import { useState } from "react";
import type { WeChatCoachResult, WeChatTone } from "@/lib/types";
import { SpeakButton } from "./SpeakButton";
import { SpeechInput } from "./SpeechInput";
import { upsertVocabAsFlashcards } from "@/lib/storage";

// Vân Trang lifestyle context: tone enum values stay backward-compatible
// (friendly / polite / firm) but the UI labels them as casual / warm / respectful.
const TONE_LABEL: Record<WeChatTone, string> = {
  friendly: "Casual (bạn thân, group fan)",
  polite: "Warm (gia đình, người quen)",
  firm: "Respectful (lịch sự, người lạ / lớn tuổi)",
};

const TONE_ACCENT: Record<WeChatTone, string> = {
  friendly: "border-l-green-600",
  polite: "border-l-bmw-blue",
  firm: "border-l-red-600",
};

export function WeChatCoach() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<WeChatCoachResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vocabSaved, setVocabSaved] = useState<number | null>(null);

  const submit = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setError(null);
    setVocabSaved(null);
    try {
      const res = await fetch("/api/ai/wechat-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: text }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`${res.status} ${t}`);
      }
      const data = await res.json();
      setResult(data.result as WeChatCoachResult);
    } catch (err) {
      console.error("[wechat-coach] failed:", err);
      setError("Không gọi được Chat Coach. Thử lại sau.");
    } finally {
      setBusy(false);
    }
  };

  const handleSaveVocab = () => {
    if (!result) return;
    const { added } = upsertVocabAsFlashcards(result.keyVocabulary, {
      sourceTag: "wechat-coach",
    });
    setVocabSaved(added);
  };

  return (
    <div className="space-y-8">
      {/* Input — audio-first via SpeechInput */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="bg-canvas border border-hairline p-6 space-y-3"
      >
        <label className="label-uppercase text-muted block">
          Bạn muốn nói gì? (Tiếng Việt, tiếng Trung thô, hoặc trộn — gõ hoặc nói)
        </label>
        <SpeechInput
          value={input}
          onChange={setInput}
          onSubmit={submit}
          placeholder="vd: Muốn nhắn cô Vương chúc Tết, kèm gửi ảnh bánh chưng nhà mới làm — tone ấm ấm chân thành..."
          speakLabel="Nói thử"
          rows={3}
          disabled={busy}
          hintVi="Cmd/Ctrl + Enter để gửi"
        />
        <div className="flex items-center justify-end">
          <button type="submit" className="btn-primary" disabled={busy || !input.trim()}>
            {busy ? "ĐANG SOẠN..." : "SOẠN 3 PHIÊN BẢN"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="border border-red-600 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      {result ? (
        <>
          {/* Score panel — quality of user input message */}
          {result.corporateToneScore !== undefined ||
          result.clarityScore !== undefined ||
          result.naturalnessScore !== undefined ? (
            <div className="grid grid-cols-3 gap-px bg-hairline border border-hairline">
              <ScoreCell label="Warmth" value={result.corporateToneScore} />
              <ScoreCell label="Clarity" value={result.clarityScore} />
              <ScoreCell label="Naturalness" value={result.naturalnessScore} />
            </div>
          ) : null}

          {/* 3 versions */}
          <div className="space-y-px bg-hairline border border-hairline">
            {result.versions.map((v) => (
              <div
                key={v.tone}
                className={`bg-canvas p-5 border-l-4 ${TONE_ACCENT[v.tone]}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="label-uppercase text-muted">Tone</div>
                    <div className="text-base font-bold mt-1">{TONE_LABEL[v.tone]}</div>
                  </div>
                  <SpeakButton text={v.zh} size="md" />
                </div>
                <div className="zh text-lg font-bold leading-snug">{v.zh}</div>
                <div className="text-xs font-normal text-muted mt-1 tracking-[0.3px]">
                  {v.pinyin}
                </div>
                <div className="text-sm font-light text-body mt-2">{v.vi}</div>
                {v.usageNoteVi ? (
                  <div className="mt-3 bg-surface-soft border border-hairline px-3 py-2 text-xs font-light text-body">
                    <span className="label-uppercase text-bmw-blue mr-2">Note</span>
                    {v.usageNoteVi}
                  </div>
                ) : null}
                {v.riskNoteVi ? (
                  <div className="mt-2 bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-light text-amber-900">
                    <span className="label-uppercase text-amber-700 mr-2">Rủi ro</span>
                    {v.riskNoteVi}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Suggested vocabulary — quick chips */}
          {result.suggestedVocabulary && result.suggestedVocabulary.length ? (
            <div className="border border-hairline bg-canvas p-5">
              <div className="label-uppercase text-muted mb-3">Từ vựng gợi ý cho ngữ cảnh này</div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.suggestedVocabulary.map((sv) => (
                  <li
                    key={sv.hanzi}
                    className="flex items-center gap-3 bg-surface-soft border border-hairline px-3 py-2"
                  >
                    <span className="zh text-base font-bold">{sv.hanzi}</span>
                    <SpeakButton text={sv.hanzi} size="xs" tone="ghost" />
                    <span className="text-xs font-normal text-muted tracking-[0.3px]">
                      {sv.pinyin}
                    </span>
                    <span className="text-xs font-light text-body ml-auto truncate">{sv.vi}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Key vocab */}
          {result.keyVocabulary.length ? (
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <span className="label-uppercase text-muted">Từ vựng chính</span>
                <button
                  type="button"
                  onClick={handleSaveVocab}
                  className={vocabSaved !== null ? "btn-secondary" : "btn-primary"}
                >
                  {vocabSaved !== null
                    ? `✓ ĐÃ LƯU (+${vocabSaved} THẺ MỚI)`
                    : "LƯU VÀO FLASHCARDS"}
                </button>
              </div>
              <ul className="divide-y divide-hairline border border-hairline bg-canvas">
                {result.keyVocabulary.map((v) => (
                  <li key={v.id} className="p-4 flex items-start gap-3">
                    <div className="min-w-[88px]">
                      <div className="flex items-center gap-2">
                        <span className="zh text-xl font-bold">{v.hanzi}</span>
                        <SpeakButton text={v.hanzi} size="xs" tone="ghost" />
                      </div>
                      <div className="text-xs font-normal text-muted mt-0.5">{v.pinyin}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{v.vietnameseMeaning}</div>
                      {v.exampleZh ? (
                        <>
                          <div className="zh text-sm font-light text-body mt-1">{v.exampleZh}</div>
                          <div className="text-xs font-light text-muted">{v.exampleVi}</div>
                        </>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Possible next turn */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border border-hairline">
            <FollowUpCell
              label="Câu hỏi follow-up có thể bạn cần hỏi tiếp"
              triplet={result.followUpQuestion}
            />
            <FollowUpCell
              label="Phản hồi đối phương có thể đưa ra"
              triplet={result.partnerReply}
            />
            <FollowUpCell
              label="Bạn có thể nhắn lại"
              triplet={result.suggestedResponse}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}

function FollowUpCell({
  label,
  triplet,
}: {
  label: string;
  triplet: { zh: string; pinyin: string; vi: string };
}) {
  if (!triplet.zh) return <div className="bg-canvas p-5" />;
  return (
    <div className="bg-canvas p-5">
      <div className="label-uppercase text-muted mb-2">{label}</div>
      <div className="flex items-start gap-2">
        <div className="zh text-base font-bold flex-1">{triplet.zh}</div>
        <SpeakButton text={triplet.zh} size="xs" tone="ghost" />
      </div>
      <div className="text-xs font-normal text-muted mt-1 tracking-[0.3px]">{triplet.pinyin}</div>
      <div className="text-sm font-light text-body mt-1">{triplet.vi}</div>
    </div>
  );
}

function ScoreCell({ label, value }: { label: string; value: number | undefined }) {
  if (value === undefined) return <div className="bg-canvas p-4" />;
  const tone =
    value >= 8
      ? "text-emerald-700"
      : value >= 6
      ? "text-bmw-blue"
      : value >= 4
      ? "text-amber-700"
      : "text-red-700";
  return (
    <div className="bg-canvas p-4">
      <div className="label-uppercase text-muted">{label}</div>
      <div className={`mt-2 text-3xl font-bold leading-none ${tone}`}>
        {value}
        <span className="text-base text-muted-soft font-light">/10</span>
      </div>
    </div>
  );
}
