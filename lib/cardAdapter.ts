/**
 * Card adapter — derives a unified `Card[]` from existing cleaned data
 * (domain packs + Week 1 lessons) without duplicating content.
 *
 * Used by the Card-First Home (app/page.tsx). Each card is one Chinese
 * phrase or vocab item the learner can flip, hear, save, and skip.
 *
 * No business / corporate / finance / crypto / AI content reaches the
 * card list — drama-period (cung đình văn ngôn) is also filtered out
 * because period-drama vocabulary isn't practical "say-this-now" phrasing.
 */
import { domainPacks } from "@/data/domainPacks";
import { week1Lessons } from "@/data/week1Lessons";
import type { VocabularyItem, SentencePattern } from "@/lib/types";

/** Filter-pill topics shown on the home screen. */
export type CardTopic =
  | "travel"
  | "hotel"
  | "restaurant"
  | "shopping"
  | "transport"
  | "drama"
  | "wechat"
  | "emergency";

export interface Card {
  id: string;
  topic: CardTopic;
  topicLabel: string;
  type: "phrase" | "vocab";
  difficulty: "beginner" | "easy" | "medium";
  chinese: string;
  pinyin: string;
  vietnamese: string;
  context?: string;
  exampleChinese?: string;
  examplePinyin?: string;
  exampleVietnamese?: string;
}

// ---------------- Topic mapping ----------------

const TOPIC_LABEL: Record<CardTopic, string> = {
  travel: "Du lịch",
  hotel: "Khách sạn",
  restaurant: "Ăn uống",
  shopping: "Mua sắm",
  transport: "Di chuyển",
  drama: "Phim Trung",
  wechat: "WeChat",
  emergency: "Khẩn cấp",
};

const TOPIC_EMOJI: Record<CardTopic, string> = {
  travel: "✈️",
  hotel: "🏨",
  restaurant: "🍜",
  shopping: "🛍️",
  transport: "🚕",
  drama: "🍿",
  wechat: "💬",
  emergency: "🆘",
};

export const TOPIC_FILTERS: Array<{ value: CardTopic | "all"; label: string; emoji: string }> = [
  { value: "all", label: "Tất cả", emoji: "✨" },
  { value: "travel", label: TOPIC_LABEL.travel, emoji: TOPIC_EMOJI.travel },
  { value: "hotel", label: TOPIC_LABEL.hotel, emoji: TOPIC_EMOJI.hotel },
  { value: "restaurant", label: TOPIC_LABEL.restaurant, emoji: TOPIC_EMOJI.restaurant },
  { value: "shopping", label: TOPIC_LABEL.shopping, emoji: TOPIC_EMOJI.shopping },
  { value: "transport", label: TOPIC_LABEL.transport, emoji: TOPIC_EMOJI.transport },
  { value: "drama", label: TOPIC_LABEL.drama, emoji: TOPIC_EMOJI.drama },
  { value: "wechat", label: TOPIC_LABEL.wechat, emoji: TOPIC_EMOJI.wechat },
  { value: "emergency", label: TOPIC_LABEL.emergency, emoji: TOPIC_EMOJI.emergency },
];

/**
 * Map an individual vocab/pattern item to a card topic based on its
 * tags + its source pack id. Returns null when the item shouldn't appear
 * in the home card flow (period-drama vocab, news, abstract grammar).
 */
function topicFromTags(
  tags: string[],
  packId?: string,
): CardTopic | null {
  const t = new Set(tags.map((x) => x.toLowerCase()));

  // Emergency first — safety phrases shouldn't get re-bucketed.
  if (t.has("emergency") || t.has("emergency-only")) return "emergency";

  // Direct tag matches.
  if (t.has("hotel")) return "hotel";
  if (t.has("food") || t.has("restaurant")) return "restaurant";
  if (t.has("shopping") || t.has("market")) return "shopping";
  if (t.has("transport") || t.has("directions")) return "transport";
  if (t.has("drama") || t.has("emotion") || t.has("romance")) return "drama";
  if (t.has("social") || t.has("xiaohongshu") || t.has("douyin") || t.has("weibo") || t.has("wechat")) {
    return "wechat";
  }

  // Pack-level fallback when tags are too generic (pronoun/verb/time/etc).
  if (packId === "pack-travel") return "travel";
  if (packId === "pack-drama-modern") return "drama";
  if (packId === "pack-drama-period") return null; // skip — văn ngôn, not say-now
  if (packId === "pack-social") return "wechat";
  if (packId === "pack-news") return null; // skip — news reading, not card-sized
  if (packId === "week1") {
    // Week 1 lessons cover travel-broad topics — bucket by lesson day.
    return "travel";
  }
  return null;
}

