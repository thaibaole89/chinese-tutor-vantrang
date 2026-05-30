import type { Lesson } from "@/lib/types";

/**
 * Week 1 lessons for Vân Trang — 7 days of beginner Mandarin tuned to her
 * goals: travel, daily communication, drama-watching. NO business / no
 * corporate / no MOU / SLA / KPI vocabulary.
 *
 * Each lesson: ≈18-22 minutes, 10 vocab + 5 sentence patterns + dialogue +
 * role-play scenario + 4-question mini-quiz.
 */

export const week1Lessons: Lesson[] = [
  // ============================================================
  // Day 1 — Greeting & simple self-introduction
  // ============================================================
  {
    id: "w1d1",
    week: 1,
    day: 1,
    titleZh: "打招呼和简单自我介绍",
    titleVi: "Chào hỏi và tự giới thiệu đơn giản",
    objectiveVi: "Chào hỏi tự nhiên + giới thiệu tên, quốc tịch, lý do học tiếng Trung.",
    durationMinutes: 18,
    vocabulary: [
      { id: "w1d1-v1", hanzi: "你好", pinyin: "nǐ hǎo", vietnameseMeaning: "xin chào", synonyms: ["您好"], exampleZh: "你好，我是云。", exampleVi: "Xin chào, tôi là Vân.", tags: ["greeting"], frequencyLevel: "high" },
      { id: "w1d1-v2", hanzi: "我", pinyin: "wǒ", vietnameseMeaning: "tôi", synonyms: [], exampleZh: "我是云。", exampleVi: "Tôi là Vân.", tags: ["pronoun"], frequencyLevel: "high" },
      { id: "w1d1-v3", hanzi: "叫", pinyin: "jiào", vietnameseMeaning: "tên là, gọi là", synonyms: [], exampleZh: "我叫云。", exampleVi: "Tôi tên là Vân.", tags: ["verb"], frequencyLevel: "high" },
      { id: "w1d1-v4", hanzi: "越南人", pinyin: "Yuènán rén", vietnameseMeaning: "người Việt Nam", synonyms: [], exampleZh: "我是越南人。", exampleVi: "Tôi là người Việt Nam.", tags: ["identity"], frequencyLevel: "high" },
      { id: "w1d1-v5", hanzi: "认识", pinyin: "rènshi", vietnameseMeaning: "làm quen, biết", synonyms: [], exampleZh: "很高兴认识你。", exampleVi: "Rất vui được làm quen.", tags: ["greeting"], frequencyLevel: "high" },
      { id: "w1d1-v6", hanzi: "高兴", pinyin: "gāoxìng", vietnameseMeaning: "vui mừng", synonyms: ["开心"], exampleZh: "我很高兴。", exampleVi: "Tôi rất vui.", tags: ["emotion"], frequencyLevel: "high" },
      { id: "w1d1-v7", hanzi: "学", pinyin: "xué", vietnameseMeaning: "học", synonyms: ["学习"], exampleZh: "我在学中文。", exampleVi: "Tôi đang học tiếng Trung.", tags: ["verb"], frequencyLevel: "high" },
      { id: "w1d1-v8", hanzi: "中文", pinyin: "Zhōngwén", vietnameseMeaning: "tiếng Trung", synonyms: ["汉语"], exampleZh: "我学中文。", exampleVi: "Tôi học tiếng Trung.", tags: ["language"], frequencyLevel: "high" },
      { id: "w1d1-v9", hanzi: "为了", pinyin: "wèi le", vietnameseMeaning: "để, vì", synonyms: [], exampleZh: "为了去旅游。", exampleVi: "Để đi du lịch.", tags: ["conjunction"], frequencyLevel: "high" },
      { id: "w1d1-v10", hanzi: "旅游", pinyin: "lǚyóu", vietnameseMeaning: "du lịch", synonyms: ["旅行"], exampleZh: "我喜欢旅游。", exampleVi: "Tôi thích du lịch.", tags: ["travel"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "w1d1-s1", zh: "你好，我叫 ...", pinyin: "Nǐ hǎo, wǒ jiào ...", vi: "Xin chào, tôi tên là ..." },
      { id: "w1d1-s2", zh: "我是越南人。", pinyin: "Wǒ shì Yuènán rén.", vi: "Tôi là người Việt Nam." },
      { id: "w1d1-s3", zh: "我在学中文，为了去 ...", pinyin: "Wǒ zài xué Zhōngwén, wèi le qù ...", vi: "Tôi học tiếng Trung để đi ...", usageNoteVi: "Nói lý do học — du lịch / xem phim / đọc Xiaohongshu." },
      { id: "w1d1-s4", zh: "很高兴认识你。", pinyin: "Hěn gāoxìng rènshi nǐ.", vi: "Rất vui được làm quen.", usageNoteVi: "Đáp lễ khi vừa gặp." },
      { id: "w1d1-s5", zh: "你叫什么名字？", pinyin: "Nǐ jiào shénme míngzi?", vi: "Bạn tên là gì?" },
    ],
    dialogue: [
      { speaker: "A", zh: "你好，你叫什么名字？", pinyin: "Nǐ hǎo, nǐ jiào shénme míngzi?", vi: "Xin chào, bạn tên là gì?" },
      { speaker: "Vân Trang", zh: "你好，我叫云。我是越南人。", pinyin: "Nǐ hǎo, wǒ jiào Yún. Wǒ shì Yuènán rén.", vi: "Xin chào, tôi tên Vân. Tôi là người Việt Nam." },
      { speaker: "A", zh: "你为什么学中文？", pinyin: "Nǐ wèishéme xué Zhōngwén?", vi: "Bạn học tiếng Trung vì sao?" },
      { speaker: "Vân Trang", zh: "我学中文，为了去中国旅游和看中国电视剧。", pinyin: "Wǒ xué Zhōngwén, wèi le qù Zhōngguó lǚyóu hé kàn Zhōngguó diànshìjù.", vi: "Tôi học tiếng Trung để đi du lịch Trung Quốc và xem phim Trung." },
      { speaker: "A", zh: "很好啊！很高兴认识你。", pinyin: "Hěn hǎo a! Hěn gāoxìng rènshi nǐ.", vi: "Hay quá! Rất vui được làm quen." },
    ],
    roleplayScenario: {
      id: "w1d1-rp",
      titleVi: "Gặp người Trung trong tour Bắc Kinh",
      titleZh: "在北京旅行团里遇到中国游客",
      contextVi: "Trong tour Bắc Kinh, một du khách Trung ngồi cạnh hỏi bạn. Chào, giới thiệu tên + quốc tịch + lý do học tiếng Trung trong 3-4 câu.",
      aiRole: "Du khách Trung Quốc thân thiện",
      userRole: "Vân Trang — du khách Việt",
      targetPhrases: ["你好", "我叫", "越南人", "学中文", "为了"],
      difficulty: "easy",
    },
    quiz: [
      { id: "w1d1-q1", type: "vi_to_zh", prompt: "Bạn tên là gì?", answer: "你叫什么名字？" },
      { id: "w1d1-q2", type: "choose_pinyin", prompt: "认识", answer: "rènshi", options: ["rènshi", "rénshí", "rěnshī", "rēnshì"] },
      { id: "w1d1-q3", type: "complete_sentence", prompt: "我学中文，___ 去旅游。", answer: "为了", explanationVi: "为了 = để (mục đích)." },
      { id: "w1d1-q4", type: "zh_to_vi", prompt: "很高兴认识你。", answer: "Rất vui được làm quen." },
    ],
  },

  // ============================================================
  // Day 2 — Asking for directions and transport
  // ============================================================
  {
    id: "w1d2",
    week: 1,
    day: 2,
    titleZh: "问路和交通工具",
    titleVi: "Hỏi đường và phương tiện đi lại",
    objectiveVi: "Hỏi đường lịch sự + chọn metro / taxi / đi bộ.",
    durationMinutes: 18,
    vocabulary: [
      { id: "w1d2-v1", hanzi: "请问", pinyin: "qǐngwèn", vietnameseMeaning: "cho hỏi (lịch sự)", synonyms: [], exampleZh: "请问洗手间在哪？", exampleVi: "Cho hỏi WC ở đâu?", tags: ["polite"], frequencyLevel: "high" },
      { id: "w1d2-v2", hanzi: "怎么走", pinyin: "zěnme zǒu", vietnameseMeaning: "đi thế nào", synonyms: [], exampleZh: "故宫怎么走？", exampleVi: "Cố Cung đi thế nào?", tags: ["directions"], frequencyLevel: "high" },
      { id: "w1d2-v3", hanzi: "地铁", pinyin: "dìtiě", vietnameseMeaning: "tàu điện ngầm, metro", synonyms: [], exampleZh: "坐地铁去。", exampleVi: "Đi metro tới đó.", tags: ["transport"], frequencyLevel: "high" },
      { id: "w1d2-v4", hanzi: "出租车", pinyin: "chūzūchē", vietnameseMeaning: "taxi", synonyms: ["的士"], exampleZh: "叫一辆出租车。", exampleVi: "Gọi một xe taxi.", tags: ["transport"], frequencyLevel: "high" },
      { id: "w1d2-v5", hanzi: "几号线", pinyin: "jǐ hào xiàn", vietnameseMeaning: "metro số mấy", synonyms: [], exampleZh: "坐几号线？", exampleVi: "Đi tuyến số mấy?", tags: ["transport"], frequencyLevel: "high" },
      { id: "w1d2-v6", hanzi: "多远", pinyin: "duō yuǎn", vietnameseMeaning: "bao xa", synonyms: [], exampleZh: "离这里多远？", exampleVi: "Cách đây bao xa?", tags: ["directions"], frequencyLevel: "high" },
      { id: "w1d2-v7", hanzi: "走路", pinyin: "zǒu lù", vietnameseMeaning: "đi bộ", synonyms: [], exampleZh: "走路十分钟。", exampleVi: "Đi bộ 10 phút.", tags: ["transport"], frequencyLevel: "high" },
      { id: "w1d2-v8", hanzi: "分钟", pinyin: "fēnzhōng", vietnameseMeaning: "phút", synonyms: [], exampleZh: "十分钟。", exampleVi: "10 phút.", tags: ["time"], frequencyLevel: "high" },
      { id: "w1d2-v9", hanzi: "右边", pinyin: "yòubiān", vietnameseMeaning: "bên phải", synonyms: [], exampleZh: "在右边。", exampleVi: "Ở bên phải.", tags: ["directions"], frequencyLevel: "high" },
      { id: "w1d2-v10", hanzi: "前面", pinyin: "qiánmiàn", vietnameseMeaning: "phía trước", synonyms: [], exampleZh: "在前面。", exampleVi: "Ở phía trước.", tags: ["directions"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "w1d2-s1", zh: "请问，... 怎么走？", pinyin: "Qǐngwèn, ... zěnme zǒu?", vi: "Cho hỏi, ... đi thế nào?" },
      { id: "w1d2-s2", zh: "坐地铁几号线？", pinyin: "Zuò dìtiě jǐ hào xiàn?", vi: "Đi metro tuyến số mấy?" },
      { id: "w1d2-s3", zh: "大概要多长时间？", pinyin: "Dàgài yào duō cháng shíjiān?", vi: "Mất khoảng bao lâu?" },
      { id: "w1d2-s4", zh: "走路 ... 分钟。", pinyin: "Zǒu lù ... fēnzhōng.", vi: "Đi bộ ... phút." },
      { id: "w1d2-s5", zh: "在前面 / 右边。", pinyin: "Zài qiánmiàn / yòubiān.", vi: "Ở phía trước / bên phải." },
    ],
    dialogue: [
      { speaker: "Vân Trang", zh: "请问，到故宫怎么走？", pinyin: "Qǐngwèn, dào Gùgōng zěnme zǒu?", vi: "Cho hỏi, tới Cố Cung đi thế nào?" },
      { speaker: "Người đi đường", zh: "坐 1 号线，到天安门东站下。", pinyin: "Zuò 1 hào xiàn, dào Tiān'ānmén dōng zhàn xià.", vi: "Đi tuyến 1, xuống ga Thiên An Môn Đông." },
      { speaker: "Vân Trang", zh: "大概要多长时间？", pinyin: "Dàgài yào duō cháng shíjiān?", vi: "Mất khoảng bao lâu?" },
      { speaker: "Người đi đường", zh: "二十分钟左右，出来走路五分钟就到。", pinyin: "Èrshí fēnzhōng zuǒyòu, chūlái zǒu lù wǔ fēnzhōng jiù dào.", vi: "Khoảng 20 phút, ra ngoài đi bộ 5 phút là tới." },
      { speaker: "Vân Trang", zh: "好的，谢谢！", pinyin: "Hǎo de, xièxie!", vi: "Được, cảm ơn!" },
    ],
    roleplayScenario: {
      id: "w1d2-rp",
      titleVi: "Hỏi đường tới Bến Thượng Hải",
      titleZh: "问路去外滩",
      contextVi: "Bạn ở Nanjing Road, muốn tới Bến Thượng Hải (外滩). Hỏi 1 local đi metro số mấy, đi bộ có gần không.",
      aiRole: "Local Thượng Hải thân thiện",
      userRole: "Vân Trang — du khách",
      targetPhrases: ["请问", "怎么走", "几号线", "多远", "走路"],
      difficulty: "easy",
    },
    quiz: [
      { id: "w1d2-q1", type: "vi_to_zh", prompt: "Cho hỏi, tới khách sạn đi thế nào?", answer: "请问，到酒店怎么走？" },
      { id: "w1d2-q2", type: "choose_pinyin", prompt: "地铁", answer: "dìtiě", options: ["dìtiě", "dìtié", "dítiè", "díte"] },
      { id: "w1d2-q3", type: "complete_sentence", prompt: "坐地铁 ___ 线？", answer: "几号", explanationVi: "几号线 = tuyến số mấy." },
      { id: "w1d2-q4", type: "zh_to_vi", prompt: "走路十分钟就到。", answer: "Đi bộ 10 phút là tới." },
    ],
  },

  // ============================================================
  // Day 3 — Hotel check-in & check-out
  // ============================================================
  {
    id: "w1d3",
    week: 1,
    day: 3,
    titleZh: "酒店办理入住和退房",
    titleVi: "Nhận phòng và trả phòng khách sạn",
    objectiveVi: "Hoàn thành toàn bộ check-in + check-out + hỏi tiện ích cơ bản.",
    durationMinutes: 18,
    vocabulary: [
      { id: "w1d3-v1", hanzi: "办理入住", pinyin: "bànlǐ rùzhù", vietnameseMeaning: "làm thủ tục nhận phòng", synonyms: ["入住"], exampleZh: "我想办理入住。", exampleVi: "Tôi muốn làm thủ tục nhận phòng.", tags: ["hotel"], frequencyLevel: "high" },
      { id: "w1d3-v2", hanzi: "退房", pinyin: "tuìfáng", vietnameseMeaning: "trả phòng", synonyms: [], exampleZh: "几点退房？", exampleVi: "Mấy giờ trả phòng?", tags: ["hotel"], frequencyLevel: "high" },
      { id: "w1d3-v3", hanzi: "订单号", pinyin: "dìngdān hào", vietnameseMeaning: "mã đặt phòng", synonyms: [], exampleZh: "订单号 8821。", exampleVi: "Mã đặt 8821.", tags: ["hotel"], frequencyLevel: "high" },
      { id: "w1d3-v4", hanzi: "押金", pinyin: "yājīn", vietnameseMeaning: "tiền cọc", synonyms: [], exampleZh: "押金多少？", exampleVi: "Tiền cọc bao nhiêu?", tags: ["hotel"], frequencyLevel: "medium" },
      { id: "w1d3-v5", hanzi: "房卡", pinyin: "fáng kǎ", vietnameseMeaning: "thẻ phòng", synonyms: [], exampleZh: "房卡丢了。", exampleVi: "Mất thẻ phòng.", tags: ["hotel"], frequencyLevel: "medium" },
      { id: "w1d3-v6", hanzi: "Wi-Fi 密码", pinyin: "Wi-Fi mìmǎ", vietnameseMeaning: "mật khẩu Wi-Fi", synonyms: [], exampleZh: "Wi-Fi 密码是多少？", exampleVi: "Mật khẩu Wi-Fi là gì?", tags: ["hotel"], frequencyLevel: "high" },
      { id: "w1d3-v7", hanzi: "早餐", pinyin: "zǎocān", vietnameseMeaning: "bữa sáng", synonyms: [], exampleZh: "几点早餐？", exampleVi: "Mấy giờ ăn sáng?", tags: ["hotel"], frequencyLevel: "high" },
      { id: "w1d3-v8", hanzi: "几点", pinyin: "jǐ diǎn", vietnameseMeaning: "mấy giờ", synonyms: [], exampleZh: "几点退房？", exampleVi: "Mấy giờ trả phòng?", tags: ["time"], frequencyLevel: "high" },
      { id: "w1d3-v9", hanzi: "前台", pinyin: "qiántái", vietnameseMeaning: "lễ tân", synonyms: [], exampleZh: "去前台问。", exampleVi: "Tới lễ tân hỏi.", tags: ["hotel"], frequencyLevel: "medium" },
      { id: "w1d3-v10", hanzi: "护照", pinyin: "hùzhào", vietnameseMeaning: "hộ chiếu", synonyms: [], exampleZh: "请出示护照。", exampleVi: "Vui lòng xuất trình hộ chiếu.", tags: ["travel"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "w1d3-s1", zh: "您好，我想办理入住。", pinyin: "Nín hǎo, wǒ xiǎng bànlǐ rùzhù.", vi: "Chào anh/chị, tôi muốn làm thủ tục nhận phòng." },
      { id: "w1d3-s2", zh: "我的订单号是 ...", pinyin: "Wǒ de dìngdān hào shì ...", vi: "Mã đặt của tôi là ..." },
      { id: "w1d3-s3", zh: "请问 Wi-Fi 密码是多少？", pinyin: "Qǐngwèn Wi-Fi mìmǎ shì duōshǎo?", vi: "Cho hỏi mật khẩu Wi-Fi là gì?" },
      { id: "w1d3-s4", zh: "早餐几点开始？", pinyin: "Zǎocān jǐ diǎn kāishǐ?", vi: "Bữa sáng mấy giờ bắt đầu?" },
      { id: "w1d3-s5", zh: "明天几点退房？", pinyin: "Míngtiān jǐ diǎn tuìfáng?", vi: "Mai mấy giờ trả phòng?" },
    ],
    dialogue: [
      { speaker: "Vân Trang", zh: "您好，我想办理入住，订单号是 8821。", pinyin: "Nín hǎo, wǒ xiǎng bànlǐ rùzhù, dìngdān hào shì 8821.", vi: "Chào anh/chị, tôi muốn nhận phòng, mã đặt 8821." },
      { speaker: "Lễ tân", zh: "好的，请给我您的护照。押金是 200。", pinyin: "Hǎo de, qǐng gěi wǒ nín de hùzhào. Yājīn shì 200.", vi: "Được, vui lòng đưa hộ chiếu. Tiền cọc 200 tệ." },
      { speaker: "Vân Trang", zh: "请问 Wi-Fi 密码是多少？早餐几点？", pinyin: "Qǐngwèn Wi-Fi mìmǎ shì duōshǎo? Zǎocān jǐ diǎn?", vi: "Cho hỏi mật khẩu Wi-Fi? Mấy giờ ăn sáng?" },
      { speaker: "Lễ tân", zh: "Wi-Fi 是 hotel88，早餐 6:30 到 10:00。", pinyin: "Wi-Fi shì hotel88, zǎocān 6:30 dào 10:00.", vi: "Wi-Fi là hotel88, ăn sáng 6:30 đến 10:00." },
      { speaker: "Vân Trang", zh: "明天几点退房？", pinyin: "Míngtiān jǐ diǎn tuìfáng?", vi: "Mai mấy giờ trả phòng?" },
      { speaker: "Lễ tân", zh: "中午 12 点之前都可以。", pinyin: "Zhōngwǔ 12 diǎn zhīqián dōu kěyǐ.", vi: "Trước 12h trưa đều được." },
    ],
    roleplayScenario: {
      id: "w1d3-rp",
      titleVi: "Check-in khách sạn boutique",
      titleZh: "在精品酒店办理入住",
      contextVi: "Tới khách sạn boutique ở Tô Châu. Đưa hộ chiếu, đặt mã, hỏi Wi-Fi + sáng + giờ trả phòng.",
      aiRole: "Lễ tân khách sạn",
      userRole: "Vân Trang — khách",
      targetPhrases: ["办理入住", "订单号", "Wi-Fi 密码", "早餐", "退房"],
      difficulty: "easy",
    },
    quiz: [
      { id: "w1d3-q1", type: "vi_to_zh", prompt: "Tôi muốn nhận phòng.", answer: "我想办理入住。" },
      { id: "w1d3-q2", type: "choose_pinyin", prompt: "退房", answer: "tuìfáng", options: ["tuìfáng", "tuīfǎng", "tuǐfàng", "tuīfáng"] },
      { id: "w1d3-q3", type: "complete_sentence", prompt: "请问 Wi-Fi ___ 是多少？", answer: "密码", explanationVi: "密码 = mật khẩu." },
      { id: "w1d3-q4", type: "zh_to_vi", prompt: "明天 12 点之前都可以退房。", answer: "Mai trước 12 giờ đều có thể trả phòng." },
    ],
  },

  // ============================================================
  // Day 4 — Ordering food & saying "not spicy"
  // ============================================================
  {
    id: "w1d4",
    week: 1,
    day: 4,
    titleZh: "点菜和说不要辣",
    titleVi: "Gọi món và nói 'không cay'",
    objectiveVi: "Gọi món bình tĩnh, nói rõ kiêng cay / rau mùi, hỏi gợi ý, tính tiền.",
    durationMinutes: 20,
    vocabulary: [
      { id: "w1d4-v1", hanzi: "服务员", pinyin: "fúwùyuán", vietnameseMeaning: "nhân viên phục vụ", synonyms: [], exampleZh: "服务员，买单！", exampleVi: "Bạn ơi, tính tiền!", tags: ["food"], frequencyLevel: "high" },
      { id: "w1d4-v2", hanzi: "菜单", pinyin: "càidān", vietnameseMeaning: "thực đơn", synonyms: [], exampleZh: "请给我菜单。", exampleVi: "Cho tôi thực đơn.", tags: ["food"], frequencyLevel: "high" },
      { id: "w1d4-v3", hanzi: "点菜", pinyin: "diǎn cài", vietnameseMeaning: "gọi món", synonyms: [], exampleZh: "可以点菜了。", exampleVi: "Gọi món được rồi.", tags: ["food"], frequencyLevel: "high" },
      { id: "w1d4-v4", hanzi: "推荐", pinyin: "tuījiàn", vietnameseMeaning: "gợi ý, đề xuất", synonyms: [], exampleZh: "推荐一道菜。", exampleVi: "Gợi ý 1 món đi.", tags: ["food"], frequencyLevel: "high" },
      { id: "w1d4-v5", hanzi: "不要辣", pinyin: "bù yào là", vietnameseMeaning: "không cay", synonyms: ["不辣"], exampleZh: "我不要辣。", exampleVi: "Tôi không ăn cay.", tags: ["food"], frequencyLevel: "high" },
      { id: "w1d4-v6", hanzi: "不要香菜", pinyin: "bù yào xiāngcài", vietnameseMeaning: "không rau mùi", synonyms: [], exampleZh: "不要香菜。", exampleVi: "Không rau mùi.", tags: ["food"], frequencyLevel: "high" },
      { id: "w1d4-v7", hanzi: "米饭", pinyin: "mǐfàn", vietnameseMeaning: "cơm", synonyms: [], exampleZh: "来一份米饭。", exampleVi: "Cho 1 phần cơm.", tags: ["food"], frequencyLevel: "high" },
      { id: "w1d4-v8", hanzi: "汤", pinyin: "tāng", vietnameseMeaning: "canh", synonyms: [], exampleZh: "一碗汤。", exampleVi: "1 bát canh.", tags: ["food"], frequencyLevel: "high" },
      { id: "w1d4-v9", hanzi: "打包", pinyin: "dǎbāo", vietnameseMeaning: "gói mang về", synonyms: [], exampleZh: "剩的打包。", exampleVi: "Đồ thừa gói về.", tags: ["food"], frequencyLevel: "high" },
      { id: "w1d4-v10", hanzi: "请买单", pinyin: "qǐng mǎidān", vietnameseMeaning: "vui lòng tính tiền", synonyms: ["结账"], exampleZh: "请买单。", exampleVi: "Vui lòng tính tiền.", tags: ["food", "polite"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "w1d4-s1", zh: "请给我菜单。", pinyin: "Qǐng gěi wǒ càidān.", vi: "Cho tôi xin thực đơn." },
      { id: "w1d4-s2", zh: "推荐一道不太辣的菜。", pinyin: "Tuījiàn yī dào bù tài là de cài.", vi: "Gợi ý 1 món không cay lắm." },
      { id: "w1d4-s3", zh: "我不要辣，也不要香菜。", pinyin: "Wǒ bù yào là, yě bù yào xiāngcài.", vi: "Tôi không ăn cay, cũng không rau mùi." },
      { id: "w1d4-s4", zh: "剩的打包，谢谢。", pinyin: "Shèng de dǎbāo, xièxie.", vi: "Đồ thừa gói về, cảm ơn." },
      { id: "w1d4-s5", zh: "请买单。", pinyin: "Qǐng mǎidān.", vi: "Vui lòng tính tiền." },
    ],
    dialogue: [
      { speaker: "Vân Trang", zh: "服务员，请给我菜单。", pinyin: "Fúwùyuán, qǐng gěi wǒ càidān.", vi: "Bạn ơi, cho xin thực đơn." },
      { speaker: "Phục vụ", zh: "好的，请稍等。", pinyin: "Hǎo de, qǐng shāo děng.", vi: "Được, đợi chút." },
      { speaker: "Vân Trang", zh: "推荐一道不太辣的菜，我们两个不能吃辣。", pinyin: "Tuījiàn yī dào bù tài là de cài, wǒmen liǎng ge bù néng chī là.", vi: "Gợi ý 1 món không cay, 2 đứa em không ăn cay được." },
      { speaker: "Phục vụ", zh: "鱼香肉丝微辣，配米饭最好。", pinyin: "Yú xiāng ròu sī wēi là, pèi mǐfàn zuì hǎo.", vi: "Thịt xào Ngư Hương hơi cay, ăn với cơm là tốt nhất." },
      { speaker: "Vân Trang", zh: "好，再来一份米饭和一碗汤。", pinyin: "Hǎo, zài lái yī fèn mǐfàn hé yī wǎn tāng.", vi: "Được, thêm 1 cơm + 1 canh." },
      { speaker: "Vân Trang", zh: "剩的打包，请买单。", pinyin: "Shèng de dǎbāo, qǐng mǎidān.", vi: "Đồ thừa gói về, vui lòng tính tiền." },
    ],
    roleplayScenario: {
      id: "w1d4-rp",
      titleVi: "Gọi món quán Tứ Xuyên",
      titleZh: "在四川餐厅点菜",
      contextVi: "Bạn vào quán Tứ Xuyên. Phục vụ gợi ý món cay. Bạn từ chối, đổi món, kêu thêm cơm + canh, cuối cùng đóng gói + thanh toán.",
      aiRole: "Phục vụ quán Tứ Xuyên",
      userRole: "Vân Trang — khách",
      targetPhrases: ["菜单", "推荐", "不要辣", "打包", "请买单"],
      difficulty: "medium",
    },
    quiz: [
      { id: "w1d4-q1", type: "vi_to_zh", prompt: "Tôi không ăn cay.", answer: "我不要辣。" },
      { id: "w1d4-q2", type: "choose_pinyin", prompt: "打包", answer: "dǎbāo", options: ["dǎbāo", "dábǎo", "dàbǎo", "dāpāo"] },
      { id: "w1d4-q3", type: "complete_sentence", prompt: "请 ___ 一道不太辣的菜。", answer: "推荐", explanationVi: "推荐 = gợi ý / đề xuất." },
      { id: "w1d4-q4", type: "zh_to_vi", prompt: "剩的打包，请买单。", answer: "Đồ thừa gói về, vui lòng tính tiền." },
    ],
  },

  // ============================================================
  // Day 5 — Shopping, price, polite bargaining
  // ============================================================
  {
    id: "w1d5",
    week: 1,
    day: 5,
    titleZh: "购物、问价和礼貌砍价",
    titleVi: "Mua sắm, hỏi giá và mặc cả lịch sự",
    objectiveVi: "Hỏi giá, thử đồ, mặc cả văn minh, thanh toán bằng WeChat Pay.",
    durationMinutes: 20,
    vocabulary: [
      { id: "w1d5-v1", hanzi: "多少钱", pinyin: "duōshǎo qián", vietnameseMeaning: "bao nhiêu tiền", synonyms: [], exampleZh: "这个多少钱？", exampleVi: "Cái này bao nhiêu?", tags: ["shopping"], frequencyLevel: "high" },
      { id: "w1d5-v2", hanzi: "便宜点", pinyin: "piányi diǎn", vietnameseMeaning: "rẻ hơn chút", synonyms: [], exampleZh: "便宜点行吗？", exampleVi: "Bớt chút được không?", tags: ["shopping"], frequencyLevel: "high" },
      { id: "w1d5-v3", hanzi: "太贵了", pinyin: "tài guì le", vietnameseMeaning: "đắt quá", synonyms: [], exampleZh: "太贵了。", exampleVi: "Đắt quá.", tags: ["shopping"], frequencyLevel: "high" },
      { id: "w1d5-v4", hanzi: "试穿", pinyin: "shìchuān", vietnameseMeaning: "mặc thử", synonyms: [], exampleZh: "我能试穿吗？", exampleVi: "Thử được không?", tags: ["shopping"], frequencyLevel: "medium" },
      { id: "w1d5-v5", hanzi: "颜色", pinyin: "yánsè", vietnameseMeaning: "màu sắc", synonyms: [], exampleZh: "有别的颜色吗？", exampleVi: "Có màu khác không?", tags: ["shopping"], frequencyLevel: "high" },
      { id: "w1d5-v6", hanzi: "号", pinyin: "hào", vietnameseMeaning: "cỡ (S/M/L)", synonyms: ["尺码"], exampleZh: "有大一号吗？", exampleVi: "Có cỡ lớn hơn không?", tags: ["shopping"], frequencyLevel: "high" },
      { id: "w1d5-v7", hanzi: "微信支付", pinyin: "Wēixìn zhīfù", vietnameseMeaning: "WeChat Pay", synonyms: [], exampleZh: "可以微信支付吗？", exampleVi: "Trả WeChat Pay được không?", tags: ["payment"], frequencyLevel: "high" },
      { id: "w1d5-v8", hanzi: "扫码", pinyin: "sǎo mǎ", vietnameseMeaning: "quét mã QR", synonyms: [], exampleZh: "扫码支付。", exampleVi: "Quét mã thanh toán.", tags: ["payment"], frequencyLevel: "high" },
      { id: "w1d5-v9", hanzi: "现金", pinyin: "xiànjīn", vietnameseMeaning: "tiền mặt", synonyms: [], exampleZh: "现金可以吗？", exampleVi: "Tiền mặt được không?", tags: ["payment"], frequencyLevel: "medium" },
      { id: "w1d5-v10", hanzi: "礼物", pinyin: "lǐwù", vietnameseMeaning: "quà", synonyms: [], exampleZh: "买礼物。", exampleVi: "Mua quà.", tags: ["shopping"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "w1d5-s1", zh: "这个多少钱？", pinyin: "Zhège duōshǎo qián?", vi: "Cái này bao nhiêu tiền?" },
      { id: "w1d5-s2", zh: "太贵了，便宜点行吗？", pinyin: "Tài guì le, piányi diǎn xíng ma?", vi: "Đắt quá, bớt chút được không?", usageNoteVi: "Mặc cả ở chợ. KHÔNG dùng ở mall." },
      { id: "w1d5-s3", zh: "我能试穿吗？", pinyin: "Wǒ néng shìchuān ma?", vi: "Tôi có thể mặc thử không?" },
      { id: "w1d5-s4", zh: "有别的颜色 / 大一号吗？", pinyin: "Yǒu bié de yánsè / dà yī hào ma?", vi: "Có màu khác / cỡ lớn hơn không?" },
      { id: "w1d5-s5", zh: "可以微信支付吗？", pinyin: "Kěyǐ Wēixìn zhīfù ma?", vi: "Trả WeChat Pay được không?" },
    ],
    dialogue: [
      { speaker: "Vân Trang", zh: "老板，这条丝巾多少钱？", pinyin: "Lǎobǎn, zhè tiáo sījīn duōshǎo qián?", vi: "Anh chủ, khăn này bao nhiêu?" },
      { speaker: "Chủ sạp", zh: "250。这是真丝的。", pinyin: "250. Zhè shì zhēn sī de.", vi: "250. Đây là lụa thật." },
      { speaker: "Vân Trang", zh: "太贵了，便宜点行吗？180 怎么样？", pinyin: "Tài guì le, piányi diǎn xíng ma? 180 zěnmeyàng?", vi: "Đắt quá, bớt chút được không? 180 nhé?" },
      { speaker: "Chủ sạp", zh: "200 吧，最低价。", pinyin: "200 ba, zuì dī jià.", vi: "200 đi, giá thấp nhất." },
      { speaker: "Vân Trang", zh: "好，190 我就拿。可以微信支付吗？", pinyin: "Hǎo, 190 wǒ jiù ná. Kěyǐ Wēixìn zhīfù ma?", vi: "OK, 190 em lấy. Trả WeChat Pay được không?" },
      { speaker: "Chủ sạp", zh: "可以，扫这个码。", pinyin: "Kěyǐ, sǎo zhège mǎ.", vi: "Được, quét mã này." },
    ],
    roleplayScenario: {
      id: "w1d5-rp",
      titleVi: "Mặc cả khăn lụa ở chợ đêm Tây An",
      titleZh: "在西安夜市砍价买丝巾",
      contextVi: "Bạn ở chợ đêm Tây An. Chủ sạp đòi 250. Mặc cả xuống 180-200, thanh toán bằng WeChat Pay.",
      aiRole: "Chủ sạp chợ đêm",
      userRole: "Vân Trang — khách du lịch",
      targetPhrases: ["多少钱", "太贵了", "便宜点", "微信支付"],
      difficulty: "medium",
    },
    quiz: [
      { id: "w1d5-q1", type: "vi_to_zh", prompt: "Cái này bao nhiêu tiền?", answer: "这个多少钱？" },
      { id: "w1d5-q2", type: "choose_pinyin", prompt: "便宜", answer: "piányi", options: ["piányi", "piányí", "biànyi", "piànyi"] },
      { id: "w1d5-q3", type: "complete_sentence", prompt: "太贵了，___ 点行吗？", answer: "便宜", explanationVi: "便宜 = rẻ; 便宜点 = bớt chút." },
      { id: "w1d5-q4", type: "zh_to_vi", prompt: "可以微信支付吗？", answer: "Trả WeChat Pay được không?" },
    ],
  },

  // ============================================================
  // Day 6 — Watching Chinese drama, common emotional phrases
  // ============================================================
  {
    id: "w1d6",
    week: 1,
    day: 6,
    titleZh: "看中国电视剧和常用情感表达",
    titleVi: "Xem phim Trung và cụm cảm xúc thường gặp",
    objectiveVi: "Nghe hiểu 10 cụm cảm xúc kinh điển trong drama (心疼, 委屈, 算了, 真香, 破防…) + nói về phim với bạn.",
    durationMinutes: 18,
    vocabulary: [
      { id: "w1d6-v1", hanzi: "电视剧", pinyin: "diànshìjù", vietnameseMeaning: "phim truyền hình", synonyms: ["剧"], exampleZh: "我喜欢看电视剧。", exampleVi: "Tôi thích xem phim truyền hình.", tags: ["drama"], frequencyLevel: "high" },
      { id: "w1d6-v2", hanzi: "好看", pinyin: "hǎokàn", vietnameseMeaning: "đẹp / hay (phim)", synonyms: [], exampleZh: "这剧很好看。", exampleVi: "Phim này hay.", tags: ["drama"], frequencyLevel: "high" },
      { id: "w1d6-v3", hanzi: "颜值", pinyin: "yánzhí", vietnameseMeaning: "nhan sắc (slang)", synonyms: [], exampleZh: "颜值高。", exampleVi: "Nhan sắc cao.", tags: ["drama", "slang"], frequencyLevel: "high" },
      { id: "w1d6-v4", hanzi: "演员", pinyin: "yǎnyuán", vietnameseMeaning: "diễn viên", synonyms: [], exampleZh: "我喜欢这个演员。", exampleVi: "Tôi thích diễn viên này.", tags: ["drama"], frequencyLevel: "high" },
      { id: "w1d6-v5", hanzi: "心疼", pinyin: "xīnténg", vietnameseMeaning: "đau lòng, thương xót", synonyms: [], exampleZh: "好心疼她。", exampleVi: "Thương cô ấy quá.", tags: ["emotion"], frequencyLevel: "high" },
      { id: "w1d6-v6", hanzi: "委屈", pinyin: "wěiqu", vietnameseMeaning: "tủi thân, ấm ức", synonyms: [], exampleZh: "她好委屈。", exampleVi: "Cô ấy ấm ức quá.", tags: ["emotion"], frequencyLevel: "high" },
      { id: "w1d6-v7", hanzi: "算了", pinyin: "suàn le", vietnameseMeaning: "thôi đi, bỏ qua", synonyms: [], exampleZh: "算了，不说了。", exampleVi: "Thôi, không nói nữa.", tags: ["emotion"], frequencyLevel: "high" },
      { id: "w1d6-v8", hanzi: "破防", pinyin: "pòfáng", vietnameseMeaning: "tan chảy / xúc động (slang)", synonyms: [], exampleZh: "我破防了。", exampleVi: "Tôi tan chảy rồi.", tags: ["emotion", "slang"], frequencyLevel: "medium" },
      { id: "w1d6-v9", hanzi: "追剧", pinyin: "zhuī jù", vietnameseMeaning: "đuổi phim / theo dõi drama", synonyms: [], exampleZh: "最近在追剧。", exampleVi: "Dạo này đang đuổi phim.", tags: ["drama"], frequencyLevel: "high" },
      { id: "w1d6-v10", hanzi: "下集", pinyin: "xià jí", vietnameseMeaning: "tập sau", synonyms: [], exampleZh: "下集见！", exampleVi: "Hẹn tập sau!", tags: ["drama"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "w1d6-s1", zh: "这剧太好看了！", pinyin: "Zhè jù tài hǎokàn le!", vi: "Phim này hay quá!" },
      { id: "w1d6-s2", zh: "颜值在线，演员演得也好。", pinyin: "Yánzhí zài xiàn, yǎnyuán yǎn de yě hǎo.", vi: "Diễn viên đẹp, mà diễn cũng hay." },
      { id: "w1d6-s3", zh: "我看完哭了，太心疼她了。", pinyin: "Wǒ kàn wán kū le, tài xīnténg tā le.", vi: "Tôi xem xong khóc luôn, thương cô ấy quá." },
      { id: "w1d6-s4", zh: "破防了，等下集！", pinyin: "Pòfáng le, děng xià jí!", vi: "Tan chảy luôn, đợi tập sau!" },
      { id: "w1d6-s5", zh: "你也在追这部剧吗？", pinyin: "Nǐ yě zài zhuī zhè bù jù ma?", vi: "Bạn cũng đang đuổi phim này à?" },
    ],
    dialogue: [
      { speaker: "Bạn", zh: "你最近在追什么剧？", pinyin: "Nǐ zuìjìn zài zhuī shénme jù?", vi: "Dạo này bạn đuổi phim gì?" },
      { speaker: "Vân Trang", zh: "我在追《知否》，太好看了！", pinyin: "Wǒ zài zhuī 《Zhī Fǒu》, tài hǎokàn le!", vi: "Tôi đang đuổi 'Tri Phủ', hay lắm!" },
      { speaker: "Bạn", zh: "颜值在线吗？演员是谁？", pinyin: "Yánzhí zài xiàn ma? Yǎnyuán shì shéi?", vi: "Diễn viên đẹp không? Là ai đóng?" },
      { speaker: "Vân Trang", zh: "颜值绝绝子，赵丽颖演的，演技超好。", pinyin: "Yánzhí juéjuézǐ, Zhào Lìyǐng yǎn de, yǎnjì chāo hǎo.", vi: "Nhan sắc tuyệt cú mèo, Triệu Lệ Dĩnh đóng, diễn xuất siêu hay." },
      { speaker: "Bạn", zh: "我也想看了，破防了哈哈。", pinyin: "Wǒ yě xiǎng kàn le, pòfáng le hāhā.", vi: "Tôi cũng muốn xem rồi, tan chảy luôn haha." },
    ],
    roleplayScenario: {
      id: "w1d6-rp",
      titleVi: "Tâm sự về drama đang xem",
      titleZh: "和朋友聊在追的剧",
      contextVi: "Bạn nhắn bạn thân Trung Quốc về drama đang xem. Khen diễn viên, kể đoạn xúc động, dùng 心疼 + 破防 + 颜值.",
      aiRole: "Bạn thân Trung Quốc — fan drama",
      userRole: "Vân Trang — chia sẻ",
      targetPhrases: ["好看", "颜值", "心疼", "破防", "下集"],
      difficulty: "easy",
    },
    quiz: [
      { id: "w1d6-q1", type: "vi_to_zh", prompt: "Phim này hay quá!", answer: "这剧太好看了！" },
      { id: "w1d6-q2", type: "choose_pinyin", prompt: "心疼", answer: "xīnténg", options: ["xīnténg", "xìntèng", "xīntēng", "xīntěng"] },
      { id: "w1d6-q3", type: "complete_sentence", prompt: "我看完哭了，太 ___ 她了。", answer: "心疼", explanationVi: "心疼 = thương xót / đau lòng." },
      { id: "w1d6-q4", type: "zh_to_vi", prompt: "你也在追这部剧吗？", answer: "Bạn cũng đang đuổi phim này à?" },
    ],
  },

  // ============================================================
  // Day 7 — Review role-play: one day traveling in China
  // ============================================================
  {
    id: "w1d7",
    week: 1,
    day: 7,
    titleZh: "回顾：在中国旅游的一天",
    titleVi: "Ôn tập: một ngày đi du lịch Trung Quốc",
    objectiveVi: "Ghép tất cả: check-in khách sạn → hỏi đường → ăn trưa → mua sắm → kể bạn nghe.",
    durationMinutes: 22,
    vocabulary: [
      { id: "w1d7-v1", hanzi: "今天", pinyin: "jīntiān", vietnameseMeaning: "hôm nay", synonyms: [], exampleZh: "今天天气好。", exampleVi: "Hôm nay thời tiết đẹp.", tags: ["time"], frequencyLevel: "high" },
      { id: "w1d7-v2", hanzi: "早上", pinyin: "zǎoshang", vietnameseMeaning: "buổi sáng", synonyms: [], exampleZh: "早上 8 点。", exampleVi: "8 giờ sáng.", tags: ["time"], frequencyLevel: "high" },
      { id: "w1d7-v3", hanzi: "中午", pinyin: "zhōngwǔ", vietnameseMeaning: "buổi trưa", synonyms: [], exampleZh: "中午吃面。", exampleVi: "Trưa ăn mì.", tags: ["time"], frequencyLevel: "high" },
      { id: "w1d7-v4", hanzi: "下午", pinyin: "xiàwǔ", vietnameseMeaning: "buổi chiều", synonyms: [], exampleZh: "下午去购物。", exampleVi: "Chiều đi mua sắm.", tags: ["time"], frequencyLevel: "high" },
      { id: "w1d7-v5", hanzi: "晚上", pinyin: "wǎnshang", vietnameseMeaning: "buổi tối", synonyms: [], exampleZh: "晚上看剧。", exampleVi: "Tối xem phim.", tags: ["time"], frequencyLevel: "high" },
      { id: "w1d7-v6", hanzi: "先 ... 然后 ...", pinyin: "xiān ... ránhòu ...", vietnameseMeaning: "trước ... rồi ...", synonyms: [], exampleZh: "先吃饭然后逛街。", exampleVi: "Trước ăn cơm, rồi đi dạo.", tags: ["connector"], frequencyLevel: "high" },
      { id: "w1d7-v7", hanzi: "累", pinyin: "lèi", vietnameseMeaning: "mệt", synonyms: [], exampleZh: "今天太累了。", exampleVi: "Hôm nay mệt quá.", tags: ["emotion"], frequencyLevel: "high" },
      { id: "w1d7-v8", hanzi: "开心", pinyin: "kāixīn", vietnameseMeaning: "vui, hạnh phúc", synonyms: ["高兴"], exampleZh: "今天好开心。", exampleVi: "Hôm nay vui quá.", tags: ["emotion"], frequencyLevel: "high" },
      { id: "w1d7-v9", hanzi: "拍照", pinyin: "pāizhào", vietnameseMeaning: "chụp ảnh", synonyms: [], exampleZh: "帮我拍照。", exampleVi: "Chụp ảnh cho mình.", tags: ["travel"], frequencyLevel: "high" },
      { id: "w1d7-v10", hanzi: "想 ...", pinyin: "xiǎng ...", vietnameseMeaning: "muốn ...", synonyms: [], exampleZh: "我想再去一次。", exampleVi: "Tôi muốn đi lại 1 lần nữa.", tags: ["verb"], frequencyLevel: "high" },
    ],
    sentencePatterns: [
      { id: "w1d7-s1", zh: "今天早上我办理入住，然后去 ...", pinyin: "Jīntiān zǎoshang wǒ bànlǐ rùzhù, ránhòu qù ...", vi: "Sáng nay tôi nhận phòng, rồi đi ..." },
      { id: "w1d7-s2", zh: "中午吃了 ...，下午去 ...", pinyin: "Zhōngwǔ chī le ..., xiàwǔ qù ...", vi: "Trưa ăn ..., chiều đi ..." },
      { id: "w1d7-s3", zh: "晚上回酒店看剧，特别开心。", pinyin: "Wǎnshang huí jiǔdiàn kàn jù, tèbié kāixīn.", vi: "Tối về khách sạn xem phim, vui ơi là vui." },
      { id: "w1d7-s4", zh: "虽然累，但是很值得。", pinyin: "Suīrán lèi, dànshì hěn zhídé.", vi: "Tuy mệt, nhưng rất đáng." },
      { id: "w1d7-s5", zh: "我想再去一次。", pinyin: "Wǒ xiǎng zài qù yī cì.", vi: "Tôi muốn đi lại 1 lần nữa." },
    ],
    dialogue: [
      { speaker: "Bạn", zh: "你昨天在北京玩得怎么样？", pinyin: "Nǐ zuótiān zài Běijīng wán de zěnmeyàng?", vi: "Hôm qua bạn chơi ở Bắc Kinh thế nào?" },
      { speaker: "Vân Trang", zh: "早上我办理入住，然后坐地铁去故宫。", pinyin: "Zǎoshang wǒ bànlǐ rùzhù, ránhòu zuò dìtiě qù Gùgōng.", vi: "Sáng tôi nhận phòng, rồi đi metro tới Cố Cung." },
      { speaker: "Vân Trang", zh: "中午吃了一碗炸酱面，下午去王府井购物。", pinyin: "Zhōngwǔ chī le yī wǎn zhájiàng miàn, xiàwǔ qù Wángfǔjǐng gòuwù.", vi: "Trưa ăn 1 bát mì tương đen, chiều đi mua sắm ở Vương Phủ Tỉnh." },
      { speaker: "Vân Trang", zh: "晚上回酒店看剧，特别开心。", pinyin: "Wǎnshang huí jiǔdiàn kàn jù, tèbié kāixīn.", vi: "Tối về khách sạn xem phim, vui ơi là vui." },
      { speaker: "Bạn", zh: "太棒了！下次我也要去。", pinyin: "Tài bàng le! Xià cì wǒ yě yào qù.", vi: "Tuyệt vời! Lần sau tôi cũng phải đi." },
    ],
    roleplayScenario: {
      id: "w1d7-rp",
      titleVi: "Kể lại 1 ngày du lịch ở Bắc Kinh cho bạn nghe",
      titleZh: "向朋友讲述在北京旅游的一天",
      contextVi: "Bạn vừa từ Bắc Kinh về. Kể bạn thân Trung 5-6 câu: sáng làm gì, trưa ăn gì, chiều/tối ở đâu, cảm xúc.",
      aiRole: "Bạn thân Trung Quốc — hỏi chi tiết",
      userRole: "Vân Trang — kể chuyện",
      targetPhrases: ["早上", "然后", "中午", "下午", "晚上", "开心"],
      difficulty: "medium",
    },
    quiz: [
      { id: "w1d7-q1", type: "vi_to_zh", prompt: "Sáng nay tôi nhận phòng, rồi đi Cố Cung.", answer: "今天早上我办理入住，然后去故宫。" },
      { id: "w1d7-q2", type: "choose_pinyin", prompt: "开心", answer: "kāixīn", options: ["kāixīn", "kāixìn", "kǎixīn", "kǎixǐn"] },
      { id: "w1d7-q3", type: "complete_sentence", prompt: "虽然累，___ 很值得。", answer: "但是", explanationVi: "虽然 ... 但是 ... = mặc dù ... nhưng ..." },
      { id: "w1d7-q4", type: "zh_to_vi", prompt: "我想再去一次。", answer: "Tôi muốn đi lại 1 lần nữa." },
    ],
  },
];
