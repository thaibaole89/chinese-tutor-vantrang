"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CardFirstHome } from "@/components/CardFirstHome";
import { getProfile, getProgressSnapshot } from "@/lib/storage";
import type { ProgressSnapshot, UserProfile } from "@/lib/types";

/**
 * Card-First Home (Phase 1.5).
 *
 * When Vân Trang opens the app, she sees ONE Chinese phrase. Tap reveals
 * Vietnamese + example. "Câu tiếp" moves on. Filter pills at the top
 * re-bucket the deck. All existing routes (/session/today, /flashcards,
 * /domain-packs, etc.) are reachable via the secondary menu at the bottom
 * of the card flow.
 *
 * Old dashboard with 3 daily promo cards (Core Lesson / Real Chinese /
 * WeChat Drill) is replaced — its destinations live in the secondary
 * menu so nothing is lost, just calmer.
 */
export default function DashboardPage() {
  const [hydrated, setHydrated] = useState(false);
  const [snapshot, setSnapshot] = useState<ProgressSnapshot | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setSnapshot(getProgressSnapshot());
    setProfile(getProfile());
    setHydrated(true);
  }, []);

  const displayName = hydrated ? profile?.name || "Vân Trang" : "Vân Trang";

  return (
    <>
      {/* --------- COMPACT HERO — greeting + streak + 20-phút CTA ---------- */}
      <section className="bg-ink-900 text-white">
        <div className="px-4 sm:px-6 pt-6 pb-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="label-uppercase text-on-dark-soft">Chinese Tutor Vân Trang</div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight truncate">
                Chào {displayName} ✿
              </h1>
              <p className="mt-1 text-[12px] sm:text-sm font-light text-on-dark-soft">
                Lướt thẻ học — chạm để hiểu, nghe để nhớ.
              </p>
            </div>
            <Link
              href="/session/today"
              className="shrink-0 inline-flex items-center justify-center px-3 sm:px-4 h-10 text-[11px] sm:text-[12px] font-bold tracking-[0.5px] bg-bmw-blue text-white hover:bg-bmw-blue-active transition whitespace-nowrap"
            >
              20 PHÚT ›
            </Link>
          </div>
          {/* Tiny stats strip — only when there's actual progress */}
          {hydrated && snapshot && (snapshot.streak > 0 || snapshot.totalVocabulary > 0) ? (
            <div className="mt-4 flex items-center gap-4 text-[11px] font-light text-on-dark-soft">
              {snapshot.streak > 0 ? (
                <span>
                  🔥 <strong className="font-bold text-white">{snapshot.streak}</strong>{" "}
                  ngày liên tục
                </span>
              ) : null}
              {snapshot.totalVocabulary > 0 ? (
                <span>
                  📚{" "}
                  <strong className="font-bold text-white">
                    {snapshot.masteredVocabulary}/{snapshot.totalVocabulary}
                  </strong>{" "}
                  từ đã thuộc
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {/* --------- MAIN VIEWPORT — Card-First flow ---------- */}
      <CardFirstHome />
    </>
  );
}
