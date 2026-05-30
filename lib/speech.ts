"use client";

/**
 * Browser SpeechSynthesis wrapper for Mandarin TTS.
 * Free, offline-capable, no API key, no backend. Quality depends on the
 * voices the OS/browser ships:
 *   - Android (Chrome): "Google 普通话(中国大陆)" — usually the most natural
 *   - macOS / iOS: "Tingting", and enhanced/premium variants if installed
 *   - Windows: "Microsoft Yaoyao / Huihui / Xiaoxiao"
 *
 * Public API:
 *   getChineseVoices()        → SpeechSynthesisVoice[] (filtered, async-safe)
 *   selectBestChineseVoice()  → best voice by priority, honouring the user's
 *                               saved choice when still available
 *   speakChinese(text, opts?) → speak with the chosen voice + beginner-friendly
 *                               defaults (rate ~0.85, pitch 1, volume 1)
 *   loadVoices()              → resolves once voices are populated
 *   getSavedVoiceName / setSavedVoiceName — localStorage persistence
 *   onVoicesChanged(cb)       → subscribe to voiceschanged (for settings UI)
 *
 * Backward-compatible aliases kept for existing callers (SpeakButton):
 *   isSpeechSupported(), speak(), stopSpeaking()
 */

// ---------------- environment ----------------

function getSynth(): SpeechSynthesis | null {
  return typeof window !== "undefined" && "speechSynthesis" in window
    ? window.speechSynthesis
    : null;
}

export function isSpeechSupported(): boolean {
  return getSynth() !== null;
}

// ---------------- voice loading (async-safe) ----------------

let voicesReady: Promise<void> | null = null;

/** Resolves once `getVoices()` returns a non-empty list (or after a timeout). */
export function loadVoices(): Promise<void> {
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
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      synth.removeEventListener("voiceschanged", finish);
      resolve();
    };
    synth.addEventListener("voiceschanged", finish);
    // Safety: some browsers (older Safari) never fire voiceschanged.
    setTimeout(finish, 1500);
  });
  return voicesReady;
}

/** Subscribe to native voiceschanged events. Returns an unsubscribe fn. */
export function onVoicesChanged(cb: () => void): () => void {
  const synth = getSynth();
  if (!synth) return () => {};
  synth.addEventListener("voiceschanged", cb);
  return () => synth.removeEventListener("voiceschanged", cb);
}

// ---------------- Chinese voice filtering ----------------

/**
 * Name markers that identify a Chinese voice even when the `lang` field is
 * odd (some iOS builds report quirky langs). We intentionally do NOT match a
 * bare "Google" — that would pull in English Google voices. Google's Mandarin
 * voices already carry a proper `zh-*` lang and/or a 普通话/中文/Mandarin name,
 * so they're caught by the rules below without over-matching.
 */
const CHINESE_NAME_MARKERS = [
  "Chinese",
  "Mandarin",
  "中文",
  "普通话",
  "國語",
  "国语",
  "Tingting",
  "Ting-Ting",
  "Mei-Jia",
  "Meijia",
  "Sin-ji",
  "Sin-Ji",
  "Sinji",
  "Yu-shu",
  "Li-mu",
];

function isChineseVoice(v: SpeechSynthesisVoice): boolean {
  if (/^zh([-_]|$)/i.test(v.lang)) return true;
  return CHINESE_NAME_MARKERS.some((m) => v.name.includes(m));
}

/**
 * All available Chinese voices, de-duped by name. Safe before voices have
 * loaded (returns []). Call after `await loadVoices()` for a full list.
 */
export function getChineseVoices(): SpeechSynthesisVoice[] {
  const synth = getSynth();
  if (!synth) return [];
  const seen = new Set<string>();
  return synth
    .getVoices()
    .filter(isChineseVoice)
    .filter((v) => {
      if (seen.has(v.name)) return false;
      seen.add(v.name);
      return true;
    });
}

// ---------------- voice priority ----------------

/**
 * Higher score = better default. Order encoded:
 *   1. zh-CN (Mainland Mandarin) base — highest
 *   2. Google Mandarin bonus
 *   3. Apple enhanced/premium bonus
 *   4. any zh fallback (zh-TW / zh-HK still score, just lower)
 */
