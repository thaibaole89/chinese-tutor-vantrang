"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Global pinyin show/hide preference, persisted in localStorage.
 *
 * Default: true (beginner-friendly — Vân Trang sees pinyin under every
 * Chinese character until she explicitly hides it).
 *
 * Hook usage:
 *   const { showPinyin, setShowPinyin, toggle } = usePinyinPreference();
 *   {showPinyin ? <div className="pinyin">{p}</div> : null}
 *
 * Custom event "ctb:pinyin-change" fires on every change so other
 * components mounted in parallel can re-render instantly.
 */
export const PINYIN_PREF_KEY = "ctb.showPinyin.v1";
const PINYIN_EVENT = "ctb:pinyin-change";

function read(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(PINYIN_PREF_KEY);
    if (raw === null) return true; // default ON for beginners
    return raw === "true" || raw === "1";
  } catch {
    return true;
  }
}

function write(v: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PINYIN_PREF_KEY, v ? "true" : "false");
    window.dispatchEvent(new CustomEvent(PINYIN_EVENT, { detail: { value: v } }));
  } catch {
    /* private mode / quota */
  }
}

export function usePinyinPreference() {
  // On first render (SSR + first client mount) we MUST return the default
  // to avoid hydration mismatch. Then we sync from localStorage in effect.
  const [showPinyin, setShowPinyinState] = useState<boolean>(true);

  useEffect(() => {
    setShowPinyinState(read());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.value === "boolean") {
        setShowPinyinState(detail.value);
      } else {
        setShowPinyinState(read());
      }
    };
    window.addEventListener(PINYIN_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(PINYIN_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const setShowPinyin = useCallback((v: boolean) => {
    setShowPinyinState(v);
    write(v);
  }, []);

  const toggle = useCallback(() => {
    setShowPinyinState((cur) => {
      const next = !cur;
      write(next);
      return next;
    });
  }, []);

  return { showPinyin, setShowPinyin, toggle };
}
