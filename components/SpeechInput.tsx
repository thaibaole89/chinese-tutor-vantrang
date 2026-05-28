"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Audio-first text input. Uses browser SpeechRecognition with zh-CN.
 * Graceful: if unsupported, the component just renders a textarea + status note.
 * Caller drives "what to do with the transcript" via onChange/onSubmit.
 *
 * Pure client side. Never touches any server API. Build-safe.
 */

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  /** Vietnamese label for the speak button when idle. Default: "Nói tiếng Trung". */
  speakLabel?: string;
  rows?: number;
  disabled?: boolean;
  /** Submit hint shown under the textarea. */
  hintVi?: string;
  /** Use the dark variant — for use inside dark hero bands. */
  tone?: "default" | "dark";
}

// SpeechRecognition isn't in lib.dom yet — narrow via interface.
type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type Status = "idle" | "listening" | "processing" | "unsupported";

function getRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function SpeechInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Nhập câu tiếng Trung hoặc nhấn nút để nói…",
  speakLabel = "Nói tiếng Trung",
  rows = 3,
  disabled = false,
  hintVi,
  tone = "default",
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const Ctor = getRecognition();
    if (!Ctor) {
      setStatus("unsupported");
      return;
    }
    return () => {
      // Tear down any in-flight recognition on unmount.
      try {
        recognitionRef.current?.abort();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const start = () => {
    setError(null);
    const Ctor = getRecognition();
    if (!Ctor) {
      setStatus("unsupported");
      return;
    }
    try {
      const rec = new Ctor();
      rec.lang = "zh-CN";
      rec.continuous = false;
      rec.interimResults = true;

      let finalText = "";
      let interimText = "";

      rec.onresult = (event: any) => {
        interimText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0]?.transcript ?? "";
          if (result.isFinal) finalText += transcript;
          else interimText += transcript;
        }
        // Live update — caller sees text as user speaks.
        onChange((finalText + interimText).trim());
      };
      rec.onerror = (event: any) => {
        const code = event?.error || "unknown";
        if (code === "not-allowed" || code === "service-not-allowed") {
          setError("Trình duyệt chặn micro. Bật quyền micro để dùng.");
        } else if (code === "no-speech") {
          setError("Không nhận được giọng nói. Thử lại.");
        } else {
          setError(`Lỗi nhận diện: ${code}`);
        }
        setStatus("idle");
      };
      rec.onend = () => {
        setStatus((s) => (s === "listening" ? "processing" : s));
        // Brief processing state then idle.
        setTimeout(() => setStatus("idle"), 200);
      };

      recognitionRef.current = rec;
      rec.start();
      setStatus("listening");
    } catch (err) {
      console.error("[SpeechInput] start failed:", err);
      setStatus("idle");
      setError("Không khởi động được nhận diện giọng nói.");
    }
  };

  const stop = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    setStatus("processing");
  };

  const isDark = tone === "dark";
  const isUnsupported = status === "unsupported";
  const isListening = status === "listening";
  const isProcessing = status === "processing";

  const handleSubmit = () => {
    if (disabled || !value.trim()) return;
    onSubmit?.();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {!isUnsupported ? (
          <button
            type="button"
            onClick={isListening ? stop : start}
            disabled={disabled || isProcessing}
            aria-pressed={isListening}
            className={`inline-flex items-center gap-2 px-4 py-2 text-[13px] font-bold tracking-[0.5px] border transition ${
              isListening
                ? "bg-red-600 text-white border-red-600 animate-pulse"
                : isProcessing
                ? "bg-ink-100 text-muted border-hairline-strong"
                : isDark
                ? "bg-white text-ink-900 border-white hover:bg-ink-100"
                : "bg-bmw-blue text-white border-bmw-blue hover:bg-bmw-blue-active"
            }`}
          >
            <span aria-hidden="true">{isListening ? "■" : "🎙️"}</span>
            <span>
              {isListening ? "ĐANG NGHE…" : isProcessing ? "ĐANG XỬ LÝ…" : speakLabel.toUpperCase()}
            </span>
          </button>
        ) : (
          <span
            className={`text-[11px] font-normal tracking-[0.3px] ${
              isDark ? "text-on-dark-soft" : "text-muted"
            }`}
          >
            🎤 Trình duyệt này chưa hỗ trợ nhận diện giọng nói — gõ tay nhé.
          </span>
        )}
        {hintVi ? (
          <span className={`text-[11px] font-normal ${isDark ? "text-on-dark-soft" : "text-muted"}`}>
            {hintVi}
          </span>
        ) : null}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`zh w-full px-3 py-2 text-base font-light border outline-none transition ${
          isDark
            ? "bg-surface-dark-elevated border-surface-dark-elevated text-white focus:border-white"
            : "bg-canvas border-hairline focus:border-ink-900 text-ink-900"
        } ${isListening ? "border-red-600" : ""}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />

      {error ? (
        <div className="text-xs font-light text-red-600">{error}</div>
      ) : null}
    </div>
  );
}
