import type { RealFeedItem } from "@/lib/types";

/**
 * Vân Trang lifestyle Real Feed — 12 short original items spanning
 * travel scenarios, drama clips (period + modern), social media
 * captions (Xiaohongshu / Douyin / Weibo), and news headlines.
 *
 * No copyrighted lyrics, no real artist likeness, no real brand logos.
 * All drama / music samples are original lines written for this app.
 * `businessSafeVersion` is kept as a placeholder note since the content
 * is lifestyle-first — there's rarely a "business" equivalent for a
 * drama quote or a slang caption. We use the field to record a brief
 * "when this DOES become business" note where applicable.
 */

export const realFeedItems: RealFeedItem[] = [
  // ============================================================
  // 1. TRAVEL — gọi món ở quán Tứ Xuyên
  // ============================================================
  {
    id: "rf-1",
    titleZh: "在四川餐厅点菜",
    titleVi: "Gọi món ở quán Tứ Xuyên",
    sourceType: "travel",
    difficulty: "easy",
    topicTags: ["travel", "food", "restaurant"],
    categoryGroup: "food",
    visual: {
      type: "learning_scene",
      sceneType: "dutyfree_customer",
      emoji: "🌶️",
      gradient: "travel-food",
      altVi: "Quán Tứ Xuyên — nồi lẩu cay + bàn ăn",
      captionVi: "Câu cần khi không quen vị cay",
    },
    originalZh:
      "服务员，麻烦推荐一道不太辣的菜。我们有两个不能吃辣，再来一份米饭和一碗汤。",
    pinyin:
      "Fúwùyuán, máfan tuījiàn yī dào bù tài là de cài. Wǒmen yǒu liǎng ge bù néng chī là, zài lái yī fèn mǐfàn hé yī wǎn tāng.",
    translationVi:
      "Bạn ơi, phiền gợi ý 1 món không cay lắm. Chúng tôi có 2 người không ăn được cay, thêm 1 phần cơm và 1 bát canh nhé.",
    spokenVersion: {
      zh: "推荐个不辣的菜吧，再来份饭加碗汤。",
      pinyin: "Tuījiàn ge bù là de cài ba, zài lái fèn fàn jiā wǎn tāng.",
      vi: "Gợi ý 1 món không cay, thêm 1 phần cơm + bát canh.",
    },
    businessSafeVersion: {
      zh: "服务员，麻烦帮我们推荐一道不太辣的菜，再来一份米饭和一碗汤，谢谢。",
      pinyin: "Fúwùyuán, máfan bāng wǒmen tuījiàn yī dào bù tài là de cài, zài lái yī fèn mǐfàn hé yī wǎn tāng, xièxie.",
      vi: "Bạn ơi, phiền gợi ý 1 món không cay lắm, thêm 1 phần cơm và 1 bát canh nhé, cảm ơn.",
    },
    usageNotesVi:
      "Mở đầu 麻烦 + 推荐 là combo lịch sự với người lạ. Phù hợp mọi quán có phục vụ.",
    whenToUseVi: "Lần đầu vào 1 quán Tứ Xuyên / Hồ Nam / lẩu cay không quen vị.",
    whenNotToUseVi: "Quán đồ Tây / Nhật / Hàn không có 辣 nên không cần câu này.",
    keyVocabulary: [
      { id: "rf1-v1", hanzi: "服务员", pinyin: "fúwùyuán", vietnameseMeaning: "nhân viên phục vụ", synonyms: [], exampleZh: "服务员，买单！", exampleVi: "Bạn ơi, tính tiền!", tags: ["travel"], frequencyLevel: "high" },
      { id: "rf1-v2", hanzi: "推荐", pinyin: "tuījiàn", vietnameseMeaning: "gợi ý, đề xuất", synonyms: [], exampleZh: "推荐一道菜。", exampleVi: "Gợi ý 1 món.", tags: ["travel"], frequencyLevel: "high" },
      { id: "rf1-v3", hanzi: "不太辣", pinyin: "bù tài là", vietnameseMeaning: "không cay lắm", synonyms: [], exampleZh: "我要不太辣的。", exampleVi: "Tôi cần loại không cay lắm.", tags: ["travel"], frequencyLevel: "high" },
      { id: "rf1-v4", hanzi: "米饭", pinyin: "mǐfàn", vietnameseMeaning: "cơm", synonyms: [], exampleZh: "来一份米饭。", exampleVi: "Cho 1 phần cơm.", tags: ["food"], frequencyLevel: "high" },
      { id: "rf1-v5", hanzi: "汤", pinyin: "tāng", vietnameseMeaning: "canh, súp", synonyms: [], exampleZh: "一碗汤。", exampleVi: "1 bát canh.", tags: ["food"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "rf1-s1", zh: "麻烦推荐一道 ... 的菜。", pinyin: "Máfan tuījiàn yī dào ... de cài.", vi: "Phiền gợi ý 1 món ... .", register: "wechat" },
      { id: "rf1-s2", zh: "再来一份 ... 和一碗 ...", pinyin: "Zài lái yī fèn ... hé yī wǎn ...", vi: "Thêm 1 phần ... và 1 bát ...", register: "casual" },
    ],
    registerNotesVi: "Lịch sự với phục vụ. 麻烦 = please.",
    discussionPrompts: ["Món Trung nào bạn KHÔNG ăn được? Vì sao?"],
    speakingPrompts: ["Đặt thử 1 set 3 món + 1 canh cho 2 người."],
    roleplayScenario: {
      id: "rf1-rp",
      titleVi: "Gọi món, không ăn cay",
      titleZh: "点菜，不要太辣",
      contextVi: "Trao đổi 4-5 lượt với phục vụ, chốt 3 món.",
      aiRole: "Phục vụ quán Tứ Xuyên",
      userRole: "Vân Trang — khách",
      targetPhrases: ["麻烦", "推荐", "不太辣", "再来"],
      difficulty: "easy",
    },
  },

  // ============================================================
  // 2. TRAVEL — nhận phòng khách sạn
  // ============================================================
  {
    id: "rf-2",
    titleZh: "酒店入住",
    titleVi: "Nhận phòng khách sạn",
    sourceType: "travel",
    difficulty: "easy",
    topicTags: ["travel", "hotel"],
    categoryGroup: "hotel",
    visual: {
      type: "learning_scene",
      sceneType: "hotel_pricing",
      emoji: "🏨",
      gradient: "travel-hotel",
      altVi: "Quầy lễ tân khách sạn",
      captionVi: "Câu cơ bản check-in + hỏi tiện ích",
    },
    originalZh:
      "您好，我有预订，订单号是 8 8 2 1。请问 Wi-Fi 密码是多少？早餐几点开始？",
    pinyin:
      "Nín hǎo, wǒ yǒu yùdìng, dìngdān hào shì 8 8 2 1. Qǐngwèn Wi-Fi mìmǎ shì duōshǎo? Zǎocān jǐ diǎn kāishǐ?",
    translationVi:
      "Xin chào, tôi có đặt phòng, mã đặt là 8821. Cho hỏi mật khẩu Wi-Fi là gì? Mấy giờ bắt đầu phục vụ ăn sáng?",
    spokenVersion: {
      zh: "你好，订单号 8821，Wi-Fi 密码？早餐几点？",
      pinyin: "Nǐ hǎo, dìngdān hào 8821, Wi-Fi mìmǎ? Zǎocān jǐ diǎn?",
      vi: "Chào, mã 8821, Wi-Fi pass? Sáng mấy giờ?",
    },
    businessSafeVersion: {
      zh: "您好，我有预订，订单号是 8821。麻烦帮我办理入住，再请问 Wi-Fi 密码和早餐时间。",
      pinyin: "Nín hǎo, wǒ yǒu yùdìng, dìngdān hào shì 8821. Máfan bāng wǒ bànlǐ rùzhù, zài qǐngwèn Wi-Fi mìmǎ hé zǎocān shíjiān.",
      vi: "Chào anh/chị, tôi có đặt phòng, mã đặt là 8821. Phiền làm thủ tục nhận phòng giúp tôi, và cho hỏi mật khẩu Wi-Fi cùng giờ ăn sáng.",
    },
    usageNotesVi:
      "您 = lịch sự với lễ tân. Khách quen có thể dùng 你. Mã đặt nói rời từng số.",
    whenToUseVi: "Mọi khách sạn ở TQ — chuỗi 5 sao + boutique đều hiểu.",
    whenNotToUseVi: "B&B nhỏ có thể không có Wi-Fi password (chỉ có sticker).",
    keyVocabulary: [
      { id: "rf2-v1", hanzi: "预订", pinyin: "yùdìng", vietnameseMeaning: "đặt trước", synonyms: [], exampleZh: "我有预订。", exampleVi: "Tôi có đặt trước.", tags: ["travel", "hotel"], frequencyLevel: "high" },
      { id: "rf2-v2", hanzi: "订单号", pinyin: "dìngdān hào", vietnameseMeaning: "mã đặt phòng", synonyms: [], exampleZh: "订单号 8821。", exampleVi: "Mã đặt 8821.", tags: ["travel"], frequencyLevel: "high" },
      { id: "rf2-v3", hanzi: "密码", pinyin: "mìmǎ", vietnameseMeaning: "mật khẩu", synonyms: [], exampleZh: "Wi-Fi 密码。", exampleVi: "Mật khẩu Wi-Fi.", tags: ["travel"], frequencyLevel: "high" },
      { id: "rf2-v4", hanzi: "早餐", pinyin: "zǎocān", vietnameseMeaning: "bữa sáng", synonyms: [], exampleZh: "早餐几点？", exampleVi: "Mấy giờ ăn sáng?", tags: ["travel", "hotel"], frequencyLevel: "high" },
      { id: "rf2-v5", hanzi: "开始", pinyin: "kāishǐ", vietnameseMeaning: "bắt đầu", synonyms: [], exampleZh: "几点开始？", exampleVi: "Mấy giờ bắt đầu?", tags: ["time"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "rf2-s1", zh: "我有预订，订单号是 ...", pinyin: "Wǒ yǒu yùdìng, dìngdān hào shì ...", vi: "Tôi có đặt trước, mã đặt là ...", register: "wechat" },
      { id: "rf2-s2", zh: "请问 ... 是多少 / 几点？", pinyin: "Qǐngwèn ... shì duōshǎo / jǐ diǎn?", vi: "Cho hỏi ... là gì / mấy giờ?", register: "wechat" },
    ],
    registerNotesVi: "Văn lịch sự khách – nhân viên.",
    discussionPrompts: ["Khách sạn TQ bạn từng ở — nhớ nhất điều gì?"],
    speakingPrompts: ["Đọc lại nguyên câu 3 lần, đặc biệt chuỗi số 8821."],
    roleplayScenario: {
      id: "rf2-rp",
      titleVi: "Check-in khách sạn 3 sao",
      titleZh: "三星级酒店入住",
      contextVi: "Trao đổi với lễ tân: xác nhận booking, hỏi Wi-Fi + early breakfast.",
      aiRole: "Lễ tân khách sạn",
      userRole: "Vân Trang — khách",
      targetPhrases: ["预订", "订单号", "Wi-Fi 密码", "早餐"],
      difficulty: "easy",
    },
  },

  // ============================================================
  // 3. TRAVEL — hỏi đường tới Cố Cung
  // ============================================================
  {
    id: "rf-3",
    titleZh: "问路去故宫",
    titleVi: "Hỏi đường tới Cố Cung",
    sourceType: "travel",
    difficulty: "easy",
    topicTags: ["travel", "directions"],
    categoryGroup: "directions",
    visual: {
      type: "learning_scene",
      sceneType: "airport_traffic",
      emoji: "🗺️",
      gradient: "travel-map",
      altVi: "Bản đồ + biển chỉ đường — chủ đề hỏi đường",
      captionVi: "Mở đầu 请问 lịch sự với người lạ",
    },
    originalZh:
      "请问，到故宫怎么走？坐地铁几号线？大概要多长时间？",
    pinyin:
      "Qǐngwèn, dào Gùgōng zěnme zǒu? Zuò dìtiě jǐ hào xiàn? Dàgài yào duō cháng shíjiān?",
    translationVi:
      "Cho hỏi, tới Cố Cung đi thế nào? Đi metro số mấy? Mất khoảng bao lâu?",
    spokenVersion: {
      zh: "故宫怎么走？地铁几号线？多久？",
      pinyin: "Gùgōng zěnme zǒu? Dìtiě jǐ hào xiàn? Duō jiǔ?",
      vi: "Cố Cung đi sao? Metro số mấy? Bao lâu?",
    },
    businessSafeVersion: {
      zh: "您好，请问到故宫怎么走？坐地铁是几号线？大概需要多长时间？谢谢。",
      pinyin: "Nín hǎo, qǐngwèn dào Gùgōng zěnme zǒu? Zuò dìtiě shì jǐ hào xiàn? Dàgài xūyào duō cháng shíjiān? Xièxie.",
      vi: "Chào anh/chị, cho hỏi tới Cố Cung đi thế nào ạ? Đi metro tuyến số mấy? Mất khoảng bao lâu? Cảm ơn.",
    },
    usageNotesVi: "请问 mở đầu rất quan trọng — không có thì nghe cộc.",
    whenToUseVi: "Mọi tình huống hỏi đường người lạ — bus, metro, tour.",
    whenNotToUseVi: "Không cần 请问 nếu bạn hỏi bạn / đồng nghiệp thân.",
    keyVocabulary: [
      { id: "rf3-v1", hanzi: "请问", pinyin: "qǐngwèn", vietnameseMeaning: "cho hỏi (lịch sự)", synonyms: [], exampleZh: "请问，洗手间在哪？", exampleVi: "Cho hỏi, WC ở đâu?", tags: ["travel"], frequencyLevel: "high" },
      { id: "rf3-v2", hanzi: "怎么走", pinyin: "zěnme zǒu", vietnameseMeaning: "đi thế nào", synonyms: [], exampleZh: "怎么走？", exampleVi: "Đi thế nào?", tags: ["travel"], frequencyLevel: "high" },
      { id: "rf3-v3", hanzi: "几号线", pinyin: "jǐ hào xiàn", vietnameseMeaning: "metro số mấy", synonyms: [], exampleZh: "坐几号线？", exampleVi: "Đi tuyến số mấy?", tags: ["travel"], frequencyLevel: "high" },
      { id: "rf3-v4", hanzi: "大概", pinyin: "dàgài", vietnameseMeaning: "khoảng, đại khái", synonyms: ["差不多"], exampleZh: "大概一小时。", exampleVi: "Khoảng 1 tiếng.", tags: ["adverb"], frequencyLevel: "high" },
      { id: "rf3-v5", hanzi: "多长时间", pinyin: "duō cháng shíjiān", vietnameseMeaning: "bao lâu", synonyms: ["多久"], exampleZh: "要多长时间？", exampleVi: "Mất bao lâu?", tags: ["time"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "rf3-s1", zh: "请问，到 ... 怎么走？", pinyin: "Qǐngwèn, dào ... zěnme zǒu?", vi: "Cho hỏi, tới ... đi thế nào?", register: "wechat" },
      { id: "rf3-s2", zh: "坐地铁几号线？", pinyin: "Zuò dìtiě jǐ hào xiàn?", vi: "Đi metro tuyến số mấy?", register: "casual" },
      { id: "rf3-s3", zh: "大概要多长时间？", pinyin: "Dàgài yào duō cháng shíjiān?", vi: "Mất khoảng bao lâu?", register: "casual" },
    ],
    registerNotesVi: "Lịch sự khi hỏi người lạ.",
    discussionPrompts: ["Khi lạc đường, bạn hỏi người Trung hay mở Google Maps?"],
    speakingPrompts: ["Tự nói lại câu gốc, sau đó nói lại version spoken."],
    roleplayScenario: {
      id: "rf3-rp",
      titleVi: "Hỏi đường tới Cố Cung",
      titleZh: "问路去故宫",
      contextVi: "Bạn đứng ở Vương Phủ Tỉnh, hỏi local đường tới Cố Cung.",
      aiRole: "Local đi đường thân thiện",
      userRole: "Vân Trang — du khách",
      targetPhrases: ["请问", "怎么走", "几号线", "多长时间"],
      difficulty: "easy",
    },
  },

  // ============================================================
  // 4. PERIOD DRAMA — đoạn quý phi đối thoại (gốc app viết)
  // ============================================================
  {
    id: "rf-4",
    titleZh: "古装剧片段：妃嫔对话",
    titleVi: "Phim cổ trang: quý phi đối thoại (đoạn gốc)",
    sourceType: "drama",
    difficulty: "medium",
    topicTags: ["drama", "period", "comprehension"],
    categoryGroup: "drama",
    visual: {
      type: "learning_scene",
      sceneType: "slang_register",
      emoji: "👘",
      gradient: "drama-period",
      altVi: "Tà áo cung đình + hoa anh đào",
      captionVi: "Đoạn gốc app viết để học cách xưng hô — không phải phim có bản quyền",
    },
    originalZh:
      "妹妹今日气色甚佳。\n姐姐说哪里话，妾身只是涂了点胭脂。\n本宫看着，倒像是有了喜事。",
    pinyin:
      "Mèimei jīnrì qìsè shèn jiā.\nJiějie shuō nǎli huà, qiè shēn zhǐshì túle diǎn yānzhi.\nBěn gōng kàn zhe, dào xiàng shì yǒule xǐshì.",
    translationVi:
      "Muội muội hôm nay khí sắc thật tốt.\nTỉ tỉ nói đâu ra đâu, thiếp chỉ thoa chút phấn hồng thôi.\nBổn cung nhìn lại tựa như có hỉ sự rồi.",
    spokenVersion: {
      zh: "你今天气色不错。\n哪有，就是抹了点腮红。\n我看像是有好事。",
      pinyin: "Nǐ jīntiān qìsè bù cuò.\nNǎ yǒu, jiùshì mǒle diǎn sāihóng.\nWǒ kàn xiàng shì yǒu hǎoshì.",
      vi: "Hôm nay sắc mặt em đẹp.\nĐâu có, chỉ là tô tí má hồng.\nTôi nhìn như có chuyện vui.",
    },
    businessSafeVersion: {
      zh: "（古装文言只用于看剧理解，日常对话请用现代口语，例如：你今天气色不错。）",
      pinyin: "(Gǔzhuāng wényán zhǐ yòng yú kàn jù lǐjiě, rìcháng duìhuà qǐng yòng xiàndài kǒuyǔ, lìrú: nǐ jīntiān qìsè bù cuò.)",
      vi: "(Văn ngôn cổ chỉ dùng để hiểu phim — đời thường nên dùng câu hiện đại, ví dụ: hôm nay sắc mặt bạn đẹp đấy.)",
    },
    usageNotesVi:
      "⚠️ Đoạn gốc do app viết theo phong cách cung đình — không phải lời thoại bản quyền. Học cách xưng hô 妹妹 / 姐姐 / 本宫 + xã giao trong cung.",
    whenToUseVi: "Khi xem Như Ý Truyện, Chân Hoàn Truyện, Thượng Dương Phú — để hiểu nhanh.",
    whenNotToUseVi:
      "❌ Tuyệt đối KHÔNG dùng 妾身 / 本宫 trong đời thực — nghe rất giả tạo.",
    keyVocabulary: [
      { id: "rf4-v1", hanzi: "气色", pinyin: "qìsè", vietnameseMeaning: "sắc mặt", synonyms: ["脸色"], exampleZh: "气色不错。", exampleVi: "Sắc mặt khá.", tags: ["drama"], frequencyLevel: "medium" },
      { id: "rf4-v2", hanzi: "甚佳", pinyin: "shèn jiā", vietnameseMeaning: "rất tốt (văn ngôn)", synonyms: [], exampleZh: "气色甚佳。", exampleVi: "Sắc mặt thật tốt.", tags: ["drama", "classical"], frequencyLevel: "low" },
      { id: "rf4-v3", hanzi: "哪里话", pinyin: "nǎli huà", vietnameseMeaning: "nói đâu ra đâu (khiêm)", synonyms: [], exampleZh: "说哪里话。", exampleVi: "Nói đâu ra đâu.", tags: ["drama"], frequencyLevel: "medium" },
      { id: "rf4-v4", hanzi: "胭脂", pinyin: "yānzhi", vietnameseMeaning: "phấn má, son môi (cổ)", synonyms: [], exampleZh: "涂胭脂。", exampleVi: "Thoa phấn má.", tags: ["drama", "period"], frequencyLevel: "low" },
      { id: "rf4-v5", hanzi: "喜事", pinyin: "xǐshì", vietnameseMeaning: "việc vui, hỉ sự", synonyms: [], exampleZh: "有喜事了。", exampleVi: "Có chuyện vui rồi.", tags: ["drama"], frequencyLevel: "medium" },
    ],
    sentencePatterns: [
      { id: "rf4-s1", zh: "妹妹今日气色甚佳。", pinyin: "Mèimei jīnrì qìsè shèn jiā.", vi: "Muội muội hôm nay sắc mặt rất tốt.", register: "formal_written" },
      { id: "rf4-s2", zh: "姐姐说哪里话。", pinyin: "Jiějie shuō nǎli huà.", vi: "Tỉ tỉ nói đâu ra đâu.", usageNoteVi: "Mẫu câu khiêm tốn từ chối lời khen.", register: "formal_written" },
      { id: "rf4-s3", zh: "本宫看着，倒像是 ...", pinyin: "Běn gōng kàn zhe, dào xiàng shì ...", vi: "Bổn cung nhìn lại tựa như ...", register: "formal_written" },
    ],
    registerNotesVi: "Văn ngôn cung đình — chỉ comprehension, KHÔNG production trong đời thực.",
    discussionPrompts: ["Phim cổ trang Trung bạn thích nhất hiện tại?"],
    speakingPrompts: ["Đọc to 3 lần, chú ý nhịp chậm rãi đặc trưng cổ trang."],
    annotatedPractice: {
      keyChips: ["气色", "本宫", "胭脂"],
      sentence: {
        zh: "妹妹今日气色甚佳，倒像是有了喜事。",
        pinyin: "Mèimei jīnrì qìsè shèn jiā, dào xiàng shì yǒule xǐshì.",
        vi: "Muội muội hôm nay sắc mặt rất tốt, tựa như có hỉ sự rồi.",
      },
    },
    roleplayScenario: {
      id: "rf4-rp",
      titleVi: "Đóng vai 2 quý phi đối thoại",
      titleZh: "扮演两位妃嫔对话",
      contextVi: "Bạn đóng vai quý phi đáp lễ. AI là quý phi mở chuyện.",
      aiRole: "Quý phi mở chuyện",
      userRole: "Vân Trang — quý phi đáp",
      targetPhrases: ["姐姐说哪里话", "妾身", "本宫", "喜事"],
      difficulty: "medium",
    },
  },

  // ============================================================
  // 5. MODERN DRAMA — cảnh tỏ tình ở sân bay (gốc)
  // ============================================================
  {
    id: "rf-5",
    titleZh: "现代剧片段：机场表白",
    titleVi: "Phim hiện đại: tỏ tình ở sân bay (đoạn gốc)",
    sourceType: "drama",
    difficulty: "easy",
    topicTags: ["drama", "modern", "romance"],
    categoryGroup: "drama",
    visual: {
      type: "learning_scene",
      sceneType: "music_rhythm",
      emoji: "✈️💕",
      gradient: "drama-modern",
      altVi: "Sân bay đêm + đôi tay nắm — chủ đề tỏ tình kinh điển",
      captionVi: "Cảnh kinh điển của phim Trung hiện đại",
    },
    originalZh:
      "其实我一直在乎你。\n这三年我没有一天忘记。\n别走，给我一个机会，好不好？",
    pinyin:
      "Qíshí wǒ yīzhí zàihu nǐ.\nZhè sān nián wǒ méi yǒu yī tiān wàngjì.\nBié zǒu, gěi wǒ yī gè jīhuì, hǎo bù hǎo?",
    translationVi:
      "Thật ra anh vẫn luôn quan tâm em.\n3 năm này anh chưa có ngày nào quên.\nĐừng đi, cho anh một cơ hội, được không?",
    spokenVersion: {
      zh: "我一直在乎你。三年了，每天都想你。别走，可以再给我一次机会吗？",
      pinyin: "Wǒ yīzhí zàihu nǐ. Sān nián le, měi tiān dōu xiǎng nǐ. Bié zǒu, kěyǐ zài gěi wǒ yī cì jīhuì ma?",
      vi: "Anh vẫn luôn quan tâm em. 3 năm rồi, ngày nào cũng nhớ em. Đừng đi, cho anh thêm 1 cơ hội nhé?",
    },
    businessSafeVersion: {
      zh: "（浪漫桥段属于影视场景，日常表达更含蓄，比如：我一直很在乎你，请给我一个机会，好吗？）",
      pinyin: "(Làngmàn qiáoduàn shǔyú yǐngshì chǎngjǐng, rìcháng biǎodá gèng hánxù, bǐrú: wǒ yīzhí hěn zàihu nǐ, qǐng gěi wǒ yī gè jīhuì, hǎo ma?)",
      vi: "(Đoạn lãng mạn này là cảnh phim — đời thường nên nói mềm hơn, ví dụ: anh vẫn luôn rất quan tâm em, cho anh một cơ hội, được không?)",
    },
    usageNotesVi:
      "Câu 其实我一直在乎你 là 'opening line' của 80% cảnh tỏ tình trong drama hiện đại. Học để hiểu — không cần dùng (trừ khi bạn muốn 'phim' với người yêu).",
    whenToUseVi: "Học để xem phim 30 Chưa Phải Là Hết, Du Tướng Hành, Hoan Lạc Tụng…",
    whenNotToUseVi: "Đời thường nói 我一直喜欢你 nhẹ hơn nhiều.",
    keyVocabulary: [
      { id: "rf5-v1", hanzi: "其实", pinyin: "qíshí", vietnameseMeaning: "thật ra", synonyms: [], exampleZh: "其实我也喜欢你。", exampleVi: "Thật ra em cũng thích anh.", tags: ["drama", "emotion"], frequencyLevel: "high" },
      { id: "rf5-v2", hanzi: "一直", pinyin: "yīzhí", vietnameseMeaning: "luôn luôn, liên tục", synonyms: [], exampleZh: "我一直等你。", exampleVi: "Em luôn đợi anh.", tags: ["drama"], frequencyLevel: "high" },
      { id: "rf5-v3", hanzi: "在乎", pinyin: "zàihu", vietnameseMeaning: "quan tâm, để bụng", synonyms: [], exampleZh: "我很在乎你。", exampleVi: "Anh rất quan tâm em.", tags: ["drama", "emotion"], frequencyLevel: "high" },
      { id: "rf5-v4", hanzi: "忘记", pinyin: "wàngjì", vietnameseMeaning: "quên", synonyms: [], exampleZh: "没有忘记。", exampleVi: "Không quên.", tags: ["emotion"], frequencyLevel: "high" },
      { id: "rf5-v5", hanzi: "机会", pinyin: "jīhuì", vietnameseMeaning: "cơ hội", synonyms: [], exampleZh: "再给我一个机会。", exampleVi: "Cho anh thêm 1 cơ hội.", tags: ["drama"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "rf5-s1", zh: "其实我一直 ...", pinyin: "Qíshí wǒ yīzhí ...", vi: "Thật ra anh/em vẫn luôn ...", usageNoteVi: "Opening line tỏ tình.", register: "casual" },
      { id: "rf5-s2", zh: "别 ...，给我一个机会。", pinyin: "Bié ..., gěi wǒ yī gè jīhuì.", vi: "Đừng ..., cho anh/em một cơ hội.", register: "casual" },
      { id: "rf5-s3", zh: "好不好？", pinyin: "Hǎo bù hǎo?", vi: "Được không?", usageNoteVi: "Cách hỏi mềm, hơi nài.", register: "casual" },
    ],
    registerNotesVi: "Casual romantic — cảnh phim, không formal.",
    discussionPrompts: ["Cảnh tỏ tình phim Trung nào ấn tượng nhất với bạn?"],
    speakingPrompts: ["Đọc với cảm xúc tăng dần: nhẹ → tha thiết."],
    roleplayScenario: {
      id: "rf5-rp",
      titleVi: "Đóng vai người nghe tỏ tình",
      titleZh: "扮演被表白的一方",
      contextVi: "AI tỏ tình tại sân bay. Bạn phản ứng tự nhiên rồi đáp lại (đồng ý / từ chối khéo).",
      aiRole: "Người yêu cũ — tỏ tình",
      userRole: "Vân Trang — người nghe",
      targetPhrases: ["其实", "我一直", "对不起", "再想想"],
      difficulty: "medium",
    },
  },

  // ============================================================
  // 6. SOCIAL — caption Xiaohongshu chuyến Thành Đô
  // ============================================================
  {
    id: "rf-6",
    titleZh: "小红书文案：成都之旅",
    titleVi: "Caption Xiaohongshu — chuyến Thành Đô",
    sourceType: "social",
    difficulty: "easy",
    topicTags: ["social", "xiaohongshu", "travel"],
    categoryGroup: "social",
    visual: {
      type: "comic_strip",
      sceneType: "slang_register",
      emoji: "🐼",
      gradient: "social-rose",
      altVi: "Caption Xiaohongshu kèm ảnh gấu trúc",
      captionVi: "Slang Xiaohongshu phổ biến — yyds + 种草 + 打卡",
    },
    originalZh:
      "成都 3 天 2 夜攻略来啦！🐼 大熊猫基地 yyds，火锅店求推荐！被种草了一家鸳鸯锅，下次来必打卡。#成都攻略 #大熊猫",
    pinyin:
      "Chéngdū 3 tiān 2 yè gōnglüè lái la! Dà xióngmāo jīdì yyds, huǒguō diàn qiú tuījiàn! Bèi zhòng cǎo le yī jiā yuānyāng guō, xià cì lái bì dǎ kǎ. #Chéngdū gōnglüè #Dà xióngmāo",
    translationVi:
      "Cẩm nang Thành Đô 3 ngày 2 đêm đây! 🐼 Khu nuôi gấu trúc đỉnh nhất, ai gợi ý quán lẩu giúp mình với! Vừa thấy một quán lẩu uyên ương đã thèm rồi, lần sau qua nhất định ghé. #cẩmnangThànhĐô #gấutrúc",
    spokenVersion: {
      zh: "成都 3 天 2 夜攻略来啦！熊猫基地超棒，火锅大家有推荐吗？",
      pinyin: "Chéngdū 3 tiān 2 yè gōnglüè lái la! Xióngmāo jīdì chāo bàng, huǒguō dàjiā yǒu tuījiàn ma?",
      vi: "Cẩm nang Thành Đô 3 ngày 2 đêm! Khu nuôi gấu trúc tuyệt vời, mọi người có gợi ý quán lẩu nào không?",
    },
    businessSafeVersion: {
      zh: "（社交媒体文案口语化，发给朋友看可以；如果要写正式分享，可以改成：成都三天两夜的行程攻略，推荐熊猫基地和当地火锅。）",
      pinyin: "(Shèjiāo méitǐ wén'àn kǒuyǔ huà, fā gěi péngyǒu kàn kěyǐ; rúguǒ yào xiě zhèngshì fēnxiǎng, kěyǐ gǎi chéng: Chéngdū sān tiān liǎng yè de xíngchéng gōnglüè, tuījiàn xióngmāo jīdì hé dāngdì huǒguō.)",
      vi: "(Caption mạng xã hội rất casual; nếu muốn viết kiểu lịch sự hơn, có thể đổi thành: cẩm nang lịch trình Thành Đô 3 ngày 2 đêm, giới thiệu khu nuôi gấu trúc và lẩu địa phương.)",
    },
    usageNotesVi:
      "Cấu trúc Xiaohongshu chuẩn: 攻略来啦 → khen 1 thứ → 求推荐 → 种草 → hashtag.",
    whenToUseVi: "Mọi caption Xiaohongshu sau chuyến đi, mua sắm, ăn uống.",
    whenNotToUseVi: "WeChat sếp, email báo cáo — KHÔNG slang.",
    keyVocabulary: [
      { id: "rf6-v1", hanzi: "攻略", pinyin: "gōnglüè", vietnameseMeaning: "cẩm nang, bài hướng dẫn (du lịch / mua sắm)", synonyms: [], exampleZh: "旅游攻略。", exampleVi: "Cẩm nang du lịch.", tags: ["social", "travel"], frequencyLevel: "high" },
      { id: "rf6-v2", hanzi: "yyds", pinyin: "yyds (永远的神)", vietnameseMeaning: "tiếng lóng — 'đỉnh nhất, không gì sánh bằng' (viết tắt 永远的神)", synonyms: [], exampleZh: "yyds！", exampleVi: "Đỉnh nhất!", tags: ["social", "slang"], frequencyLevel: "high" },
      { id: "rf6-v3", hanzi: "求推荐", pinyin: "qiú tuījiàn", vietnameseMeaning: "xin gợi ý, xin mọi người chỉ giúp", synonyms: [], exampleZh: "火锅求推荐。", exampleVi: "Xin gợi ý quán lẩu giúp mình.", tags: ["social"], frequencyLevel: "high" },
      { id: "rf6-v4", hanzi: "种草", pinyin: "zhòng cǎo", vietnameseMeaning: "tiếng lóng — thèm muốn mua sau khi đọc/xem review (dịch sát: 'gieo cỏ vào lòng')", synonyms: [], exampleZh: "被种草了。", exampleVi: "Xem review xong là thèm rồi.", tags: ["social", "slang"], frequencyLevel: "high" },
      { id: "rf6-v5", hanzi: "打卡", pinyin: "dǎ kǎ", vietnameseMeaning: "tới điểm nổi tiếng để chụp ảnh / ghé thăm", synonyms: [], exampleZh: "必打卡。", exampleVi: "Nhất định phải ghé.", tags: ["social", "travel"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "rf6-s1", zh: "... 攻略来啦！", pinyin: "... gōnglüè lái la!", vi: "Cẩm nang ... đây nè!", register: "casual" },
      { id: "rf6-s2", zh: "... yyds，求推荐 ...", pinyin: "... yyds, qiú tuījiàn ...", vi: "... đỉnh nhất, ai gợi ý ... giúp mình với!", register: "casual" },
      { id: "rf6-s3", zh: "被种草了一家 ...，必打卡。", pinyin: "Bèi zhòng cǎo le yī jiā ..., bì dǎ kǎ.", vi: "Vừa thấy 1 quán ... đã thèm rồi, nhất định phải ghé.", register: "casual" },
    ],
    registerNotesVi: "Slang Xiaohongshu — chỉ dùng caption MXH cá nhân.",
    discussionPrompts: ["Bạn dùng app gì để viết caption du lịch?"],
    speakingPrompts: ["Viết caption Xiaohongshu cho 1 chuyến đi gần nhất của bạn (4 câu)."],
    annotatedPractice: {
      keyChips: ["yyds", "求推荐", "种草", "打卡"],
      sentence: {
        zh: "成都 yyds，被种草了火锅，下次必打卡！",
        pinyin: "Chéngdū yyds, bèi zhòng cǎo le huǒguō, xià cì bì dǎ kǎ!",
        vi: "Thành Đô đỉnh nhất, xem review xong là thèm lẩu rồi, lần sau nhất định phải ghé!",
      },
    },
    roleplayScenario: {
      id: "rf6-rp",
      titleVi: "Trả lời comment Xiaohongshu",
      titleZh: "回复小红书评论",
      contextVi: "3 follower comment: hỏi quán lẩu cụ thể, hỏi giá vé gấu trúc, khen ảnh đẹp. Trả lời mỗi comment.",
      aiRole: "3 followers comment",
      userRole: "Vân Trang — chủ post",
      targetPhrases: ["谢谢", "推荐", "种草", "下次见"],
      difficulty: "easy",
    },
  },

  // ============================================================
  // 7. SOCIAL — Douyin slang về kỳ nghỉ
  // ============================================================
  {
    id: "rf-7",
    titleZh: "抖音热梗：周末躺平",
    titleVi: "Tiếng lóng Douyin — cuối tuần 'buông xuôi'",
    sourceType: "social",
    difficulty: "easy",
    topicTags: ["social", "douyin", "slang"],
    categoryGroup: "social",
    visual: {
      type: "comic_strip",
      sceneType: "slang_register",
      emoji: "🛋️",
      gradient: "social-rose",
      altVi: "Người nằm dài trên sofa với điện thoại",
      captionVi: "Tiếng lóng 躺平 + 佛系 + 真香 — phổ biến từ năm 2020 trở đi",
    },
    originalZh:
      "周末就是要躺平！谁也别叫我，奶茶+剧+空调，绝绝子。本来说不喝奶茶，结果一口下去：真香。",
    pinyin:
      "Zhōumò jiùshì yào tǎng píng! Shéi yě bié jiào wǒ, nǎichá+jù+kōngtiáo, juéjuézǐ. Běnlái shuō bù hē nǎichá, jiéguǒ yī kǒu xiàqù: zhēn xiāng.",
    translationVi:
      "Cuối tuần chỉ muốn buông xuôi! Ai cũng đừng gọi tôi, trà sữa + phim + máy lạnh = tuyệt cú mèo. Vốn bảo không uống trà sữa, vừa nhấp 1 ngụm: thèm thật rồi đấy.",
    spokenVersion: {
      zh: "周末就想躺着不动，喝奶茶看剧，最爽。",
      pinyin: "Zhōumò jiù xiǎng tǎng zhe bù dòng, hē nǎichá kàn jù, zuì shuǎng.",
      vi: "Cuối tuần chỉ muốn nằm yên, uống trà sữa xem phim, sướng nhất.",
    },
    businessSafeVersion: {
      zh: "(社交吐槽，不用于工作沟通。)",
      pinyin: "(Shèjiāo tǔcáo, bù yòng yú gōngzuò gōutōng.)",
      vi: "(Câu than vãn trên mạng — không dùng cho giao tiếp công việc.)",
    },
    usageNotesVi:
      "躺平 + 真香 là cặp tiếng lóng Gen-Z phổ biến nhất. Hài hước, kiểu 'khoe lười' dễ thương.",
    whenToUseVi: "Bài đăng Weibo, status WeChat Moments cá nhân.",
    whenNotToUseVi: "Nhóm WeChat công ty, nơi sếp có thể đọc được.",
    keyVocabulary: [
      { id: "rf7-v1", hanzi: "躺平", pinyin: "tǎng píng", vietnameseMeaning: "tiếng lóng — buông xuôi, không cố gắng nữa (dịch sát: 'nằm phẳng')", synonyms: [], exampleZh: "我躺平了。", exampleVi: "Tôi buông xuôi rồi.", tags: ["social", "slang"], frequencyLevel: "high" },
      { id: "rf7-v2", hanzi: "奶茶", pinyin: "nǎichá", vietnameseMeaning: "trà sữa", synonyms: [], exampleZh: "喝奶茶。", exampleVi: "Uống trà sữa.", tags: ["food"], frequencyLevel: "high" },
      { id: "rf7-v3", hanzi: "绝绝子", pinyin: "juéjuézǐ", vietnameseMeaning: "tuyệt cú mèo, xuất sắc", synonyms: [], exampleZh: "颜值绝绝子。", exampleVi: "Nhan sắc tuyệt cú mèo.", tags: ["social", "slang"], frequencyLevel: "high" },
      { id: "rf7-v4", hanzi: "本来", pinyin: "běnlái", vietnameseMeaning: "vốn dĩ, ban đầu", synonyms: [], exampleZh: "本来不想去。", exampleVi: "Vốn không muốn đi.", tags: ["adverb"], frequencyLevel: "high" },
      { id: "rf7-v5", hanzi: "真香", pinyin: "zhēn xiāng", vietnameseMeaning: "tiếng lóng — kiểu tự mỉa mai: 'trước chê, giờ lại thèm/thích'", synonyms: [], exampleZh: "真香！", exampleVi: "Thèm thật! (kiểu: 'biết vậy không từ chối')", tags: ["social", "slang"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "rf7-s1", zh: "周末就是要 ... ！", pinyin: "Zhōumò jiùshì yào ... !", vi: "Cuối tuần thì phải ...!", register: "casual" },
      { id: "rf7-s2", zh: "本来说 ...，结果 ...", pinyin: "Běnlái shuō ..., jiéguǒ ...", vi: "Vốn bảo ..., kết cục lại ...", register: "casual" },
      { id: "rf7-s3", zh: "一口下去：真香。", pinyin: "Yī kǒu xiàqù: zhēn xiāng.", vi: "Vừa nhấp 1 ngụm: thèm thật rồi đấy.", usageNoteVi: "Mẫu câu meme rất phổ biến.", register: "casual" },
    ],
    registerNotesVi: "Tiếng lóng Gen-Z — chỉ dùng cho bài đăng Weibo / Douyin cá nhân.",
    discussionPrompts: ["Bạn 'buông xuôi' kiểu này lúc nào trong đời thật?"],
    speakingPrompts: ["Viết 1 caption cuối tuần kiểu 躺平 + 真香 cho chính bạn."],
    roleplayScenario: {
      id: "rf7-rp",
      titleVi: "Bình luận trêu bạn vừa đăng bài 躺平",
      titleZh: "调侃朋友的躺平贴",
      contextVi: "Bạn vào bình luận 1 bài đăng của bạn thân đang khoe nằm dài cả ngày. Trêu vài câu vui.",
      aiRole: "Bạn thân vừa đăng bài",
      userRole: "Vân Trang — vào bình luận",
      targetPhrases: ["躺平", "真香", "佛系", "笑死"],
      difficulty: "easy",
    },
  },

  // ============================================================
  // 8. NEWS — chính sách miễn visa TQ - VN
  // ============================================================
  {
    id: "rf-8",
    titleZh: "中国对越南实施免签政策",
    titleVi: "Trung Quốc miễn visa cho công dân Việt Nam",
    sourceType: "news",
    difficulty: "medium",
    topicTags: ["news", "travel", "visa"],
    categoryGroup: "news",
    visual: {
      type: "learning_scene",
      sceneType: "ai_office",
      emoji: "🛂",
      gradient: "news-warm",
      altVi: "Hộ chiếu + dấu nhập cảnh",
      captionVi: "Headline báo + lead — học cấu trúc tin du lịch",
    },
    originalZh:
      "据外交部消息，中国自即日起对越南公民实施单方面免签政策，停留期不超过 15 天，便利两国人员往来。",
    pinyin:
      "Jù wàijiāo bù xiāoxi, Zhōngguó zì jí rì qǐ duì Yuènán gōngmín shíshī dānfāngmiàn miǎn qiān zhèngcè, tíngliú qī bù chāoguò 15 tiān, biànlì liǎng guó rényuán wǎnglái.",
    translationVi:
      "Theo tin từ Bộ Ngoại giao, Trung Quốc từ hôm nay áp dụng chính sách miễn visa đơn phương cho công dân Việt Nam, thời gian lưu trú không quá 15 ngày, tạo thuận lợi cho giao lưu nhân dân hai nước.",
    spokenVersion: {
      zh: "听说中国对越南免签了，15 天以内不用签证！",
      pinyin: "Tīngshuō Zhōngguó duì Yuènán miǎn qiān le, 15 tiān yǐnèi bùyòng qiānzhèng!",
      vi: "Nghe nói Trung Quốc miễn visa cho Việt Nam rồi, trong vòng 15 ngày không cần visa!",
    },
    businessSafeVersion: {
      zh: "据外交部消息，中国对越南公民实施单方面免签政策，停留期上限 15 天。",
      pinyin: "Jù wàijiāo bù xiāoxi, Zhōngguó duì Yuènán gōngmín shíshī dānfāngmiàn miǎn qiān zhèngcè, tíngliú qī shàngxiàn 15 tiān.",
      vi: "Theo Bộ Ngoại giao, Trung Quốc áp dụng miễn visa đơn phương cho công dân Việt Nam, giới hạn lưu trú 15 ngày.",
    },
    usageNotesVi:
      "据 ... 消息 = mở đầu kinh điển trên báo TQ. 自即日起 = lịch sự / chuẩn báo chí. Phiên bản nói chỉ giữ thông tin chính.",
    whenToUseVi: "Đọc / chia sẻ tin tức trên Facebook · WeChat Moments · kể bạn bè.",
    whenNotToUseVi: "Chat thân mật — dùng phiên bản nói đơn giản hơn.",
    keyVocabulary: [
      { id: "rf8-v1", hanzi: "据", pinyin: "jù", vietnameseMeaning: "theo (nguồn tin)", synonyms: [], exampleZh: "据报道", exampleVi: "Theo đưa tin", tags: ["news"], frequencyLevel: "high" },
      { id: "rf8-v2", hanzi: "外交部", pinyin: "wàijiāo bù", vietnameseMeaning: "Bộ Ngoại giao", synonyms: [], exampleZh: "外交部消息", exampleVi: "Tin Bộ Ngoại giao", tags: ["news"], frequencyLevel: "high" },
      { id: "rf8-v3", hanzi: "实施", pinyin: "shíshī", vietnameseMeaning: "thực thi, áp dụng", synonyms: [], exampleZh: "实施政策", exampleVi: "áp dụng chính sách", tags: ["news"], frequencyLevel: "medium" },
      { id: "rf8-v4", hanzi: "免签", pinyin: "miǎn qiān", vietnameseMeaning: "miễn visa", synonyms: [], exampleZh: "对越南免签", exampleVi: "miễn visa cho VN", tags: ["news", "travel"], frequencyLevel: "high" },
      { id: "rf8-v5", hanzi: "停留期", pinyin: "tíngliú qī", vietnameseMeaning: "thời gian lưu trú", synonyms: [], exampleZh: "停留期 15 天", exampleVi: "lưu trú 15 ngày", tags: ["news", "travel"], frequencyLevel: "medium" },
    ],
    sentencePatterns: [
      { id: "rf8-s1", zh: "据 ... 消息，...", pinyin: "Jù ... xiāoxi, ...", vi: "Theo tin từ ..., ...", register: "formal_written" },
      { id: "rf8-s2", zh: "自即日起，...", pinyin: "Zì jí rì qǐ, ...", vi: "Từ hôm nay, ...", register: "formal_written" },
      { id: "rf8-s3", zh: "便利两国人员往来。", pinyin: "Biànlì liǎng guó rényuán wǎnglái.", vi: "Tạo thuận lợi cho giao lưu nhân dân hai nước.", register: "formal_written" },
    ],
    registerNotesVi: "Văn báo chí — đọc hiểu là chính.",
    discussionPrompts: ["Nếu miễn visa, bạn sẽ đi thành phố TQ nào trước?"],
    speakingPrompts: ["Tóm tắt tin cho bạn nghe trong 2 câu spoken."],
    annotatedPractice: {
      keyChips: ["据", "外交部", "免签", "停留期"],
      sentence: {
        zh: "据外交部消息，中国对越南免签，停留期 15 天。",
        pinyin: "Jù wàijiāo bù xiāoxi, Zhōngguó duì Yuènán miǎn qiān, tíngliú qī 15 tiān.",
        vi: "Theo Bộ Ngoại giao, Trung Quốc miễn visa cho Việt Nam, lưu trú 15 ngày.",
      },
    },
    roleplayScenario: {
      id: "rf8-rp",
      titleVi: "Brief tin miễn visa cho gia đình",
      titleZh: "向家人转述免签新闻",
      contextVi: "Bạn vừa đọc tin, kể cho mẹ nghe trong 3 câu spoken, dễ hiểu.",
      aiRole: "Mẹ — không quen tin tức formal",
      userRole: "Vân Trang — kể lại",
      targetPhrases: ["听说", "免签", "15 天", "可以去"],
      difficulty: "medium",
    },
  },

  // ============================================================
  // 9. NEWS — dự báo thời tiết Cáp Nhĩ Tân
  // ============================================================
  {
    id: "rf-9",
    titleZh: "哈尔滨冬季天气预报",
    titleVi: "Dự báo thời tiết mùa đông Cáp Nhĩ Tân",
    sourceType: "news",
    difficulty: "easy",
    topicTags: ["news", "weather", "travel"],
    categoryGroup: "news",
    visual: {
      type: "learning_scene",
      sceneType: "market_competition",
      emoji: "❄️",
      gradient: "news-cold",
      altVi: "Bản đồ thời tiết — Cáp Nhĩ Tân tuyết",
      captionVi: "Tin thời tiết — cấu trúc đơn giản, hữu ích trước chuyến đi",
    },
    originalZh:
      "未来一周，哈尔滨气温在零下 15 度到零下 5 度之间，周三周四有大雪，建议出行注意保暖，避免长时间户外活动。",
    pinyin:
      "Wèilái yī zhōu, Hā'ěrbīn qìwēn zài língxià 15 dù dào língxià 5 dù zhī jiān, zhōusān zhōusì yǒu dàxuě, jiànyì chūxíng zhùyì bǎonuǎn, bìmiǎn cháng shíjiān hùwài huódòng.",
    translationVi:
      "Tuần tới, Cáp Nhĩ Tân nhiệt độ từ -15°C đến -5°C, thứ tư thứ năm có tuyết lớn, khuyến nghị đi lại chú ý giữ ấm, tránh hoạt động ngoài trời lâu.",
    spokenVersion: {
      zh: "下周哈尔滨很冷，零下 15 到零下 5 度，周三周四下大雪，记得穿厚点。",
      pinyin: "Xià zhōu Hā'ěrbīn hěn lěng, língxià 15 dào língxià 5 dù, zhōusān zhōusì xià dàxuě, jìde chuān hòu diǎn.",
      vi: "Tuần sau Cáp Nhĩ Tân lạnh lắm, -15 đến -5 độ, thứ tư thứ năm tuyết lớn, nhớ mặc dày vào.",
    },
    businessSafeVersion: {
      zh: "未来一周哈尔滨气温区间零下 15-5 度，周中有降雪，请合理安排出行。",
      pinyin: "Wèilái yī zhōu Hā'ěrbīn qìwēn qūjiān língxià 15-5 dù, zhōu zhōng yǒu jiàngxuě, qǐng hélǐ ānpái chūxíng.",
      vi: "Tuần tới Cáp Nhĩ Tân nhiệt độ -15 đến -5 độ, giữa tuần có tuyết, vui lòng sắp xếp đi lại hợp lý.",
    },
    usageNotesVi: "未来一周 + 气温在 X 到 Y 之间 = cấu trúc dự báo chuẩn.",
    whenToUseVi: "Trước chuyến đi mùa đông — hỏi thông tin local.",
    whenNotToUseVi: "Không cần version formal khi chat bạn.",
    keyVocabulary: [
      { id: "rf9-v1", hanzi: "未来", pinyin: "wèilái", vietnameseMeaning: "tương lai, sắp tới", synonyms: [], exampleZh: "未来一周", exampleVi: "tuần tới", tags: ["news", "time"], frequencyLevel: "high" },
      { id: "rf9-v2", hanzi: "气温", pinyin: "qìwēn", vietnameseMeaning: "nhiệt độ", synonyms: [], exampleZh: "气温很低", exampleVi: "nhiệt độ rất thấp", tags: ["weather"], frequencyLevel: "high" },
      { id: "rf9-v3", hanzi: "零下", pinyin: "língxià", vietnameseMeaning: "dưới 0 (âm độ)", synonyms: [], exampleZh: "零下 15 度", exampleVi: "âm 15 độ", tags: ["weather"], frequencyLevel: "high" },
      { id: "rf9-v4", hanzi: "大雪", pinyin: "dàxuě", vietnameseMeaning: "tuyết lớn", synonyms: [], exampleZh: "下大雪", exampleVi: "tuyết lớn", tags: ["weather"], frequencyLevel: "high" },
      { id: "rf9-v5", hanzi: "保暖", pinyin: "bǎonuǎn", vietnameseMeaning: "giữ ấm", synonyms: [], exampleZh: "注意保暖", exampleVi: "chú ý giữ ấm", tags: ["weather", "travel"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "rf9-s1", zh: "未来一周 ... 气温在 X 到 Y 度之间。", pinyin: "Wèilái yī zhōu ... qìwēn zài X dào Y dù zhī jiān.", vi: "Tuần tới ... nhiệt độ từ X đến Y độ.", register: "formal_written" },
      { id: "rf9-s2", zh: "建议出行注意 ...", pinyin: "Jiànyì chūxíng zhùyì ...", vi: "Khuyến nghị đi lại chú ý ...", register: "formal_written" },
      { id: "rf9-s3", zh: "记得穿厚点。", pinyin: "Jìde chuān hòu diǎn.", vi: "Nhớ mặc dày vào.", register: "casual" },
    ],
    registerNotesVi: "Văn báo thời tiết hoặc weather app — đọc nhanh.",
    discussionPrompts: ["Bạn từng đi Cáp Nhĩ Tân mùa đông chưa?"],
    speakingPrompts: ["Brief 1 dự báo thời tiết Hà Nội tuần tới cho bạn Trung."],
    roleplayScenario: {
      id: "rf9-rp",
      titleVi: "Hỏi local Cáp Nhĩ Tân về thời tiết",
      titleZh: "向当地人询问天气",
      contextVi: "Bạn nhắn local Cáp Nhĩ Tân hỏi tuần tới có nên đi không, nhiệt độ ra sao.",
      aiRole: "Local Cáp Nhĩ Tân",
      userRole: "Vân Trang — chuẩn bị đi",
      targetPhrases: ["气温", "下雪", "保暖", "出行"],
      difficulty: "easy",
    },
  },

  // ============================================================
  // 10. TRAVEL — mua quà ở chợ đêm Tây An
  // ============================================================
  {
    id: "rf-10",
    titleZh: "西安夜市买礼物",
    titleVi: "Mua quà ở chợ đêm Tây An",
    sourceType: "travel",
    difficulty: "easy",
    topicTags: ["travel", "shopping", "market"],
    categoryGroup: "shopping",
    visual: {
      type: "learning_scene",
      sceneType: "dutyfree_customer",
      emoji: "🏮",
      gradient: "travel-night",
      altVi: "Sạp chợ đêm Tây An — đèn lồng đỏ",
      captionVi: "Mặc cả ở chợ đêm — văn hoá phải biết",
    },
    originalZh:
      "老板，这条丝巾多少钱？太贵了，便宜点行吗？180 行不行？可以微信支付吗？",
    pinyin:
      "Lǎobǎn, zhè tiáo sījīn duōshao qián? Tài guì le, piányi diǎn xíng ma? 180 xíng bù xíng? Kěyǐ Wēixìn zhīfù ma?",
    translationVi:
      "Anh chủ, chiếc khăn lụa này bao nhiêu? Đắt quá, bớt chút được không? 180 được không? Trả WeChat Pay được không?",
    spokenVersion: {
      zh: "老板，丝巾多少？便宜点呗，180 行不？微信扫码？",
      pinyin: "Lǎobǎn, sījīn duōshao? Piányi diǎn bei, 180 xíng bù? Wēixìn sǎo mǎ?",
      vi: "Anh ơi, khăn bao nhiêu? Bớt chút đi, 180 nhé? WeChat quét mã?",
    },
    businessSafeVersion: {
      zh: "您好，请问这条丝巾多少钱？可以稍微便宜一点吗？我想买两条。",
      pinyin: "Nín hǎo, qǐngwèn zhè tiáo sījīn duōshǎo qián? Kěyǐ shāowēi piányi yīdiǎn ma? Wǒ xiǎng mǎi liǎng tiáo.",
      vi: "Chào anh/chị, cho hỏi khăn lụa này bao nhiêu? Bớt chút được không ạ? Tôi định mua 2 chiếc.",
    },
    usageNotesVi:
      "Mặc cả OK ở chợ đêm, sạp lề đường. KHÔNG mặc cả ở mall / cửa hàng có giá niêm yết.",
    whenToUseVi: "Chợ đêm, sạp lề đường, đồ thủ công, kỷ niệm chương du lịch.",
    whenNotToUseVi: "Uniqlo, MUJI, mall — đừng mặc cả.",
    keyVocabulary: [
      { id: "rf10-v1", hanzi: "老板", pinyin: "lǎobǎn", vietnameseMeaning: "anh/chị chủ (gọi người bán)", synonyms: [], exampleZh: "老板，多少钱？", exampleVi: "Anh chủ, bao nhiêu?", tags: ["travel", "shopping"], frequencyLevel: "high" },
      { id: "rf10-v2", hanzi: "丝巾", pinyin: "sījīn", vietnameseMeaning: "khăn lụa", synonyms: [], exampleZh: "买条丝巾。", exampleVi: "Mua chiếc khăn lụa.", tags: ["shopping"], frequencyLevel: "medium" },
      { id: "rf10-v3", hanzi: "便宜点", pinyin: "piányi diǎn", vietnameseMeaning: "rẻ hơn chút", synonyms: [], exampleZh: "便宜点行吗？", exampleVi: "Bớt chút được không?", tags: ["shopping"], frequencyLevel: "high" },
      { id: "rf10-v4", hanzi: "行不行", pinyin: "xíng bù xíng", vietnameseMeaning: "được không (hỏi đồng ý)", synonyms: ["可以吗"], exampleZh: "180 行不行？", exampleVi: "180 được không?", tags: ["casual"], frequencyLevel: "high" },
      { id: "rf10-v5", hanzi: "微信支付", pinyin: "Wēixìn zhīfù", vietnameseMeaning: "trả qua WeChat Pay", synonyms: [], exampleZh: "微信支付吗？", exampleVi: "Trả WeChat Pay nhé?", tags: ["payment"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "rf10-s1", zh: "老板，这个多少钱？", pinyin: "Lǎobǎn, zhège duōshao qián?", vi: "Anh chủ, cái này bao nhiêu?", register: "casual" },
      { id: "rf10-s2", zh: "太贵了，便宜点行吗？", pinyin: "Tài guì le, piányi diǎn xíng ma?", vi: "Đắt quá, bớt chút được không?", register: "casual" },
      { id: "rf10-s3", zh: "可以微信支付吗？", pinyin: "Kěyǐ Wēixìn zhīfù ma?", vi: "Trả WeChat Pay được không?", register: "casual" },
    ],
    registerNotesVi: "Casual — văn hoá chợ TQ rất thoải mái.",
    discussionPrompts: ["Lần mặc cả khôn nhất / tệ nhất của bạn?"],
    speakingPrompts: ["Mặc cả 1 món đồ từ 250 xuống 150 — kịch bản 4-5 lượt."],
    roleplayScenario: {
      id: "rf10-rp",
      titleVi: "Mặc cả mua quà",
      titleZh: "砍价买礼物",
      contextVi: "Bạn chọn khăn lụa, chủ kêu 250. Mặc cả xuống 180, trả WeChat Pay.",
      aiRole: "Chủ sạp",
      userRole: "Vân Trang — khách",
      targetPhrases: ["多少钱", "太贵了", "便宜点", "微信支付"],
      difficulty: "easy",
    },
  },

  // ============================================================
  // 11. MODERN DRAMA — tâm sự về sếp khó (đoạn gốc app viết)
  // ============================================================
  {
    id: "rf-11",
    titleZh: "现代剧片段：误会解释",
    titleVi: "Phim hiện đại: hiểu lầm trong tình cảm (đoạn gốc)",
    sourceType: "drama",
    difficulty: "easy",
    topicTags: ["drama", "modern", "romance"],
    categoryGroup: "drama",
    visual: {
      type: "learning_scene",
      sceneType: "music_rhythm",
      emoji: "💭",
      gradient: "drama-modern",
      altVi: "Hai người đứng dưới đèn đường — giải thích hiểu lầm",
      captionVi: "Đoạn hội thoại đời thường trong phim hiện đại — giải thích hiểu lầm nhẹ nhàng",
    },
    originalZh:
      "你听我说，那天我不是故意不接你电话。手机没电了，我一回到家就给你回。",
    pinyin:
      "Nǐ tīng wǒ shuō, nà tiān wǒ bùshì gùyì bù jiē nǐ diànhuà. Shǒujī méi diàn le, wǒ yī huí dào jiā jiù gěi nǐ huí.",
    translationVi:
      "Em nghe anh nói, hôm ấy anh không cố ý không nghe máy. Điện thoại hết pin, vừa về tới nhà anh gọi lại em ngay.",
    spokenVersion: {
      zh: "听我说，那天真不是故意的，手机没电了，回家就回你了。",
      pinyin: "Tīng wǒ shuō, nà tiān zhēn bùshì gùyì de, shǒujī méi diàn le, huí jiā jiù huí nǐ le.",
      vi: "Em nghe anh, hôm đó anh không cố ý đâu, máy hết pin, về tới nhà anh gọi lại liền.",
    },
    businessSafeVersion: {
      zh: "(浪漫剧用语，不用于正式场合。)",
      pinyin: "(Làngmàn jù yòngyǔ, bù yòng yú zhèngshì chǎnghé.)",
      vi: "(Câu thoại lãng mạn — không dùng trong tình huống trang trọng.)",
    },
    usageNotesVi:
      "你听我说 = mở đầu kinh điển khi muốn giải thích hiểu lầm. Combo 不是故意 + 一 ... 就 ... = 'không cố ý, ngay khi ... liền ...' rất tự nhiên.",
    whenToUseVi: "Hội thoại tình cảm trong phim hiện đại, chat với người yêu / bạn thân khi giải thích.",
    whenNotToUseVi: "Tình huống trang trọng, người lạ, hoặc khi đối phương đang giận nặng (cần xin lỗi rõ hơn).",
    keyVocabulary: [
      { id: "rf11-v1", hanzi: "听我说", pinyin: "tīng wǒ shuō", vietnameseMeaning: "nghe anh/em nói (mở đầu giải thích)", synonyms: [], exampleZh: "你听我说，事情不是那样。", exampleVi: "Em nghe anh nói, chuyện không phải vậy.", tags: ["drama", "romance"], frequencyLevel: "high" },
      { id: "rf11-v2", hanzi: "故意", pinyin: "gùyì", vietnameseMeaning: "cố ý", synonyms: [], exampleZh: "我不是故意的。", exampleVi: "Anh không cố ý.", tags: ["drama", "emotion"], frequencyLevel: "high" },
      { id: "rf11-v3", hanzi: "接电话", pinyin: "jiē diànhuà", vietnameseMeaning: "nghe điện thoại", synonyms: [], exampleZh: "你怎么不接电话？", exampleVi: "Sao em không nghe máy?", tags: ["drama"], frequencyLevel: "high" },
      { id: "rf11-v4", hanzi: "没电", pinyin: "méi diàn", vietnameseMeaning: "hết pin", synonyms: [], exampleZh: "手机没电了。", exampleVi: "Điện thoại hết pin rồi.", tags: ["drama"], frequencyLevel: "high" },
      { id: "rf11-v5", hanzi: "一 ... 就 ...", pinyin: "yī ... jiù ...", vietnameseMeaning: "ngay khi ... liền ...", synonyms: [], exampleZh: "一回家就给你打。", exampleVi: "Vừa về nhà liền gọi em.", tags: ["drama", "grammar"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "rf11-s1", zh: "你听我说，...", pinyin: "Nǐ tīng wǒ shuō, ...", vi: "Em/anh nghe đây, ...", usageNoteVi: "Mở đầu kinh điển khi muốn giải thích.", register: "casual" },
      { id: "rf11-s2", zh: "我不是故意 ...", pinyin: "Wǒ bùshì gùyì ...", vi: "Anh/em không cố ý ...", register: "casual" },
      { id: "rf11-s3", zh: "一 ... 就 ... 给你回。", pinyin: "Yī ... jiù ... gěi nǐ huí.", vi: "Ngay khi ... liền trả lời em.", usageNoteVi: "Cấu trúc nhấn 'làm ngay sau đó'.", register: "casual" },
    ],
    registerNotesVi: "Casual tình cảm — hợp drama hiện đại, không dùng trang trọng.",
    discussionPrompts: ["Bạn từng hiểu lầm ai và giải thích thế nào?"],
    speakingPrompts: ["Tự đóng cảnh: bạn giải thích vì sao không trả lời tin nhắn cả buổi tối."],
    roleplayScenario: {
      id: "rf11-rp",
      titleVi: "Giải thích hiểu lầm với người yêu",
      titleZh: "向恋人解释误会",
      contextVi: "AI là người yêu đang dỗi vì bạn không trả lời tin nhắn cả tối. Giải thích nhẹ nhàng, dùng 听我说 + 不是故意 + 一 ... 就 ...",
      aiRole: "Người yêu đang dỗi nhẹ",
      userRole: "Vân Trang — người giải thích",
      targetPhrases: ["听我说", "不是故意", "没电", "一 ... 就 ..."],
      difficulty: "easy",
    },
  },

  // ============================================================
  // 12. SOCIAL — Weibo hot search về phim drama
  // ============================================================
  {
    id: "rf-12",
    titleZh: "微博热搜：新剧上线",
    titleVi: "Weibo hot search — drama mới lên sóng",
    sourceType: "social",
    difficulty: "medium",
    topicTags: ["social", "weibo", "drama"],
    categoryGroup: "social",
    visual: {
      type: "comic_strip",
      sceneType: "slang_register",
      emoji: "🔥",
      gradient: "social-fire",
      altVi: "Phone showing Weibo trending list — 🔥 hot search",
      captionVi: "Format hot search Weibo — học để lướt trending nhanh",
    },
    originalZh:
      "#某剧今晚开播# 🔥 网友：颜值在线，剧情拉满，希望别烂尾。求安利同款主题曲！",
    pinyin:
      "#mǒu jù jīn wǎn kāibō# Wǎngyǒu: yánzhí zài xiàn, jùqíng lā mǎn, xīwàng bié lànwěi. Qiú ānlì tóng kuǎn zhǔtí qǔ!",
    translationVi:
      "#PhimNàoĐóTốiNayLênSóng# 🔥 Netizen: diễn viên đẹp, cốt truyện hấp dẫn, mong đừng kết phim dở. Mọi người gợi ý bài nhạc chủ đề luôn nhé!",
    spokenVersion: {
      zh: "今晚有新剧，演员长得好看，剧情也不错，希望不烂尾。主题曲谁知道？",
      pinyin: "Jīn wǎn yǒu xīn jù, yǎnyuán zhǎng de hǎokàn, jùqíng yě bù cuò, xīwàng bù lànwěi. Zhǔtí qǔ shéi zhīdào?",
      vi: "Tối nay có phim mới, diễn viên đẹp, plot cũng ok, mong đừng dở ending. Bài nhạc chủ đề ai biết?",
    },
    businessSafeVersion: {
      zh: "(社交热搜非正式话题。)",
      pinyin: "(Shèjiāo rèsōu fēi zhèngshì huàtí.)",
      vi: "(Hot search mạng xã hội — không phải chủ đề trang trọng.)",
    },
    usageNotesVi:
      "Cấu trúc bài hot search: # hashtag # + 网友 (netizen) + cảm xúc + cụm tiếng lóng (颜值在线 / 剧情拉满 / 烂尾 / 求安利).",
    whenToUseVi: "Khi lướt Weibo / Douyin và muốn tham gia trend đang hot.",
    whenNotToUseVi: "Email công việc, báo cáo, bài đăng LinkedIn.",
    keyVocabulary: [
      { id: "rf12-v1", hanzi: "开播", pinyin: "kāibō", vietnameseMeaning: "lên sóng (phim, chương trình)", synonyms: [], exampleZh: "今晚开播。", exampleVi: "Tối nay lên sóng.", tags: ["social", "drama"], frequencyLevel: "high" },
      { id: "rf12-v2", hanzi: "颜值在线", pinyin: "yánzhí zài xiàn", vietnameseMeaning: "tiếng lóng — diễn viên đẹp (dịch sát: 'nhan sắc đạt chuẩn')", synonyms: [], exampleZh: "男主颜值在线。", exampleVi: "Nam chính đẹp lắm.", tags: ["social", "slang"], frequencyLevel: "high" },
      { id: "rf12-v3", hanzi: "剧情拉满", pinyin: "jùqíng lā mǎn", vietnameseMeaning: "tiếng lóng — cốt truyện hấp dẫn, kịch tính tới đỉnh", synonyms: [], exampleZh: "前两集剧情拉满。", exampleVi: "2 tập đầu cốt truyện hấp dẫn lắm.", tags: ["social", "drama"], frequencyLevel: "medium" },
      { id: "rf12-v4", hanzi: "烂尾", pinyin: "lànwěi", vietnameseMeaning: "tiếng lóng — kết phim dở, đoạn cuối hỏng", synonyms: [], exampleZh: "希望不烂尾。", exampleVi: "Mong đừng có cái kết dở.", tags: ["social", "drama"], frequencyLevel: "high" },
      { id: "rf12-v5", hanzi: "求安利", pinyin: "qiú ānlì", vietnameseMeaning: "tiếng lóng — xin mọi người gợi ý / giới thiệu (giống 求推荐)", synonyms: ["求推荐"], exampleZh: "求安利好剧。", exampleVi: "Mọi người gợi ý phim hay cho mình với.", tags: ["social", "slang"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "rf12-s1", zh: "#... 今晚开播 # 🔥", pinyin: "#... jīn wǎn kāibō# 🔥", vi: "#... TốiNayLênSóng# 🔥", register: "casual" },
      { id: "rf12-s2", zh: "颜值在线，剧情拉满。", pinyin: "Yánzhí zài xiàn, jùqíng lā mǎn.", vi: "Diễn viên đẹp, cốt truyện hấp dẫn.", register: "casual" },
      { id: "rf12-s3", zh: "希望别烂尾。", pinyin: "Xīwàng bié lànwěi.", vi: "Mong đừng có cái kết dở.", register: "casual" },
      { id: "rf12-s4", zh: "求安利 ...", pinyin: "Qiú ānlì ...", vi: "Mọi người gợi ý ... giúp mình với.", register: "casual" },
    ],
    registerNotesVi: "Tiếng lóng Weibo — cứ vài tháng lại có cụm mới, biết khung cấu trúc là đủ.",
    discussionPrompts: ["Phim Trung 2026 nào bạn đang hóng?"],
    speakingPrompts: ["Viết 1 bài Weibo ngắn về phim Trung bạn vừa xem (3-4 câu, có tiếng lóng)."],
    annotatedPractice: {
      keyChips: ["开播", "颜值在线", "求安利"],
      sentence: {
        zh: "今晚新剧开播，颜值在线，求安利同款 OST！",
        pinyin: "Jīn wǎn xīn jù kāibō, yánzhí zài xiàn, qiú ānlì tóng kuǎn OST!",
        vi: "Tối nay phim mới lên sóng, diễn viên đẹp lắm, mọi người gợi ý bài nhạc phim với!",
      },
    },
    roleplayScenario: {
      id: "rf12-rp",
      titleVi: "Bình luận hot search Weibo",
      titleZh: "评论微博热搜",
      contextVi: "Một hot search về phim drama. Bạn comment 2-3 lượt cùng netizen khác.",
      aiRole: "Netizen khác đang bàn",
      userRole: "Vân Trang — vào comment",
      targetPhrases: ["颜值", "剧情", "烂尾", "求安利"],
      difficulty: "medium",
    },
  },
];
