"use client";

import { useEffect, useState } from "react";
import { isSpeechSupported, speak, stopSpeaking } from "@/lib/speech";

interface Props {
  text: string;
  rate?: number;
  size?: "xs" | "sm" | "md";
  tone?: "default" | "ghost" | "inverse";
  label?: string;
}

const SIZE_CLASS: Record<NonNullable<Props["size"]>, string> = {
  xs: "h-5 w-5 text-[10px]",
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
};

const TONE_CLASS: Record<NonNullable<Props["tone"]>, string> = {
  default: "bg-ink-100 text-ink-700 hover:bg-ink-200",
  ghost: "bg-transparent text-ink-500 hover:bg-ink-100",
  inverse: "bg-white/15 text-white hover:bg-white/25",
};

export function SpeakButton({ text, rate, size = "sm", tone = "default", label }: Props) {
  const [supported, setSupported] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setSupported(isSpeechSupported());
    return () => {
      // If this button is mid-speech when unmounted, stop it.
      if (playing) stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!supported || !text.trim()) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    speak(text, {
      rate,
      onStart: () => setPlaying(true),
      onEnd: () => setPlaying(false),
    });
  };

  const baseAria = label || (playing ? "Dừng phát âm" : "Nghe phát âm tiếng Trung");

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={baseAria}
      aria-pressed={playing}
      className={`inline-flex items-center justify-center rounded-full shrink-0 transition active:scale-95 ${SIZE_CLASS[size]} ${
        playing ? "bg-accent-100 text-accent-700 ring-2 ring-accent-300" : TONE_CLASS[tone]
      }`}
    >
      <span aria-hidden="true">{playing ? "■" : "🔊"}</span>
    </button>
  );
}
