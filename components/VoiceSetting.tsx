"use client";

import { useEffect, useState } from "react";
import {
  getChineseVoices,
  getSavedVoiceName,
  isSpeechSupported,
  loadVoices,
  onVoicesChanged,
  selectBestChineseVoice,
  setSavedVoiceName,
  speakChinese,
  stopSpeaking,
} from "@/lib/speech";

/** Short, friendly sample so the user can compare voices. */
const SAMPLE_TEXT = "你好，欢迎来到中国。这是语音测试。";

/** "Auto" = let the app pick the best available voice. */
const AUTO_VALUE = "__auto__";

/**
 * Voice picker for Chinese TTS. Lists the device's available Mandarin
 * voices, lets the user test + choose one, and persists the choice in
 * localStorage. If the device has no Chinese voice, shows a calm hint
 * instead of crashing. Browser-only — renders nothing during SSR /
 * unsupported browsers.
 */
export function VoiceSetting() {
  const [mounted, setMounted] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selected, setSelected] = useState<string>(AUTO_VALUE);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isSpeechSupported()) {
      setSupported(false);
      return;
    }
    setSupported(true);

    let cancelled = false;
    const refresh = () => {
      if (cancelled) return;
      setVoices(getChineseVoices());
    };

    loadVoices().then(refresh);
    // Some platforms populate voices a beat later — re-read on the event.
    const unsub = onVoicesChanged(refresh);

    const saved = getSavedVoiceName();
    setSelected(saved || AUTO_VALUE);

    return () => {
      cancelled = true;
      unsub();
      stopSpeaking();
    };
  }, []);

  // Avoid hydration mismatch — render nothing until mounted on the client.
  if (!mounted) return null;

  if (!supported) {
    return (
      <div className="text-xs font-light text-muted">
        Trình duyệt này không hỗ trợ phát âm tự động.
      </div>
    );
  }

  const noChineseVoice = voices.length === 0;
  const best = noChineseVoice ? null : selectBestChineseVoice();

  const handleChange = (value: string) => {
    setSelected(value);
    setSavedVoiceName(value === AUTO_VALUE ? null : value);
  };

  const handleTest = () => {
    setTesting(true);
    const voiceName = selected === AUTO_VALUE ? undefined : selected;
    speakChinese(SAMPLE_TEXT, {
      voiceName,
      onEnd: () => setTesting(false),
    });
  };

  return (
    <div className="space-y-3">
      <div className="label-uppercase text-muted">Giọng đọc</div>

      {noChineseVoice ? (
        <div className="bg-amber-50/70 border border-amber-100 px-4 py-3 text-xs font-light text-body leading-relaxed">
          Thiết bị này chưa có giọng tiếng Trung tốt. Có thể cài thêm giọng Mandarin trong cài
          đặt hệ thống (iPhone: Cài đặt → Trợ năng → Nội dung đọc → Giọng nói → Tiếng Trung).
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selected}
              onChange={(e) => handleChange(e.target.value)}
              className="text-input flex-1 min-w-[180px]"
              aria-label="Chọn giọng đọc tiếng Trung"
            >
              <option value={AUTO_VALUE}>
                Tự động (tốt nhất)
                {selected === AUTO_VALUE && best ? ` — ${best.name}` : ""}
              </option>
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleTest}
              disabled={testing}
              className="btn-secondary text-xs disabled:opacity-50"
            >
              {testing ? "ĐANG ĐỌC…" : "NGHE THỬ"}
            </button>
          </div>
          <p className="text-[11px] font-light text-muted">
            Có {voices.length} giọng tiếng Trung trên thiết bị. Lựa chọn được lưu lại cho lần
            sau.
          </p>
        </>
      )}
    </div>
  );
}
