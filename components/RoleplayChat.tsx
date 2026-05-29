"use client";

import { useState } from "react";
import type { CorrectionResult, Mistake, RoleplayScenario } from "@/lib/types";
import { CorrectionPanel } from "./CorrectionPanel";
import { SpeakButton } from "./SpeakButton";
import { SpeechInput } from "./SpeechInput";
import { incrementSpeakingCount, saveMistake, uid } from "@/lib/storage";

type AiTurn = { id: string; role: "ai"; zh: string; pinyin: string; vi: string };
type UserTurn = {
  id: string;
  role: "user";
  text: string;
  correction?: CorrectionResult;
  saved?: boolean;
};
type Turn = AiTurn | UserTurn;

interface Props {
  scenario: RoleplayScenario;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${url} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export function RoleplayChat({ scenario }: Props) {
  const [turns, setTurns] = useState<Turn[]>(() => [
    {
      id: uid("ai"),
      role: "ai",
      zh: `你好，我是${scenario.aiRole}。我们开始吧。`,
      pinyin: "nǐ hǎo, wǒmen kāishǐ ba.",
      vi: `Chào anh, tôi là ${scenario.aiRole}. Chúng ta bắt đầu nhé.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [showPinyin, setShowPinyin] = useState(true);
  const [showVi, setShowVi] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setError(null);
    setInput("");

    const userTurnId = uid("user");
    const userTurn: UserTurn = { id: userTurnId, role: "user", text };
    const history = turns.map((t) => ({
      role: t.role === "ai" ? "assistant" : "user",
      content: t.role === "ai" ? t.zh : t.text,
    }));
    setTurns((curr) => [...curr, userTurn]);

    try {
      let correction: CorrectionResult | undefined;
      let reply: { zh: string; pinyin: string; vi: string } | undefined;
      let anyOk = false;

      const results = await Promise.allSettled([
        postJson<{ correction: CorrectionResult }>("/api/ai/correct", {
          sentence: text,
          context: scenario.contextVi,
        }),
        postJson<{ reply: { zh: string; pinyin: string; vi: string } }>("/api/ai/roleplay", {
          scenarioContext: `${scenario.titleVi} - ${scenario.contextVi}`,
          history,
          userMessage: text,
        }),
      ]);

      if (results[0].status === "fulfilled") {
        correction = results[0].value.correction;
        anyOk = true;
      } else {
        console.error("[roleplay] correct failed:", results[0].reason);
      }
      if (results[1].status === "fulfilled") {
        reply = results[1].value.reply;
        anyOk = true;
      } else {
        console.error("[roleplay] reply failed:", results[1].reason);
      }

      setTurns((curr) => {
        const updated: Turn[] = curr.map((t) =>
          t.id === userTurnId && t.role === "user" ? { ...t, correction } : t,
        );
        if (reply) {
          updated.push({ id: uid("ai"), role: "ai", ...reply });
        }
        return updated;
      });

      if (anyOk) {
        incrementSpeakingCount();
      } else {
        setError("AI không phản hồi. Kiểm tra console hoặc thử lại.");
      }
    } catch (err) {
      console.error("[roleplay] submit failed:", err);
      setError("Có lỗi không mong đợi khi gửi. Thử lại nhé.");
    } finally {
      setBusy(false);
    }
  };

  const handleSaveMistake = (turnId: string) => {
    setTurns((curr) =>
      curr.map((t) => {
        if (t.id !== turnId || t.role !== "user") return t;
        if (t.saved || !t.correction) return t;
        const c = t.correction;
        const mistake: Mistake = {
          id: uid("mis"),
          userId: "local-user",
          originalSentence: c.originalSentence,
          correctedSentence: c.correctedSentence,
          pinyin: c.pinyin,
          explanationVi: c.explanationVi,
          betterVersion: c.moreNaturalVersion,
          errorTypes: c.errorTypes,
          context: scenario.titleVi,
          createdAt: new Date().toISOString(),
          reviewCount: 0,
          mastered: false,
        };
        const { ok } = saveMistake(mistake);
        if (!ok) {
          setError("Không lưu được mistake (localStorage có thể đầy).");
          return t;
        }
        return { ...t, saved: true };
      }),
    );
  };

  return (
    <div className="space-y-6">
      {/* Scenario header */}
      <div className="border border-hairline bg-canvas p-6">
        <div className="label-uppercase text-muted">Scenario</div>
        <div className="flex items-start gap-3 mt-2">
          <div className="zh text-2xl font-bold flex-1">{scenario.titleZh}</div>
          <SpeakButton text={scenario.titleZh} size="sm" />
        </div>
        <div className="text-base font-bold text-ink-900 mt-1">{scenario.titleVi}</div>
        <div className="text-sm font-light text-body mt-2">{scenario.contextVi}</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {scenario.targetPhrases.map((p) => (
            <span key={p} className="chip inline-flex items-center gap-2">
              <span className="zh">{p}</span>
              <SpeakButton text={p} size="xs" tone="ghost" />
            </span>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-hairline flex gap-5 text-xs font-normal text-muted">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPinyin}
              onChange={(e) => setShowPinyin(e.target.checked)}
            />
            Pinyin
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showVi}
              onChange={(e) => setShowVi(e.target.checked)}
            />
            Tiếng Việt
          </label>
        </div>
      </div>

      {/* Chat turns */}
      <ul className="space-y-4">
        {turns.map((t) =>
          t.role === "ai" ? (
            <li key={t.id} className="flex justify-start">
              <div className="max-w-[88%] bg-canvas border border-hairline p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="label-uppercase text-muted">{scenario.aiRole}</div>
                  <SpeakButton text={t.zh} size="sm" />
                </div>
                <div className="zh text-lg font-bold mt-2">{t.zh}</div>
                {showPinyin ? (
                  <div className="text-xs font-normal text-muted mt-1 tracking-[0.3px]">
                    {t.pinyin}
                  </div>
                ) : null}
                {showVi ? (
                  <div className="text-sm font-light text-body mt-1">{t.vi}</div>
                ) : null}
              </div>
            </li>
          ) : (
            <li key={t.id} className="space-y-3">
              <div className="flex justify-end">
                <div className="max-w-[88%] bg-ink-900 text-white p-4">
                  <div className="label-uppercase text-on-dark-soft">Bạn</div>
                  <div className="zh text-lg font-bold mt-2">{t.text}</div>
                </div>
              </div>
              {t.correction ? (
                <CorrectionPanel
                  result={t.correction}
                  onSave={() => handleSaveMistake(t.id)}
                  saved={t.saved}
                />
              ) : null}
            </li>
          ),
        )}
      </ul>

      {error ? (
        <div className="border border-red-600 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      {/* Audio-first input dock — speech recognition or text. */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="sticky bottom-0 bg-canvas border-t border-hairline p-3 space-y-2"
      >
        <SpeechInput
          value={input}
          onChange={setInput}
          onSubmit={submit}
          placeholder="Nói hoặc gõ câu tiếng Trung..."
          speakLabel="Nói tiếng Trung"
          rows={2}
          disabled={busy}
          hintVi="Cmd/Ctrl + Enter = gửi nhanh"
        />
        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={busy || !input.trim()}>
            {busy ? "ĐANG CHẤM..." : "GỬI ĐỂ CHẤM"}
          </button>
        </div>
      </form>
    </div>
  );
}
