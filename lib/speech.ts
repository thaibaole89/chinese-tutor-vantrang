"use client";

/**
 * Thin wrapper around browser SpeechSynthesis for Mandarin TTS.
 * Free, offline-capable, no API key. Quality depends on OS voices.
 *
 * - macOS: best with "Tingting" / "Ting-Ting"
 * - Windows: "Microsoft Yaoyao" / "Huihui" / "Xiaoxiao"
 * - Chrome (any OS): "Google 普通话(中国大陆)" if installed
 *
 * Falls back gracefully if speechSynthesis is unavailable (older browsers).
 */

const PREFERRED_VOICE_NAMES = [
  "Tingting",
  "Ting-Ting",
  "Mei-Jia",
  "Sin-Ji",
  "Microsoft Yaoyao",
  "Microsoft Huihui",
  "Microsoft Xiaoxiao",
  "Microsoft Kangkang",
  "Google 普通话",
  "Google 中文",
];

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesReady: Promise<void> | null = null;

function getSynth(): SpeechSynthesis | null {
  return typeof window !== "undefined" && "speechSynthesis" in window
    ? window.speechSynthesis
    : null;
}

function loadVoices(): Promise<void> {
  if (voicesReady) return voicesReady;
  const synth = getSynth();
  if (!synth) {
    voicesReady = Promise.resolve();
    return voicesReady;
  }
  voicesReady = new Promise((resolve) => {
    if (synth.getVoices().length > 0) {
      resolve();
      return;
    }
    const handler = () => {
      synth.removeEventListener("voiceschanged", handler);
      resolve();
    };
    synth.addEventListener("voiceschanged", handler);
    // Safety: some browsers never fire voiceschanged
    setTimeout(() => {
      synth.removeEventListener("voiceschanged", handler);
      resolve();
    }, 1500);
  });
  return voicesReady;
}

function pickVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  const all = synth.getVoices();
  const zhVoices = all.filter((v) => /^zh([-_]|$)/i.test(v.lang));
  if (zhVoices.length === 0) return null;

  for (const name of PREFERRED_VOICE_NAMES) {
    const found = zhVoices.find((v) => v.name.includes(name));
    if (found) {
      cachedVoice = found;
      return found;
    }
  }
  // Prefer Mainland (zh-CN) over Taiwan/Hong Kong
  const zhCN = zhVoices.find((v) => /^zh[-_]?CN/i.test(v.lang));
  cachedVoice = zhCN || zhVoices[0];
  return cachedVoice;
}

export function isSpeechSupported(): boolean {
  return getSynth() !== null;
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export async function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  const synth = getSynth();
  if (!synth) {
    opts.onEnd?.();
    return;
  }
  const trimmed = text.trim();
  if (!trimmed) {
    opts.onEnd?.();
    return;
  }
  await loadVoices();
  // Cancel any in-flight utterance to avoid overlap
  synth.cancel();

  const utter = new SpeechSynthesisUtterance(trimmed);
  const voice = pickVoice(synth);
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  } else {
    utter.lang = "zh-CN";
  }
  utter.rate = clamp(opts.rate ?? 0.9, 0.5, 1.5);
  utter.pitch = clamp(opts.pitch ?? 1, 0, 2);

  utter.onstart = () => opts.onStart?.();
  utter.onend = () => opts.onEnd?.();
  utter.onerror = () => opts.onEnd?.();

  synth.speak(utter);
}

export function stopSpeaking(): void {
  const synth = getSynth();
  if (!synth) return;
  synth.cancel();
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
