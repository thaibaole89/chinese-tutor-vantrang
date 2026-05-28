import type { FlashcardState } from "@/lib/types";

/**
 * Lifestyle / luxury vocabulary pack — built explicitly for image-first
 * flashcards. Brand names (Rolex, Nike) appear ONLY as Chinese text
 * vocabulary, never with logos or photos in the source. If you have an
 * authorized local image, set `visualHint.imageSrc` on the matching card
 * — until then we fall back to emoji + a generic illustration scene.
 *
 * Privacy / copyright: NO scraping, NO hotlinking, NO real product photos.
 */

interface LifestyleSeed {
  id: string;
  hanzi: string;
  pinyin: string;
  vi: string;
  exampleZh: string;
  exampleVi: string;
  tags: string[];
  emoji: string;
  /** Optional generic scene type from LearningIllustration. */
  sceneType?: FlashcardState["visualHint"] extends infer T ? any : never;
  memoryHookVi?: string;
}

const SEED: LifestyleSeed[] = [
  // Watches
  { id: "lf-watch-1", hanzi: "手表", pinyin: "shǒubiǎo", vi: "đồng hồ đeo tay", exampleZh: "我喜欢看新款手表。", exampleVi: "Tôi thích xem model đồng hồ mới.", tags: ["watches"], emoji: "⌚", memoryHookVi: "Mặt đồng hồ kim loại sáng trên cổ tay." },
  { id: "lf-watch-2", hanzi: "豪华手表", pinyin: "háohuá shǒubiǎo", vi: "đồng hồ cao cấp", exampleZh: "豪华手表是身份的象征。", exampleVi: "Đồng hồ cao cấp là biểu tượng thân phận.", tags: ["watches", "luxury"], emoji: "💎", memoryHookVi: "Hộp gỗ velvet đỏ + bộ giấy chứng nhận." },
  { id: "lf-watch-3", hanzi: "经典款", pinyin: "jīngdiǎn kuǎn", vi: "model classic / heritage", exampleZh: "经典款不容易过时。", exampleVi: "Model classic không lỗi mốt.", tags: ["watches", "luxury"], emoji: "🏆", memoryHookVi: "Thiết kế 1960s vẫn được sản xuất tới giờ." },
  { id: "lf-watch-4", hanzi: "限量版", pinyin: "xiànliàng bǎn", vi: "phiên bản giới hạn", exampleZh: "全球限量 500 块。", exampleVi: "Giới hạn 500 chiếc toàn cầu.", tags: ["watches", "luxury"], emoji: "🔢", memoryHookVi: "Số seri khắc bằng tay trên nắp lưng." },
  { id: "lf-watch-5", hanzi: "瑞士制造", pinyin: "Ruìshì zhìzào", vi: "Swiss-made", exampleZh: "瑞士制造的机芯。", exampleVi: "Bộ máy Swiss-made.", tags: ["watches"], emoji: "🇨🇭" },
  { id: "lf-watch-6", hanzi: "劳力士", pinyin: "Láolìshì", vi: "Rolex (tên thương hiệu)", exampleZh: "劳力士的手表保值率高。", exampleVi: "Đồng hồ Rolex giữ giá tốt.", tags: ["watches", "brand"], emoji: "⌚", memoryHookVi: "Brand-name vocab only — không dùng logo, không bundle photo." },

  // Cars
  { id: "lf-car-1", hanzi: "汽车", pinyin: "qìchē", vi: "ô tô", exampleZh: "他买了一辆新汽车。", exampleVi: "Anh ấy mua xe ô tô mới.", tags: ["cars"], emoji: "🚗", memoryHookVi: "Xe sedan màu xám trên đường cao tốc." },
  { id: "lf-car-2", hanzi: "跑车", pinyin: "pǎochē", vi: "sports car", exampleZh: "跑车的引擎声很特别。", exampleVi: "Tiếng động cơ sports car rất đặc biệt.", tags: ["cars", "luxury"], emoji: "🏎️", memoryHookVi: "Đường đèo + xe coupe đỏ thấp gầm." },
  { id: "lf-car-3", hanzi: "电动车", pinyin: "diàndòng chē", vi: "xe điện (EV)", exampleZh: "电动车越来越普及。", exampleVi: "EV ngày càng phổ biến.", tags: ["cars", "tech"], emoji: "🔌" },
  { id: "lf-car-4", hanzi: "新能源汽车", pinyin: "xīn néngyuán qìchē", vi: "xe năng lượng mới (NEV)", exampleZh: "新能源汽车销量上升。", exampleVi: "Doanh số NEV tăng.", tags: ["cars", "tech"], emoji: "🌱" },

  // Sneakers
  { id: "lf-sneak-1", hanzi: "运动鞋", pinyin: "yùndòng xié", vi: "giày thể thao / sneakers", exampleZh: "今年流行白色运动鞋。", exampleVi: "Năm nay sneakers trắng đang thịnh.", tags: ["sneakers"], emoji: "👟", memoryHookVi: "Đôi giày trắng đặt trên sàn gỗ studio." },
  { id: "lf-sneak-2", hanzi: "跑鞋", pinyin: "pǎo xié", vi: "running shoes", exampleZh: "跑鞋的缓震很重要。", exampleVi: "Cushioning của giày chạy rất quan trọng.", tags: ["sneakers", "sports"], emoji: "🏃" },
  { id: "lf-sneak-3", hanzi: "联名款", pinyin: "liánmíng kuǎn", vi: "model collab", exampleZh: "联名款很快就卖光。", exampleVi: "Model collab bán hết rất nhanh.", tags: ["sneakers", "luxury"], emoji: "🤝" },
  { id: "lf-sneak-4", hanzi: "耐克", pinyin: "Nàikè", vi: "Nike (tên thương hiệu)", exampleZh: "他穿耐克的新款。", exampleVi: "Anh ấy đi model mới của Nike.", tags: ["sneakers", "brand"], emoji: "👟", memoryHookVi: "Brand-name vocab only — no logo, no bundled photo." },

  // Fragrance
  { id: "lf-frag-1", hanzi: "香水", pinyin: "xiāngshuǐ", vi: "nước hoa", exampleZh: "你喷的是什么香水？", exampleVi: "Em xịt nước hoa gì vậy?", tags: ["fragrance"], emoji: "🌸", memoryHookVi: "Lọ thuỷ tinh trong, tia ánh sáng vàng buổi sáng." },
  { id: "lf-frag-2", hanzi: "前调", pinyin: "qián diào", vi: "top note", exampleZh: "前调是柑橘味。", exampleVi: "Top note có mùi cam quýt.", tags: ["fragrance"], emoji: "🍊" },
  { id: "lf-frag-3", hanzi: "后调", pinyin: "hòu diào", vi: "base note", exampleZh: "后调是木质香。", exampleVi: "Base note có mùi gỗ.", tags: ["fragrance"], emoji: "🪵" },
  { id: "lf-frag-4", hanzi: "试香", pinyin: "shì xiāng", vi: "thử nước hoa", exampleZh: "可以试香吗？", exampleVi: "Em thử nước hoa được không?", tags: ["fragrance"], emoji: "🧴" },

  // Airport / hotel objects
  { id: "lf-air-1", hanzi: "免税店", pinyin: "miǎnshuìdiàn", vi: "duty-free shop", exampleZh: "免税店里很热闹。", exampleVi: "Duty-free đông khách.", tags: ["airport", "retail"], emoji: "🛍️" },
  { id: "lf-air-2", hanzi: "机场", pinyin: "jīchǎng", vi: "sân bay", exampleZh: "机场离市区不远。", exampleVi: "Sân bay không xa trung tâm.", tags: ["airport"], emoji: "✈️" },
  { id: "lf-air-3", hanzi: "登机牌", pinyin: "dēngjīpái", vi: "boarding pass", exampleZh: "请出示登机牌。", exampleVi: "Vui lòng xuất trình boarding pass.", tags: ["airport"], emoji: "🎫" },
  { id: "lf-air-4", hanzi: "贵宾室", pinyin: "guìbīn shì", vi: "VIP lounge", exampleZh: "贵宾室有早餐。", exampleVi: "VIP lounge có bữa sáng.", tags: ["airport", "vip"], emoji: "🛋️" },

  // Hotel
  { id: "lf-hot-1", hanzi: "酒店", pinyin: "jiǔdiàn", vi: "khách sạn", exampleZh: "这家酒店服务很好。", exampleVi: "Khách sạn này service tốt.", tags: ["hotel"], emoji: "🏨" },
  { id: "lf-hot-2", hanzi: "房卡", pinyin: "fáng kǎ", vi: "thẻ phòng (key card)", exampleZh: "请保管好房卡。", exampleVi: "Vui lòng giữ thẻ phòng.", tags: ["hotel"], emoji: "🔑" },
  { id: "lf-hot-3", hanzi: "套房", pinyin: "tàofáng", vi: "suite", exampleZh: "升级到豪华套房。", exampleVi: "Nâng cấp lên deluxe suite.", tags: ["hotel", "luxury"], emoji: "🛏️" },
  { id: "lf-hot-4", hanzi: "客房服务", pinyin: "kèfáng fúwù", vi: "room service", exampleZh: "我点一份客房服务。", exampleVi: "Em order room service.", tags: ["hotel"], emoji: "🛎️" },
];

export function buildLifestyleFlashcards(): FlashcardState[] {
  return SEED.map((s) => ({
    id: s.id,
    hanzi: s.hanzi,
    pinyin: s.pinyin,
    vietnameseMeaning: s.vi,
    synonyms: [],
    exampleZh: s.exampleZh,
    exampleVi: s.exampleVi,
    tags: [...s.tags, "lifestyle"],
    frequencyLevel: "medium" as const,
    reviewStatus: "new" as const,
    updatedAt: new Date(0).toISOString(),
    visualHint: {
      emoji: s.emoji,
      altVi: `Biểu tượng cho ${s.hanzi}`,
      memoryHookVi: s.memoryHookVi,
      mode: "emoji" as const,
    },
  }));
}
