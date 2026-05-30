import type { SceneType, VisualLearningPurpose } from "@/lib/types";

/**
 * Local illustration registry.
 *
 * Local-first: no external image URLs. If `imageSrc` is filled, the
 * VisualCard/LearningVisual will render that PNG/SVG from /public.
 * If not (the current state), the system falls back to LearningIllustration
 * which composes a hand-crafted CSS+SVG scene by `sceneType` —
 * polished, not just emoji.
 *
 * To upgrade to real art later, generate one image per entry, drop it
 * at the documented path, and set `imageSrc`. No other code changes.
 */

export interface LocalIllustration {
  id: string;
  sceneType: SceneType;
  imageSrc?: string; // /public/illustrations/<folder>/<file>.png — when ready
  altVi: string;
  captionVi?: string;
  fallbackEmoji: string;
  illustrationPrompt: string;
  learningPurpose: VisualLearningPurpose;
}

// ---------------- Real Feed (10 items) ----------------

export const REAL_FEED_ILLUSTRATIONS: Record<string, LocalIllustration> = {
  "rf-1": {
    id: "rf-1",
    sceneType: "ai_office",
    imageSrc: "/illustrations/real-feed/ai-office.png",
    altVi: "Minh hoạ AI hỗ trợ công việc văn phòng",
    captionVi: "AI trong môi trường công việc hiện đại",
    fallbackEmoji: "🤖",
    illustrationPrompt:
      "A clean modern office scene with a businessperson using AI tools on a laptop, soft colors, educational app illustration style, no text, no logos",
    learningPurpose: "context",
  },
  "rf-2": {
    id: "rf-2",
    sceneType: "market_competition",
    imageSrc: "/illustrations/real-feed/market-competition.png",
    altVi: "Minh hoạ cạnh tranh khốc liệt trong công việc",
    captionVi: "Cạnh tranh thị trường: ai có đặc sắc sẽ trụ được",
    fallbackEmoji: "🌀",
    illustrationPrompt:
      "Young professionals climbing an endless spiral staircase, representing intense competition, friendly educational illustration, no text, no logos",
    learningPurpose: "context",
  },
  "rf-3": {
    id: "rf-3",
    sceneType: "wechat_meeting",
    imageSrc: "/illustrations/real-feed/wechat-meeting.png",
    altVi: "Minh hoạ đoạn chat công việc xác nhận lịch họp",
    captionVi: "Đoạn chat business — không phải logo WeChat thật",
    fallbackEmoji: "💬",
    illustrationPrompt:
      "A generic smartphone chat interface showing business meeting scheduling, green chat bubbles, no readable text, no logos",
    learningPurpose: "dialogue",
  },
  "rf-4": {
    id: "rf-4",
    sceneType: "crypto_risk",
    imageSrc: "/illustrations/real-feed/crypto-risk.png",
    altVi: "Minh hoạ kiểm soát rủi ro sàn giao dịch crypto",
    captionVi: "Risk control: shield bảo vệ user và uy tín nền tảng",
    fallbackEmoji: "🛡️",
    illustrationPrompt:
      "A digital asset exchange dashboard with a shield icon, risk control charts, secure finance technology style, no logos, no text",
    learningPurpose: "context",
  },
  "rf-5": {
    id: "rf-5",
    sceneType: "dutyfree_customer",
    imageSrc: "/illustrations/real-feed/dutyfree-customer.png",
    altVi: "Minh hoạ hành vi khách trong cửa hàng retail",
    captionVi: "Khách 15-17h đông nhất, mua skincare và rượu",
    fallbackEmoji: "🛍️",
    illustrationPrompt:
      "A modern retail store with diverse customers browsing skincare and chocolate shelves, time-of-day signage, no brand logos, no text",
    learningPurpose: "context",
  },
  "rf-6": {
    id: "rf-6",
    sceneType: "hotel_pricing",
    imageSrc: "/illustrations/real-feed/hotel-pricing.png",
    altVi: "Minh hoạ giá phòng khách sạn và công suất phòng",
    captionVi: "Occupancy 92% cuối tuần → giá nên đẩy lên vừa phải",
    fallbackEmoji: "🏨",
    illustrationPrompt:
      "Boutique hotel reception with occupancy chart and room rate calendar, no text, no logos",
    learningPurpose: "context",
  },
  "rf-7": {
    id: "rf-7",
    sceneType: "airport_traffic",
    imageSrc: "/illustrations/real-feed/airport-traffic.png",
    altVi: "Minh hoạ lưu lượng hành khách tại sân bay",
    captionVi: "Khách Trung sang Đông Nam Á đông hơn cùng kỳ",
    fallbackEmoji: "✈️",
    illustrationPrompt:
      "Modern airport terminal with travelers walking past generic duty-free shops, no brand logos, no text",
    learningPurpose: "context",
  },
  "rf-8": {
    id: "rf-8",
    sceneType: "slang_register",
    imageSrc: "/illustrations/real-feed/slang-register.png",
    altVi: "So sánh casual 太卷了 vs lịch sự 竞争非常激烈",
    captionVi: "Cùng một ý — chọn từ theo đối tượng đang nghe",
    fallbackEmoji: "🌀",
    illustrationPrompt:
      "Two-panel comparison: casual chat vs business meeting room, no text, no logos",
    learningPurpose: "register",
  },
  "rf-9": {
    id: "rf-9",
    sceneType: "trust_reliability",
    imageSrc: "/illustrations/real-feed/trust-reliability.png",
    altVi: "So sánh hai supplier: đáng tin (tick) vs không đáng tin (X)",
    captionVi: "靠谱 (tick xanh) vs 不靠谱 (X đỏ)",
    fallbackEmoji: "👍",
    illustrationPrompt:
      "Two delivery boxes side by side — one with green checkmark on time, one with red X delayed, no text, no logos",
    learningPurpose: "register",
  },
  "rf-10": {
    id: "rf-10",
    sceneType: "music_rhythm",
    imageSrc: "/illustrations/real-feed/music-rhythm.png",
    altVi: "Minh hoạ luyện nhịp điệu tiếng Trung qua tiểu khúc nhớ quê",
    captionVi: "Văn vẻ / ballad — không dùng cho email business",
    fallbackEmoji: "🎵",
    illustrationPrompt:
      "A person listening to Mandarin pop music with headphones at night, city lights, calm emotional illustration, no artist likeness, no lyrics, no text",
    learningPurpose: "memory",
  },
};

