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

/**
 * Vietnamese-friendly display labels for the raw English/internal topic
 * tag strings carried on each item (item.topicTags). Used by RealFeedCard
 * chips and the /real-feed topic filter so users never see naked English
 * tags like "travel food restaurant" / "drama period comprehension".
 *
 * Any tag not in this map falls through with its raw value (so unknown
 * tags still render, just without polish).
 */
export const TAG_LABEL: Record<string, string> = {
  // travel core
  travel: "Du lịch",
  food: "Ẩm thực",
  restaurant: "Nhà hàng",
  hotel: "Khách sạn",
  directions: "Hỏi đường",
  shopping: "Mua sắm",
  market: "Chợ đêm",
  transport: "Di chuyển",
  airport: "Sân bay",
  payment: "Thanh toán",
  photo: "Chụp ảnh",
  emergency: "Khẩn cấp",
  "emergency-only": "Chỉ khẩn cấp",
  // drama
  drama: "Phim",
  period: "Cổ trang",
  modern: "Hiện đại",
  romance: "Tình cảm",
  workplace: "Công sở",
  wuxia: "Võ hiệp",
  emotion: "Cảm xúc",
  family: "Gia đình",
  comprehension: "Nghe hiểu",
  // social
  social: "Mạng xã hội",
  xiaohongshu: "Xiaohongshu",
  douyin: "Douyin",
  weibo: "Weibo",
  slang: "Tiếng lóng",
  // news
  news: "Tin tức",
  weather: "Thời tiết",
  visa: "Visa",
  politics: "Chính trị",
  economy: "Kinh tế",
  health: "Sức khoẻ",
  environment: "Môi trường",
  // misc helpers (used in vocab/sentence tags occasionally)
  greeting: "Chào hỏi",
  pronoun: "Đại từ",
  verb: "Động từ",
  adjective: "Tính từ",
  adverb: "Trạng từ",
  conjunction: "Liên từ",
  particle: "Tiểu từ",
  time: "Thời gian",
  language: "Ngôn ngữ",
  identity: "Bản thân",
  service: "Dịch vụ",
  trust: "Tin cậy",
  title: "Xưng hô",
  polite: "Lịch sự",
  casual: "Casual",
  wechat: "WeChat",
  classical: "Văn cổ",
  music: "Nhạc",
  memory: "Trí nhớ",
  abstract: "Trừu tượng",
  logistics: "Logistics",
  culture: "Văn hoá",
  beauty: "Làm đẹp",
  AI: "AI",
  productivity: "Hiệu suất",
};

/** Look up a Vietnamese label for a topic tag; falls back to the raw tag. */
export function tagLabel(tag: string): string {
  return TAG_LABEL[tag] || tag;
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