// ---------------- Builders ----------------

function vocabToCard(
  v: VocabularyItem,
  packId: string,
  packDifficulty: Card["difficulty"] = "easy",
): Card | null {
  const topic = topicFromTags(v.tags, packId);
  if (!topic) return null;
  return {
    id: `card-${packId}-${v.id}`,
    topic,
    topicLabel: TOPIC_LABEL[topic],
    type: "vocab",
    difficulty: packDifficulty,
    chinese: v.hanzi,
    pinyin: v.pinyin,
    vietnamese: v.vietnameseMeaning,
    context: undefined,
    exampleChinese: v.exampleZh || undefined,
    examplePinyin: undefined, // VocabularyItem doesn't carry example pinyin
    exampleVietnamese: v.exampleVi || undefined,
  };
}

function patternToCard(
  p: SentencePattern,
  packId: string,
  packDifficulty: Card["difficulty"] = "easy",
): Card | null {
  // Patterns inherit topic from their pack since they lack tags.
  const topic = topicFromTags([], packId);
  if (!topic) return null;
  // Skip patterns whose Chinese still has "..." placeholders — they
  // teach a structure, not a say-now phrase. Card UX wants complete lines.
  if (p.zh.includes("...") || p.zh.includes("…")) return null;
  return {
    id: `card-${packId}-${p.id}`,
    topic,
    topicLabel: TOPIC_LABEL[topic],
    type: "phrase",
    difficulty: packDifficulty,
    chinese: p.zh,
    pinyin: p.pinyin,
    vietnamese: p.vi,
    context: p.usageNoteVi,
  };
}

// ---------------- Public API ----------------

let cachedCards: Card[] | null = null;

/**
 * Returns the full card deck derived from existing cleaned data.
 * Cached — same array on every call so React reference equality holds.
 */
export function getAllCards(): Card[] {
  if (cachedCards) return cachedCards;

  const cards: Card[] = [];
  const seen = new Set<string>();
  const push = (c: Card | null) => {
    if (!c) return;
    // de-dupe by Chinese string so a phrase that exists in both a lesson
    // and a domain pack only shows once.
    const key = c.chinese;
    if (seen.has(key)) return;
    seen.add(key);
    cards.push(c);
  };

  // 1) Domain packs → vocab + patterns
  for (const pack of domainPacks) {
    const diff: Card["difficulty"] = pack.id === "pack-news" ? "medium" : "easy";
    for (const v of pack.vocabulary) push(vocabToCard(v, pack.id, diff));
    for (const p of pack.sentencePatterns) push(patternToCard(p, pack.id, diff));
  }

  // 2) Week 1 lessons → vocab only (patterns are mostly travel-broad already covered)
  for (const lesson of week1Lessons) {
    for (const v of lesson.vocabulary) {
      // Lessons don't have a packId — fall back to "week1" + use tag-based topic.
      // Use original vocabToCard with packId="week1" so pack-level fallback works.
      push(vocabToCard(v, "week1", "beginner"));
    }
  }

  cachedCards = cards;
  return cards;
}

/** Filter helper for the home screen filter pills. */
export function filterCards(
  all: Card[],
  topic: CardTopic | "all",
): Card[] {
  if (topic === "all") return all;
  return all.filter((c) => c.topic === topic);
}

/** Count cards per topic — used to hide empty filter pills. */
export function cardCountsByTopic(all: Card[]): Record<CardTopic | "all", number> {
  const counts: Record<string, number> = { all: all.length };
  for (const t of Object.keys(TOPIC_LABEL) as CardTopic[]) counts[t] = 0;
  for (const c of all) counts[c.topic] = (counts[c.topic] || 0) + 1;
  return counts as Record<CardTopic | "all", number>;
}
