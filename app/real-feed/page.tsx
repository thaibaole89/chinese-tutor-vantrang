"use client";

import { useMemo, useState } from "react";
import { RealFeedCard } from "@/components/RealFeedCard";
import { RealFeedLesson } from "@/components/RealFeedLesson";
import {
  CATEGORY_LABEL,
  filterRealFeed,
  getAllRealFeedItems,
  listAllTopicTags,
  listAllSourceTypes,
} from "@/lib/realFeed";
import type { RealFeedCategoryGroup, RealFeedSource } from "@/lib/types";

const SOURCE_LABEL: Record<RealFeedSource, string> = {
  news: "Tin tức",
  social: "Mạng xã hội",
  business: "Business",
  music: "Âm nhạc",
  wechat: "WeChat",
};

const ALL_CATEGORIES: RealFeedCategoryGroup[] = [
  "business",
  "luxury-retail",
  "duty-free-airport",
  "finance-ai-crypto",
  "social",
  "music",
];

export default function RealFeedPage() {
  const all = getAllRealFeedItems();
  const tags = listAllTopicTags();
  const sources = listAllSourceTypes();

  const [category, setCategory] = useState<RealFeedCategoryGroup | "all">("all");
  const [source, setSource] = useState<RealFeedSource | "all">("all");
  const [tag, setTag] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterRealFeed(all, { source, tag, category }),
    [all, source, tag, category],
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-ink-900 text-white">
        <div className="px-6 py-section">
          <div className="label-uppercase text-on-dark-soft">Real Chinese</div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold leading-[1.05]">
            Tiếng Trung đời thật
          </h1>
          <p className="mt-3 max-w-2xl text-base font-light text-on-dark-soft">
            Tin tức, WeChat, slang, music — không phải tiếng Trung sách giáo khoa. 10 nội dung
            ngắn từng được người Trung dùng thật trong công việc và đời sống.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-hairline bg-canvas sticky top-16 z-20">
        <div className="px-6 py-4 space-y-3">
          <div>
            <span className="label-uppercase text-muted mr-3">Lĩnh vực</span>
            <div className="inline-flex flex-wrap gap-2 mt-2">
              <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
                Tất cả
              </FilterChip>
              {ALL_CATEGORIES.map((c) => (
                <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
                  {CATEGORY_LABEL[c]}
                </FilterChip>
              ))}
            </div>
          </div>
          <div>
            <span className="label-uppercase text-muted mr-3">Loại</span>
            <div className="inline-flex flex-wrap gap-2 mt-2">
              <FilterChip active={source === "all"} onClick={() => setSource("all")}>
                Tất cả
              </FilterChip>
              {sources.map((s) => (
                <FilterChip
                  key={s}
                  active={source === s}
                  onClick={() => setSource(s)}
                >
                  {SOURCE_LABEL[s]}
                </FilterChip>
              ))}
            </div>
          </div>
          <div>
            <span className="label-uppercase text-muted mr-3">Chủ đề</span>
            <div className="inline-flex flex-wrap gap-2 mt-2">
              <FilterChip active={tag === "all"} onClick={() => setTag("all")}>
                Tất cả
              </FilterChip>
              {tags.map((t) => (
                <FilterChip key={t} active={tag === t} onClick={() => setTag(t)}>
                  {t}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="px-6 py-section">
        {filtered.length === 0 ? (
          <div className="border border-hairline bg-canvas p-12 text-center text-sm font-light text-muted">
            Không có nội dung khớp filter này.
          </div>
        ) : (
          <ul className="space-y-px bg-hairline border border-hairline">
            {filtered.map((item) => {
              const open = openId === item.id;
              return (
                <li key={item.id}>
                  <RealFeedCard
                    item={item}
                    open={open}
                    onToggle={() => setOpenId(open ? null : item.id)}
                  />
                  {open ? <RealFeedLesson item={item} /> : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={active ? "chip chip-active" : "chip"}
    >
      {children}
    </button>
  );
}
