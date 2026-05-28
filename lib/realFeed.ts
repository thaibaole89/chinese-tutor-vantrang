import type { RealFeedCategoryGroup, RealFeedItem, RealFeedSource } from "./types";
import { realFeedItems } from "@/data/realFeedItems";

/**
 * Map an item to a high-level category for filter chips. Items can either
 * carry `categoryGroup` directly (Phase 1.9+ items) or be inferred from
 * source + topic tags (legacy items).
 */
export function categoryGroupFor(item: RealFeedItem): RealFeedCategoryGroup {
  if (item.categoryGroup) return item.categoryGroup;
  const tags = item.topicTags.map((t) => t.toLowerCase());
  if (item.sourceType === "music") return "music";
  if (item.sourceType === "social") return "social";
  if (tags.some((t) => ["luxury", "watches", "fragrance", "beauty"].includes(t))) return "luxury-retail";
  if (tags.some((t) => ["airport", "duty-free", "retail", "hotel", "travel"].includes(t))) return "duty-free-airport";
  if (tags.some((t) => ["crypto", "finance", "ai", "productivity", "risk"].includes(t))) return "finance-ai-crypto";
  return "business";
}

export const CATEGORY_LABEL: Record<RealFeedCategoryGroup, string> = {
  business: "Business",
  "luxury-retail": "Luxury Retail",
  "duty-free-airport": "Duty-Free / Airport",
  "finance-ai-crypto": "Finance / AI / Crypto",
  social: "Social Chinese",
  music: "Music / Lyrics",
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
