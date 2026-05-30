/**
 * Vân Trang lifestyle illustration registry. Single source of truth for
 * the 10 hand-curated .webp images in public/visuals/.
 *
 * Components can either:
 *   - import { VISUALS } and reference by key (preferred for static use)
 *   - look up by domain pack id / real feed category via visualForCategory()
 *
 * All paths assume the .webp files exist at /visuals/<key>.webp. Until
 * those are generated (see public/visuals/README.md for prompts), the
 * VisualCard / LearningVisual components fall back to emoji + gradient
 * automatically — these refs are safe to wire even when images are
 * missing.
 */

export type VisualKey =
  | "travel-china"
  | "hotel-checkin"
  | "restaurant-ordering"
  | "shopping-market"
  | "transport-taxi-train"
  | "airport-checkin"
  | "drama-watching"
  | "social-media-reading"
  | "book-news-reading"
  | "emergency-help";

interface VisualEntry {
  src: string;
  altVi: string;
  /** Suggested aspect for layout (cards default 16:9). */
  aspect?: "16/9" | "4/3" | "1/1";
}

export const VISUALS: Record<VisualKey, VisualEntry> = {
  "travel-china": {
    src: "/visuals/travel-china.webp",
    altVi: "Minh hoạ du lịch ở Trung Quốc",
    aspect: "16/9",
  },
  "hotel-checkin": {
    src: "/visuals/hotel-checkin.webp",
    altVi: "Minh hoạ nhận phòng khách sạn",
    aspect: "16/9",
  },
  "restaurant-ordering": {
    src: "/visuals/restaurant-ordering.webp",
    altVi: "Minh hoạ gọi món nhà hàng",
    aspect: "16/9",
  },
  "shopping-market": {
    src: "/visuals/shopping-market.webp",
    altVi: "Minh hoạ mua sắm ở chợ đêm",
    aspect: "16/9",
  },
  "transport-taxi-train": {
    src: "/visuals/transport-taxi-train.webp",
    altVi: "Minh hoạ taxi và tàu cao tốc",
    aspect: "16/9",
  },
  "airport-checkin": {
    src: "/visuals/airport-checkin.webp",
    altVi: "Minh hoạ check-in sân bay",
    aspect: "16/9",
  },
  "drama-watching": {
    src: "/visuals/drama-watching.webp",
    altVi: "Minh hoạ xem phim Trung Quốc",
    aspect: "16/9",
  },
  "social-media-reading": {
    src: "/visuals/social-media-reading.webp",
    altVi: "Minh hoạ đọc mạng xã hội Trung Quốc",
    aspect: "16/9",
  },
  "book-news-reading": {
    src: "/visuals/book-news-reading.webp",
    altVi: "Minh hoạ đọc báo và sách Trung Quốc",
    aspect: "16/9",
  },
  "emergency-help": {
    src: "/visuals/emergency-help.webp",
    altVi: "Minh hoạ hỏi giúp đỡ ở quầy thông tin",
    aspect: "16/9",
  },
};

/**
 * Map a Real Feed category group or domain pack id to the best-fit hero
 * visual. Returns null if no obvious match — caller should fall back to
 * the existing visual.imageSrc or emoji.
 */
export function visualForKey(key: string): VisualEntry | null {
  // Domain pack ids
  if (key === "pack-travel") return VISUALS["travel-china"];
  if (key === "pack-drama-period" || key === "pack-drama-modern")
    return VISUALS["drama-watching"];
  if (key === "pack-social") return VISUALS["social-media-reading"];
  if (key === "pack-news") return VISUALS["book-news-reading"];
  // Real Feed category groups
  if (key === "travel") return VISUALS["travel-china"];
  if (key === "hotel") return VISUALS["hotel-checkin"];
  if (key === "food") return VISUALS["restaurant-ordering"];
  if (key === "shopping") return VISUALS["shopping-market"];
  if (key === "directions") return VISUALS["transport-taxi-train"];
  if (key === "drama") return VISUALS["drama-watching"];
  if (key === "social") return VISUALS["social-media-reading"];
  if (key === "news") return VISUALS["book-news-reading"];
  return null;
}