function scoreVoice(v: SpeechSynthesisVoice): number {
  let s = 0;
  const lang = v.lang.toLowerCase();
  const name = v.name;

  if (/^zh[-_]?cn/i.test(lang) || lang === "zh" || /普通话|简体|中国大陆/.test(name)) {
    s += 100; // Mainland Mandarin
  } else if (/^zh/i.test(lang)) {
    s += 40; // zh-TW / zh-HK — usable fallback
  }

  if (/google/i.test(name)) s += 30; // Google Mandarin tends to be most natural
  if (/enhanced|premium|siri|neural|natural/i.test(name)) s += 25; // Apple/MS enhanced
  if (/tingting|ting-ting|mei-jia|meijia/i.test(name)) s += 8; // known-good Apple names
  // local (offline) service is fine; remote sometimes higher quality — tiny nudge
  if (v.localService === false) s += 2;

  return s;
}

const SAVED_VOICE_KEY = "ctb.ttsVoice.v1";

export function getSavedVoiceName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SAVED_VOICE_KEY);
  } catch {
    return null;
  }
}

export function setSavedVoiceName(name: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (name) window.localStorage.setItem(SAVED_VOICE_KEY, name);
    else window.localStorage.removeItem(SAVED_VOICE_KEY);
  } catch {
    /* private mode / quota */
  }
}

/**
 * Best Chinese voice to use right now. Honours the user's saved choice when
 * it's still available; otherwise picks the highest-scoring voice. Returns
 * null when the device has no Chinese voice at all.
 */
export function selectBestChineseVoice(): SpeechSynthesisVoice | null {
  const voices = getChineseVoices();
  if (voices.length === 0) return null;

  // 1) Honour saved user choice if still present.
  const saved = getSavedVoiceName();
  if (saved) {
    const match = voices.find((v) => v.name === saved);
    if (match) return match;
  }

  // 2) Otherwise highest score wins; stable tiebreak by name.
  return voices
    .slice()
    .sort((a, b) => scoreVoice(b) - scoreVoice(a) || a.name.localeCompare(b.name))[0];
}

// ---------------- speaking ----------------

export interface SpeakChineseOptions {
  /** 0.5–1.5; default 0.85 — slightly slow for beginner listening. */
  rate?: number;
  /** 0–2; default 1.0. */
  pitch?: number;
  /** 0–1; default 1.0. */
  volume?: number;
  /** Force a specific voice by name (overrides the saved/best voice). */
  voiceName?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Speak a Mandarin string. Resolves the best (or requested) Chinese voice,
 * applies beginner-friendly defaults, and cancels any in-flight utterance so
 * taps don't overlap. No-ops safely on the server or unsupported browsers.
 */
export async function speakChinese(
  text: string,
  opts: SpeakChineseOptions = {},
): Promise<void> {
  const synth = getSynth();
  const trimmed = (text || "").trim();
  if (!synth || !trimmed) {
    opts.onEnd?.();
    return;
  }

  await loadVoices();
  synth.cancel(); // avoid overlap

  const utter = new SpeechSynthesisUtterance(trimmed);

  let voice: SpeechSynthesisVoice | null = null;
  if (opts.voiceName) {
    voice = getChineseVoices().find((v) => v.name === opts.voiceName) || null;
  }
  if (!voice) voice = selectBestChineseVoice();

  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang || "zh-CN";
  } else {
    // No Chinese voice installed — still set zh-CN so the engine at least
    // attempts Mandarin pronunciation rather than reading pinyin as English.
    utter.lang = "zh-CN";
  }

  utter.rate = clamp(opts.rate ?? 0.85, 0.5, 1.5);
  utter.pitch = clamp(opts.pitch ?? 1.0, 0, 2);
  utter.volume = clamp(opts.volume ?? 1.0, 0, 1);

  utter.onstart = () => opts.onStart?.();
  utter.onend = () => opts.onEnd?.();
  utter.onerror = () => opts.onEnd?.();

  synth.speak(utter);
}

export function stopSpeaking(): void {
  getSynth()?.cancel();
}

// ---------------- backward-compatible aliases ----------------
// Existing callers (SpeakButton) import { speak }. Keep the old signature
// working by delegating to speakChinese.

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  return speakChinese(text, opts);
}
