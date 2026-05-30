"use client";

import type { RealFeedItem } from "@/lib/types";
import { tagLabel } from "@/lib/realFeed";
import { visualForCategory } from "@/data/visuals";

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
  const thumb = visualForCategory(item.categoryGroup);
  return (
    <article className="bg-canvas border border-hairline">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full text-left hover:bg-surface-soft transition"
      >
        {/* Compact row — small thumbnail + content. Keeps the feed scannable
            and short; no tall hero. */}
        <div className="p-4 sm:p-5 flex items-start gap-4">
          {thumb ? (
            <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-md bg-surface-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb.src}
                alt={thumb.alt}
                width={768}
                height={512}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="chip bg-ink-900 text-white border-ink-900">
                  {SOURCE_LABEL[item.sourceType]}
                </span>
                <span className="chip">{item.difficulty}</span>
                {item.topicTags.slice(0, 2).map((t) => (
                  <span key={t} className="chip">
                    {tagLabel(t)}
                  </span>
                ))}
              </div>
              <span className="label-uppercase text-muted shrink-0">
                {open ? "ĐÓNG ›" : "MỞ ›"}
              </span>
            </div>
            <h3 className="zh text-xl sm:text-2xl font-bold leading-snug">{item.titleZh}</h3>
            <p className="text-sm sm:text-base font-light text-body mt-1">{item.titleVi}</p>
          </div>
        </div>
      </button>
    </article>
  );
}
