"use client";

import type { RealFeedItem } from "@/lib/types";
import { LearningVisual } from "./LearningVisual";

const SOURCE_LABEL: Record<RealFeedItem["sourceType"], string> = {
  news: "Tin tức",
  social: "Mạng xã hội",
  music: "Nhạc",
  wechat: "WeChat",
  travel: "Du lịch",
  drama: "Phim",
};

interface Props {
  item: RealFeedItem;
  open: boolean;
  onToggle: () => void;
}

export function RealFeedCard({ item, open, onToggle }: Props) {
  return (
    <article className="bg-canvas border border-hairline">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full text-left hover:bg-surface-soft transition"
      >
        {/* Visual hero — compact learning scene with purpose tag + key-object chips */}
        <LearningVisual spec={item.visual} density="compact" />

        {/* Body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="chip bg-ink-900 text-white border-ink-900">
                {SOURCE_LABEL[item.sourceType]}
              </span>
              <span className="chip">{item.difficulty}</span>
              {item.topicTags.slice(0, 3).map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <span className="label-uppercase text-muted shrink-0">
              {open ? "ĐÓNG ›" : "MỞ ›"}
            </span>
          </div>
          <h3 className="zh text-2xl sm:text-3xl font-bold leading-snug">{item.titleZh}</h3>
          <p className="text-base font-light text-body mt-1">{item.titleVi}</p>
        </div>
      </button>
    </article>
  );
}
