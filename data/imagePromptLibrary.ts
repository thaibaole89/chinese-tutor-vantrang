/**
 * Static library of illustration prompts for future hand-drawn or paid AI image
 * generation. Stored as metadata only — never rendered to the user as text.
 *
 * Rules baked into every prompt:
 *   - no text in image
 *   - no real brand logos (no WeChat, no Douyin, no Xiaohongshu, no Upbit,
 *     no Binance, no airline / hotel chain logos)
 *   - no real artist likenesses
 *   - friendly educational illustration style
 *
 * When the user is ready to commission art, run these prompts against a
 * licensed tool; save outputs to /public/illustrations/<key>.png and update
 * the matching VisualSpec.imageSrc.
 */

export interface ImagePrompt {
  key: string;
  prompt: string;
  altVi: string;
}

export const imagePromptLibrary: Record<string, ImagePrompt> = {
  "ai-office": {
    key: "ai-office",
    altVi: "Minh hoạ AI hỗ trợ công việc văn phòng",
    prompt:
      "A clean modern office scene in China with a businessperson using AI tools on a laptop, soft colors, educational app illustration style, no text, no logos",
  },
  "market-competition": {
    key: "market-competition",
    altVi: "Minh hoạ cạnh tranh khốc liệt trong công việc",
    prompt:
      "Young professionals climbing an endless spiral staircase, representing intense competition, Chinese urban office style, friendly educational illustration, no text, no logos",
  },
  "wechat-meeting": {
    key: "wechat-meeting",
    altVi: "Minh hoạ tin nhắn xác nhận lịch họp",
    prompt:
      "A generic smartphone chat interface showing business meeting scheduling, green chat bubbles, no readable text, no logos, clean flat illustration",
  },
  "crypto-risk": {
    key: "crypto-risk",
    altVi: "Minh hoạ kiểm soát rủi ro sàn giao dịch crypto",
    prompt:
      "A digital asset exchange dashboard with a shield icon, risk control charts, secure finance technology style, no logos, no text",
  },
  "retail-customer": {
    key: "retail-customer",
    altVi: "Minh hoạ hành vi khách hàng trong cửa hàng",
    prompt:
      "A modern retail store with diverse customers browsing skincare and chocolate shelves, time-of-day signage, friendly business illustration, no brand logos, no text",
  },
  "hotel-pricing": {
    key: "hotel-pricing",
    altVi: "Minh hoạ giá phòng khách sạn và công suất phòng",
    prompt:
      "Boutique hotel reception with occupancy chart and room rate calendar, friendly business illustration style, no text, no logos",
  },
  "airport-traffic": {
    key: "airport-traffic",
    altVi: "Minh hoạ lưu lượng hành khách tại sân bay",
    prompt:
      "Modern airport terminal in Asia with travelers walking past generic duty-free shops, warm lighting, clean educational illustration, no brand logos, no text",
  },
  "social-juan": {
    key: "social-juan",
    altVi: "Minh hoạ áp lực công việc và cạnh tranh khốc liệt",
    prompt:
      "An office worker at midnight desk with stacks of files and glowing laptop, representing intense workplace competition, calm illustration, no text, no logos",
  },
  "trust-supplier": {
    key: "trust-supplier",
    altVi: "Minh hoạ đánh giá độ tin cậy của nhà cung cấp",
    prompt:
      "Two professionals shaking hands with a checkmark badge floating above them, representing trust and reliability in supplier relationships, no text, no logos",
  },
  "music-homesick": {
    key: "music-homesick",
    altVi: "Minh hoạ học tiếng Trung qua âm nhạc",
    prompt:
      "A person listening to Mandarin pop music with headphones at night, city lights, calm emotional illustration, no artist likeness, no lyrics, no text",
  },
  // Domain packs
  "negotiation": {
    key: "negotiation",
    altVi: "Minh hoạ hai bên đàm phán hợp đồng kinh doanh",
    prompt:
      "Two businesspeople negotiating contract terms in a modern meeting room, clean educational illustration, no text, no logos",
  },
  "crypto-exchange": {
    key: "crypto-exchange",
    altVi: "Minh hoạ dashboard sàn giao dịch tài sản số",
    prompt:
      "Secure digital asset trading dashboard with charts and shield icon, no logos, no text",
  },
  "dutyfree-retail": {
    key: "dutyfree-retail",
    altVi: "Minh hoạ cửa hàng duty-free tại sân bay",
    prompt:
      "Modern airport retail store with travelers and shopping bags, no brand logos, no text",
  },
  "hotel-operations": {
    key: "hotel-operations",
    altVi: "Minh hoạ vận hành khách sạn boutique",
    prompt:
      "Boutique hotel front desk with occupancy calendar and room key cards, no text, no logos",
  },
  "ai-productivity": {
    key: "ai-productivity",
    altVi: "Minh hoạ chuyên gia dùng AI để tăng hiệu suất",
    prompt:
      "Professional using AI assistant on laptop to improve productivity, clean illustration, no text, no logos",
  },
};

export function getPrompt(key: string): ImagePrompt | undefined {
  return imagePromptLibrary[key];
}
