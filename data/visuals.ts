/**
 * Topic-level illustrations (public/visuals/*.webp).
 *
 * Generated once via `npm run visuals:generate` (manual, key in .env.local).
 * 768×512 webp, each well under 80 KB. No per-card images — topic level only.
 *
 * Served as plain static assets from /public (no Next image-optimization
 * API calls = cheapest + fastest). Every consumer sets explicit width/height
 * and lazy loading to avoid layout shift.
 */

export interface TopicVisual {
  src: string;
  alt: string;
}

export const topicVisuals = {
  travel: { src: "/visuals/travel-china.webp", alt: "Minh hoạ du lịch Trung Quốc" },
  hotel: { src: "/visuals/hotel-checkin.webp", alt: "Minh hoạ nhận phòng khách sạn" },
  restaurant: { src: "/visuals/restaurant-ordering.webp", alt: "Minh hoạ gọi món nhà hàng" },
  shopping: { src: "/visuals/shopping-market.webp", alt: "Minh hoạ mua sắm" },
  transport: { src: "/visuals/transport-taxi.webp", alt: "Minh hoạ đi taxi" },
  metro: { src: "/visuals/metro-station.webp", alt: "Minh hoạ hỏi đường đi tàu điện ngầm" },
  drama: { src: "/visuals/drama-watching.webp", alt: "Minh hoạ xem phim Trung Quốc" },
  social: { src: "/visuals/social-reading.webp", alt: "Minh hoạ đọc mạng xã hội Trung Quốc" },
  wechat: { src: "/visuals/wechat-chat.webp", alt: "Minh hoạ nhắn tin tiếng Trung" },
  emergency: { src: "/visuals/emergency-help.webp", alt: "Minh hoạ tình huống cần giúp đỡ" },
} as const;

export type TopicVisualKey = keyof typeof topicVisuals;

/** Card-First Home topics → a topic visual. */
export function visualForCardTopic(topic: string): TopicVisual | null {
  switch (topic) {
    case "travel":
      return topicVisuals.travel;
    case "hotel":
      return topicVisuals.hotel;
    case "restaurant":
      return topicVisuals.restaurant;
    case "shopping":
      return topicVisuals.shopping;
    case "transport":
      return topicVisuals.transport;
    case "drama":
      return topicVisuals.drama;
    case "wechat":
      return topicVisuals.wechat;
    case "emergency":
      return topicVisuals.emergency;
    default:
      return null;
  }
}

/** Domain-pack id → a header visual. */
export function visualForPack(packId: string): TopicVisual | null {
  switch (packId) {
    case "pack-travel":
      return topicVisuals.travel;
    case "pack-drama-period":
    case "pack-drama-modern":
      return topicVisuals.drama;
    case "pack-social":
      return topicVisuals.social;
    case "pack-news":
      return topicVisuals.social;
    default:
      return null;
  }
}

/** Real Feed categoryGroup → a thumbnail visual. */
export function visualForCategory(category: string | undefined): TopicVisual | null {
  switch (category) {
    case "travel":
      return topicVisuals.travel;
    case "food":
      return topicVisuals.restaurant;
    case "hotel":
      return topicVisuals.hotel;
    case "directions":
      return topicVisuals.metro;
    case "shopping":
      return topicVisuals.shopping;
    case "drama":
      return topicVisuals.drama;
    case "social":
      return topicVisuals.social;
    case "news":
      return topicVisuals.social;
    default:
      return null;
  }
}