// ---------------- Domain Packs (5) ----------------

export const DOMAIN_PACK_ILLUSTRATIONS: Record<string, LocalIllustration> = {
  "pack-negotiation": {
    id: "pack-negotiation",
    sceneType: "business_negotiation",
    imageSrc: "/illustrations/domain-packs/business-negotiation.png",
    altVi: "Minh hoạ hai bên đàm phán hợp đồng kinh doanh",
    captionVi: "Đàm phán: từ mở đầu lịch sự tới chốt deal",
    fallbackEmoji: "🤝",
    illustrationPrompt:
      "Two businesspeople negotiating contract terms in a modern meeting room, no text, no logos",
    learningPurpose: "context",
  },
  "pack-crypto": {
    id: "pack-crypto",
    sceneType: "crypto_exchange",
    imageSrc: "/illustrations/domain-packs/crypto-exchange.png",
    altVi: "Minh hoạ dashboard sàn giao dịch tài sản số",
    captionVi: "Vận hành sàn: liquidity, risk control, listing",
    fallbackEmoji: "💹",
    illustrationPrompt:
      "Secure digital asset trading dashboard with charts and shield icon, no logos, no text",
    learningPurpose: "context",
  },
  "pack-dutyfree": {
    id: "pack-dutyfree",
    sceneType: "airport_retail",
    imageSrc: "/illustrations/domain-packs/airport-retail.png",
    altVi: "Minh hoạ cửa hàng duty-free tại sân bay",
    captionVi: "Duty-free sân bay: tư vấn khách Trung",
    fallbackEmoji: "🛍️",
    illustrationPrompt:
      "Modern airport retail store with travelers and shopping bags, no brand logos, no text",
    learningPurpose: "context",
  },
  "pack-hotel": {
    id: "pack-hotel",
    sceneType: "hotel_operations",
    imageSrc: "/illustrations/domain-packs/hotel-operations.png",
    altVi: "Minh hoạ vận hành khách sạn boutique",
    captionVi: "Lễ tân, housekeeping, complaint handling",
    fallbackEmoji: "🏨",
    illustrationPrompt:
      "Boutique hotel front desk with bell, key cards, occupancy chart, no text, no logos",
    learningPurpose: "context",
  },
  "pack-ai": {
    id: "pack-ai",
    sceneType: "ai_productivity",
    imageSrc: "/illustrations/domain-packs/ai-productivity.png",
    altVi: "Minh hoạ chuyên gia dùng AI để tăng hiệu suất",
    captionVi: "AI cho năng suất: prompt, agent, automation",
    fallbackEmoji: "🤖",
    illustrationPrompt:
      "Professional using AI assistant on laptop with brain icon and speed lines, no text, no logos",
    learningPurpose: "context",
  },
};

// ---------------- Flashcards — pure prompt list ----------------

export const FLASHCARD_ILLUSTRATION_PROMPTS: Array<{
  hanzi: string;
  imagePath: string;
  prompt: string;
}> = [
  { hanzi: "报价", imagePath: "/illustrations/flashcards/baojia.png", prompt: "A quotation document on a business negotiation table with price highlights, no text, no logos" },
  { hanzi: "风险", imagePath: "/illustrations/flashcards/fengxian.png", prompt: "A risk dashboard with warning icon and protective shield, no readable text, no logos" },
  { hanzi: "入住率", imagePath: "/illustrations/flashcards/ruzhulv.png", prompt: "A hotel occupancy board and room calendar, no readable text, no logos" },
  { hanzi: "旅客流量", imagePath: "/illustrations/flashcards/lvkeliuliang.png", prompt: "Passenger flow through an airport terminal, no text, no logos" },
  { hanzi: "合作", imagePath: "/illustrations/flashcards/hezuo.png", prompt: "Two hands shaking over a contract document, no text, no logos" },
];

export function realFeedIllustrationFor(id: string): LocalIllustration | undefined {
  return REAL_FEED_ILLUSTRATIONS[id];
}

export function domainPackIllustrationFor(id: string): LocalIllustration | undefined {
  return DOMAIN_PACK_ILLUSTRATIONS[id];
}
