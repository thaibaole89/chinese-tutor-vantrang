import type { RealFeedCategoryGroup, RealFeedItem, RealFeedSource } from "./types";
import { realFeedItems } from "@/data/realFeedItems";

/**
 * Map an item to a high-level category for filter chips. Items should
 * carry `categoryGroup` directly; this function falls back to inferring
 * from sourceType + topic tags for any item that doesn't.
 */
export function categoryGroupFor(item: RealFeedItem): RealFeedCategoryGroup {
  if (item.categoryGroup) return item.categoryGroup;
  const tags = item.topicTags.map((t) => t.toLowerCase());
  if (item.sourceType === "music") return "music";
  if (item.sourceType === "news") return "news";
  if (item.sourceType === "drama") return "drama";
  if (item.sourceType === "social") return "social";
  if (item.sourceType === "wechat") return "social";
  // sourceType === "travel" — sub-bucket by tag
  if (tags.some((t) => ["hotel", "khách sạn", "lodging"].includes(t))) return "hotel";
  if (tags.some((t) => ["food", "restaurant", "ẩm thực"].includes(t))) return "food";
  if (tags.some((t) => ["directions", "transport", "metro", "taxi"].includes(t))) return "directions";
  if (tags.some((t) => ["shopping", "market", "mall"].includes(t))) return "shopping";
  return "travel";
}

export const CATEGORY_LABEL: Record<RealFeedCategoryGroup, string> = {
  travel: "Du lịch",
  food: "Ẩm thực",
  hotel: "Khách sạn",
  directions: "Hỏi đường",
  shopping: "Mua sắm",
  drama: "Phim cổ trang / hiện đại",
  social: "Mạng xã hội",
  news: "Tin tức",
  music: "Nhạc / Lời",
};

export function getAllRealFeedItems(): RealFeedItem[] {
  return realFeedItems;
}

export function findRealFeedItem(id: string): RealFeedItem | undefined {
  return realFeedItems.find((i) => i.id === id);
}

export function listAllTopicTags(): string[] {
  const set = new Set<string>();
  for (const item of realFeedItems) {
    for (const t of item.topicTags) set.add(t);
  }
  return Array.from(set).sort();
}

export function listAllSourceTypes(): RealFeedSource[] {
  const set = new Set<RealFeedSource>();
  for (const item of realFeedItems) set.add(item.sourceType);
  return Array.from(set);
}

export function filterRealFeed(
  items: RealFeedItem[],
  opts: {
    source?: RealFeedSource | "all";
    tag?: string | "all";
    category?: RealFeedCategoryGroup | "all";
  } = {},
): RealFeedItem[] {
  return items.filter((it) => {
    if (opts.source && opts.source !== "all" && it.sourceType !== opts.source) return false;
    if (opts.tag && opts.tag !== "all" && !it.topicTags.includes(opts.tag)) return false;
    if (opts.category && opts.category !== "all" && categoryGroupFor(it) !== opts.category)
      return false;
    return true;
  });
}

/** Pick today's Real Feed item deterministically by date — same day → same item. */
export function todaysRealFeedItem(date = new Date()): RealFeedItem {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return realFeedItems[dayOfYear % realFeedItems.length];
}
