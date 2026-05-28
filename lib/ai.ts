import type {
  CorrectionResult,
  ErrorType,
  LyricsAnalysis,
  LyricsLine,
  WeChatCoachResult,
  WeChatTone,
  VocabularyItem,
} from "./types";
import {
  TUTOR_SYSTEM_PROMPT,
  buildCorrectionPrompt,
  buildLessonPrompt,
  buildLyricsAnalyzePrompt,
  buildRoleplayTurnPrompt,
  buildWeChatCoachPrompt,
} from "./prompts";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_TIMEOUT_MS = 25_000;

function hasApiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim());
}

async function callOpenAI(userPrompt: string, system = TUTOR_SYSTEM_PROMPT): Promise<string> {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);
  try {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: userPrompt },
        ],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenAI error ${res.status}: ${text}`);
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") throw new Error("OpenAI returned no content");
    return content;
  } catch (err) {
    if ((err as Error)?.name === "AbortError") {
      throw new Error(`OpenAI request timed out after ${OPENAI_TIMEOUT_MS}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

function stripJsonFence(raw: string): string {
  return raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function safeParseJson<T>(raw: string): T | null {
  const cleaned = stripJsonFence(raw);
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    } catch {
      return null;
    }
  }
}

export async function correctSentence(userSentence: string, context = ""): Promise<CorrectionResult> {
  if (!hasApiKey()) return mockCorrection(userSentence, context);
  try {
    const raw = await callOpenAI(buildCorrectionPrompt(userSentence, context));
    const parsed = safeParseJson<CorrectionResult>(raw);
    if (!parsed) return mockCorrection(userSentence, context);
    return normalizeCorrection(parsed, userSentence);
  } catch (err) {
    console.error("[ai.correctSentence] falling back to mock:", err);
    return mockCorrection(userSentence, context);
  }
}

export async function generateLesson(day: number, topic: string) {
  if (!hasApiKey()) return mockLesson(day, topic);
  try {
    const raw = await callOpenAI(buildLessonPrompt(day, topic));
    const parsed = safeParseJson<Record<string, unknown>>(raw);
    if (!parsed) return mockLesson(day, topic);
    return normalizeGeneratedLesson(parsed, day, topic);
  } catch (err) {
    console.error("[ai.generateLesson] falling back to mock:", err);
    return mockLesson(day, topic);
  }
}

function isArr(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

function normalizeGeneratedLesson(input: Record<string, unknown>, day: number, topic: string) {
  return {
    id: typeof input.id === "string" ? input.id : `ai-day-${day}`,
    week: typeof input.week === "number" ? input.week : Math.ceil(day / 7),
    day,
    titleZh: typeof input.titleZh === "string" ? input.titleZh : `第 ${day} 课`,
    titleVi: typeof input.titleVi === "string" ? input.titleVi : `Bài ${day}: ${topic}`,
    objectiveVi: typeof input.objectiveVi === "string" ? input.objectiveVi : "",
    durationMinutes: typeof input.durationMinutes === "number" ? input.durationMinutes : 20,
    vocabulary: isArr(input.vocabulary) ? input.vocabulary : [],
    sentencePatterns: isArr(input.sentencePatterns) ? input.sentencePatterns : [],
    dialogue: isArr(input.dialogue) ? input.dialogue : [],
    roleplayScenario: input.roleplayScenario ?? null,
    quiz: isArr(input.quiz) ? input.quiz : [],
  };
}

export async function wechatCoach(userInput: string): Promise<WeChatCoachResult> {
  if (!hasApiKey()) return mockWeChatCoach(userInput);
  try {
    const raw = await callOpenAI(buildWeChatCoachPrompt(userInput));
    const parsed = safeParseJson<Partial<WeChatCoachResult>>(raw);
    const normalized = normalizeWeChatCoach(parsed, userInput);
    if (!normalized) return mockWeChatCoach(userInput);
    return normalized;
  } catch (err) {
    console.error("[ai.wechatCoach] falling back to mock:", err);
    return mockWeChatCoach(userInput);
  }
}

function normalizeWeChatCoach(
  input: Partial<WeChatCoachResult> | null,
  fallbackInput: string,
): WeChatCoachResult | null {
  if (!input || typeof input !== "object") return null;
  const allowedTones: WeChatTone[] = ["friendly", "polite", "firm"];
  const versions = Array.isArray(input.versions)
    ? input.versions
        .filter((v): v is WeChatCoachResult["versions"][number] =>
          !!v &&
          typeof (v as any).zh === "string" &&
          allowedTones.includes((v as any).tone),
        )
        .map((v) => ({
          zh: String(v.zh).trim(),
          pinyin: typeof v.pinyin === "string" ? v.pinyin.trim() : "",
          vi: typeof v.vi === "string" ? v.vi.trim() : "",
          tone: v.tone as WeChatTone,
          usageNoteVi: typeof v.usageNoteVi === "string" ? v.usageNoteVi : "",
          riskNoteVi: typeof v.riskNoteVi === "string" ? v.riskNoteVi : "",
        }))
    : [];
  if (versions.length === 0) return null;

  const clampScore = (n: unknown): number | undefined => {
    if (typeof n !== "number" || !Number.isFinite(n)) return undefined;
    return Math.max(1, Math.min(10, Math.round(n)));
  };
  const suggestedVocabulary = Array.isArray(input.suggestedVocabulary)
    ? input.suggestedVocabulary
        .filter(
          (v): v is { hanzi: string; pinyin: string; vi: string } =>
            !!v && typeof (v as any).hanzi === "string",
        )
        .slice(0, 5)
        .map((v) => ({
          hanzi: String(v.hanzi).trim(),
          pinyin: typeof v.pinyin === "string" ? v.pinyin.trim() : "",
          vi: typeof v.vi === "string" ? v.vi.trim() : "",
        }))
    : undefined;

  const vocab: VocabularyItem[] = Array.isArray(input.keyVocabulary)
    ? input.keyVocabulary
        .filter((v): v is VocabularyItem => !!v && typeof (v as any).hanzi === "string")
        .map((v, i) => ({
          id: `wechat-coach-${Date.now()}-${i}`,
          hanzi: v.hanzi,
          pinyin: v.pinyin || "",
          vietnameseMeaning: v.vietnameseMeaning || "",
          synonyms: Array.isArray(v.synonyms) ? v.synonyms : [],
          exampleZh: v.exampleZh || "",
          exampleVi: v.exampleVi || "",
          tags: Array.isArray(v.tags) ? v.tags : ["wechat"],
          frequencyLevel: ["high", "medium", "low"].includes(v.frequencyLevel as string)
            ? v.frequencyLevel
            : "medium",
        }))
    : [];

  const triplet = (
    val: unknown,
  ): { zh: string; pinyin: string; vi: string } => {
    const obj = (val && typeof val === "object" ? val : {}) as Record<string, unknown>;
    return {
      zh: typeof obj.zh === "string" ? obj.zh : "",
      pinyin: typeof obj.pinyin === "string" ? obj.pinyin : "",
      vi: typeof obj.vi === "string" ? obj.vi : "",
    };
  };

  return {
    originalInput:
      typeof input.originalInput === "string" ? input.originalInput : fallbackInput,
    versions,
    keyVocabulary: vocab,
    followUpQuestion: triplet(input.followUpQuestion),
    partnerReply: triplet(input.partnerReply),
    suggestedResponse: triplet(input.suggestedResponse),
    corporateToneScore: clampScore(input.corporateToneScore),
    clarityScore: clampScore(input.clarityScore),
    naturalnessScore: clampScore(input.naturalnessScore),
    suggestedVocabulary,
  };
}

function mockWeChatCoach(userInput: string): WeChatCoachResult {
  // Detect lifestyle intent from input keywords. Buckets cover the 6 use
  // cases in the Vân Trang spec: hotel staff / restaurant staff / directions /
  // friend chat / drama-social comment / shop owner price.
  const lower = userInput.toLowerCase();
  const isHotel =
    /khách sạn|nhận phòng|trả phòng|hotel|check-?in|wifi|押金|入住|退房|酒店|前台/.test(lower);
  const isRestaurant =
    /quán|gọi món|menu|món|nhà hàng|restaurant|餐厅|点菜|菜单|服务员|买单|cay|辣/.test(lower);
  const isDirections =
    /đường|metro|taxi|tàu|hỏi đường|làm sao|怎么走|地铁|路|出租|打车|công viên|cố cung|故宫/.test(lower);
  const isShopping =
    /chợ|mua|mặc cả|giá|đắt|rẻ|shop|价格|便宜|多少钱|砍价|店|night market|夜市/.test(lower);
  const isDrama =
    /phim|drama|tập|nhân vật|diễn viên|cổ trang|hiện đại|演员|这剧|追剧|好看|帅|颜值/.test(lower);
  const isSocial =
    /weibo|xiaohongshu|小红书|douyin|抖音|微博|caption|hashtag|reply|comment|评论|点赞/.test(lower);

  if (isHotel) return mockHotel(userInput);
  if (isRestaurant) return mockRestaurant(userInput);
  if (isDirections) return mockDirections(userInput);
  if (isShopping) return mockShopping(userInput);
  if (isDrama || isSocial) return mockDramaSocial(userInput);
  return mockGeneric(userInput);
}

function mkVocab(items: Array<[string, string, string]>): WeChatCoachResult["keyVocabulary"] {
  return items.map(([hanzi, pinyin, vi], i) => ({
    id: `wechat-coach-mock-${Date.now()}-${i}`,
    hanzi,
    pinyin,
    vietnameseMeaning: vi,
    synonyms: [],
    exampleZh: "",
    exampleVi: "",
    tags: ["wechat", "lifestyle"],
    frequencyLevel: "high",
  }));
}

// ============================================================
// Lifestyle mocks for Vân Trang — hotel / restaurant / directions /
// shopping / drama+social. Each returns 3 tones mapping to:
//   friendly → Casual (thân mật)
//   polite   → Polite (lịch sự, dùng với staff/stranger)
//   firm     → Soft natural (Weibo/Xiaohongshu comment tone)
// ============================================================

function mockHotel(userInput: string): WeChatCoachResult {
  return {
    originalInput: userInput,
    versions: [
      {
        tone: "friendly",
        zh: "嗨，我到了！我房间的 Wi-Fi 密码是多少呀？早餐几点到几点呀？",
        pinyin: "Hāi, wǒ dào le! Wǒ fángjiān de Wi-Fi mìmǎ shì duōshǎo ya? Zǎocān jǐ diǎn dào jǐ diǎn ya?",
        vi: "Hi, em tới rồi! Mật khẩu Wi-Fi phòng là gì vậy? Ăn sáng từ mấy giờ đến mấy giờ?",
        usageNoteVi: "Casual — host Airbnb / hostel trẻ. Có 呀 thân thiện.",
        riskNoteVi: "Hơi suồng sã nếu lễ tân khách sạn 5 sao. Dùng polite version.",
      },
      {
        tone: "polite",
        zh: "您好，我想办理入住，订单号是 8821。请问 Wi-Fi 密码是多少？早餐几点开始？",
        pinyin: "Nín hǎo, wǒ xiǎng bànlǐ rùzhù, dìngdān hào shì 8821. Qǐngwèn Wi-Fi mìmǎ shì duōshǎo? Zǎocān jǐ diǎn kāishǐ?",
        vi: "Chào anh/chị, tôi muốn làm thủ tục nhận phòng, mã đặt 8821. Cho hỏi mật khẩu Wi-Fi là gì? Mấy giờ bắt đầu ăn sáng?",
        usageNoteVi: "Standard lễ tân khách sạn — 您 + 请问.",
        riskNoteVi: "An toàn mọi khách sạn 3-5 sao.",
      },
      {
        tone: "firm",
        zh: "你好，刚到酒店啦~ 求 Wi-Fi 密码和早餐时间，谢谢！",
        pinyin: "Nǐ hǎo, gāng dào jiǔdiàn la~ Qiú Wi-Fi mìmǎ hé zǎocān shíjiān, xièxie!",
        vi: "Chào nhé, em mới tới khách sạn~ Xin password Wi-Fi và giờ ăn sáng nhé, cảm ơn!",
        usageNoteVi: "Soft natural — message Weibo/Xiaohongshu host hoặc reply nhân viên front-desk online.",
        riskNoteVi: "Tốt cho online chat. Tránh nói trực diện vì 求 hơi cute.",
      },
    ],
    corporateToneScore: 8,
    clarityScore: 9,
    naturalnessScore: 8,
    suggestedVocabulary: [
      { hanzi: "办理入住", pinyin: "bànlǐ rùzhù", vi: "làm thủ tục nhận phòng" },
      { hanzi: "订单号", pinyin: "dìngdān hào", vi: "mã đặt phòng" },
      { hanzi: "押金", pinyin: "yājīn", vi: "tiền cọc" },
      { hanzi: "退房", pinyin: "tuìfáng", vi: "trả phòng" },
      { hanzi: "早餐时间", pinyin: "zǎocān shíjiān", vi: "giờ ăn sáng" },
    ],
    keyVocabulary: mkVocab([
      ["办理入住", "bànlǐ rùzhù", "làm thủ tục nhận phòng"],
      ["Wi-Fi 密码", "Wi-Fi mìmǎ", "mật khẩu Wi-Fi"],
      ["早餐", "zǎocān", "bữa sáng"],
      ["押金", "yājīn", "tiền cọc"],
      ["退房", "tuìfáng", "trả phòng"],
    ]),
    followUpQuestion: {
      zh: "您需要预约接送机服务吗？",
      pinyin: "Nín xūyào yùyuē jiēsòng jī fúwù ma?",
      vi: "Quý khách có cần đặt dịch vụ đưa đón sân bay không?",
    },
    partnerReply: {
      zh: "Wi-Fi 密码是 hotel88，早餐 6:30 到 10:00。",
      pinyin: "Wi-Fi mìmǎ shì hotel88, zǎocān 6:30 dào 10:00.",
      vi: "Mật khẩu Wi-Fi là hotel88, ăn sáng 6:30 đến 10:00.",
    },
    suggestedResponse: {
      zh: "谢谢！我先回房间休息一下，待会下楼吃饭。",
      pinyin: "Xièxie! Wǒ xiān huí fángjiān xiūxi yīxià, dāihuǐ xiàlóu chīfàn.",
      vi: "Cảm ơn! Tôi về phòng nghỉ chút, lát xuống ăn.",
    },
  };
}

function mockRestaurant(userInput: string): WeChatCoachResult {
  return {
    originalInput: userInput,
    versions: [
      {
        tone: "friendly",
        zh: "老板，这个菜辣不辣呀？我们两个不太能吃辣，推荐个不辣的吧！",
        pinyin: "Lǎobǎn, zhège cài là bù là ya? Wǒmen liǎng ge bù tài néng chī là, tuījiàn ge bù là de ba!",
        vi: "Anh ơi, món này cay không vậy? Hai đứa em không ăn cay được lắm, gợi ý món không cay đi!",
        usageNoteVi: "Quán bình dân, người bán thân thiện.",
        riskNoteVi: "Hơi suồng sã nếu quán fine-dining.",
      },
      {
        tone: "polite",
        zh: "服务员，麻烦推荐一道不太辣的菜。我们有两个不能吃辣，再来一份米饭和一碗汤。请买单的时候叫我们一声。",
        pinyin: "Fúwùyuán, máfan tuījiàn yī dào bù tài là de cài. Wǒmen yǒu liǎng ge bù néng chī là, zài lái yī fèn mǐfàn hé yī wǎn tāng. Qǐng mǎidān de shíhou jiào wǒmen yī shēng.",
        vi: "Bạn ơi, phiền gợi ý 1 món không cay lắm. Hai người không ăn được cay, thêm 1 cơm + 1 canh. Lúc tính tiền gọi em nhé.",
        usageNoteVi: "Quán có phục vụ — 服务员 + 麻烦 + 请买单 lịch sự.",
        riskNoteVi: "An toàn mọi quán.",
      },
      {
        tone: "firm",
        zh: "这家川菜真的太顶了，老板态度也好，强推不辣的回锅肉！#成都美食 #避雷或安利",
        pinyin: "Zhè jiā chuāncài zhēn de tài dǐng le, lǎobǎn tàidu yě hǎo, qiáng tuī bù là de huíguōròu! #Chéngdū měishí #bìléi huò ānlì",
        vi: "Quán Tứ Xuyên này đỉnh thật, chủ thái độ cũng tốt, recommend mạnh món thịt kho không cay! #ẩmThựcThànhĐô #cảnhBáoVàAnLợi",
        usageNoteVi: "Soft natural — caption Xiaohongshu / review Dianping.",
        riskNoteVi: "Chỉ dùng cho review online — không nói trực diện với phục vụ.",
      },
    ],
    corporateToneScore: 8,
    clarityScore: 9,
    naturalnessScore: 8,
    suggestedVocabulary: [
      { hanzi: "服务员", pinyin: "fúwùyuán", vi: "nhân viên phục vụ" },
      { hanzi: "推荐", pinyin: "tuījiàn", vi: "gợi ý / recommend" },
      { hanzi: "不太辣", pinyin: "bù tài là", vi: "không cay lắm" },
      { hanzi: "打包", pinyin: "dǎbāo", vi: "gói mang về" },
      { hanzi: "请买单", pinyin: "qǐng mǎidān", vi: "vui lòng tính tiền" },
    ],
    keyVocabulary: mkVocab([
      ["菜单", "càidān", "thực đơn"],
      ["点菜", "diǎn cài", "gọi món"],
      ["不要辣", "bù yào là", "không cay"],
      ["打包", "dǎbāo", "gói mang về"],
      ["请买单", "qǐng mǎidān", "vui lòng tính tiền"],
    ]),
    followUpQuestion: {
      zh: "需要忌口吗？海鲜或者花生？",
      pinyin: "Xūyào jìkǒu ma? Hǎixiān huòzhě huāshēng?",
      vi: "Có kiêng gì không? Hải sản hay đậu phộng?",
    },
    partnerReply: {
      zh: "推荐试试鱼香肉丝，微辣，配米饭最香。",
      pinyin: "Tuījiàn shì shi yú xiāng ròu sī, wēi là, pèi mǐfàn zuì xiāng.",
      vi: "Thử thịt lợn xào kiểu Ngư Hương, hơi cay nhẹ, ăn với cơm là thơm nhất.",
    },
    suggestedResponse: {
      zh: "好的，那来一份鱼香肉丝，再加一个不辣的菜和一碗汤，谢谢！",
      pinyin: "Hǎo de, nà lái yī fèn yú xiāng ròu sī, zài jiā yī gè bù là de cài hé yī wǎn tāng, xièxie!",
      vi: "Được, cho 1 phần Ngư Hương + thêm 1 món không cay + 1 bát canh, cảm ơn!",
    },
  };
}

function mockDirections(userInput: string): WeChatCoachResult {
  return {
    originalInput: userInput,
    versions: [
      {
        tone: "friendly",
        zh: "你好，请问到故宫怎么走呀？走路远不远？",
        pinyin: "Nǐ hǎo, qǐngwèn dào Gùgōng zěnme zǒu ya? Zǒulù yuǎn bù yuǎn?",
        vi: "Chào bạn, cho hỏi tới Cố Cung đi sao? Đi bộ có xa không?",
        usageNoteVi: "Hỏi đường thân thiện — người trẻ trên phố.",
        riskNoteVi: "Tốt cho mọi tình huống casual.",
      },
      {
        tone: "polite",
        zh: "请问，到故宫怎么走？坐地铁几号线？大概要多长时间？",
        pinyin: "Qǐngwèn, dào Gùgōng zěnme zǒu? Zuò dìtiě jǐ hào xiàn? Dàgài yào duō cháng shíjiān?",
        vi: "Cho hỏi, tới Cố Cung đi thế nào? Đi metro số mấy? Mất khoảng bao lâu?",
        usageNoteVi: "Standard hỏi đường — 请问 mở đầu.",
        riskNoteVi: "An toàn với mọi đối tượng (cô chú, sinh viên, lái xe).",
      },
      {
        tone: "firm",
        zh: "求救！第一次来北京，求大家教故宫怎么走最方便？打车还是地铁？#北京攻略",
        pinyin: "Qiú jiù! Dì yī cì lái Běijīng, qiú dàjiā jiāo Gùgōng zěnme zǒu zuì fāngbiàn? Dǎchē háishì dìtiě? #Běijīng gōnglüè",
        vi: "Cứu! Lần đầu tới Bắc Kinh, xin mọi người chỉ giúp đi Cố Cung kiểu nào tiện nhất? Taxi hay metro? #cẩmnangBắcKinh",
        usageNoteVi: "Soft natural — post Xiaohongshu hỏi netizen.",
        riskNoteVi: "Chỉ dùng online post — không hỏi trực diện trên phố.",
      },
    ],
    corporateToneScore: 7,
    clarityScore: 9,
    naturalnessScore: 8,
    suggestedVocabulary: [
      { hanzi: "请问", pinyin: "qǐngwèn", vi: "cho hỏi (lịch sự)" },
      { hanzi: "怎么走", pinyin: "zěnme zǒu", vi: "đi thế nào" },
      { hanzi: "几号线", pinyin: "jǐ hào xiàn", vi: "tuyến metro số mấy" },
      { hanzi: "多远", pinyin: "duō yuǎn", vi: "bao xa" },
      { hanzi: "出租车", pinyin: "chūzūchē", vi: "taxi" },
    ],
    keyVocabulary: mkVocab([
      ["请问", "qǐngwèn", "cho hỏi (lịch sự)"],
      ["怎么走", "zěnme zǒu", "đi thế nào"],
      ["地铁", "dìtiě", "metro"],
      ["多远", "duō yuǎn", "bao xa"],
      ["大概", "dàgài", "khoảng"],
    ]),
    followUpQuestion: {
      zh: "你说的是哪个故宫？北京还是沈阳的？",
      pinyin: "Nǐ shuō de shì nǎ ge Gùgōng? Běijīng háishì Shěnyáng de?",
      vi: "Bạn hỏi Cố Cung nào? Bắc Kinh hay Thẩm Dương?",
    },
    partnerReply: {
      zh: "坐 1 号线到天安门东站，出来走 5 分钟就到。",
      pinyin: "Zuò 1 hào xiàn dào Tiān'ānmén dōng zhàn, chūlái zǒu 5 fēnzhōng jiù dào.",
      vi: "Đi tuyến 1 đến ga Thiên An Môn Đông, ra ngoài đi bộ 5 phút là tới.",
    },
    suggestedResponse: {
      zh: "好的，谢谢！我现在就去坐地铁。",
      pinyin: "Hǎo de, xièxie! Wǒ xiànzài jiù qù zuò dìtiě.",
      vi: "Được, cảm ơn! Em đi metro luôn.",
    },
  };
}

function mockShopping(userInput: string): WeChatCoachResult {
  return {
    originalInput: userInput,
    versions: [
      {
        tone: "friendly",
        zh: "老板，这条丝巾多少钱呀？便宜点行不行？180 怎么样？",
        pinyin: "Lǎobǎn, zhè tiáo sījīn duōshǎo qián ya? Piányi diǎn xíng bù xíng? 180 zěnmeyàng?",
        vi: "Anh chủ, chiếc khăn này bao nhiêu vậy? Bớt chút được không? 180 nhé?",
        usageNoteVi: "Chợ đêm, sạp lề đường — văn hoá mặc cả OK.",
        riskNoteVi: "Tránh dùng ở mall / cửa hàng giá niêm yết.",
      },
      {
        tone: "polite",
        zh: "您好，这条丝巾多少钱？可以稍微便宜一点吗？我想买两条。",
        pinyin: "Nín hǎo, zhè tiáo sījīn duōshǎo qián? Kěyǐ shāowēi piányi yīdiǎn ma? Wǒ xiǎng mǎi liǎng tiáo.",
        vi: "Chào anh/chị, khăn này bao nhiêu? Bớt chút được không ạ? Em định mua 2 chiếc.",
        usageNoteVi: "Lịch sự hơn — boutique nhỏ, bố mẹ bán hàng.",
        riskNoteVi: "An toàn ở mọi cửa hàng nhỏ.",
      },
      {
        tone: "firm",
        zh: "西安夜市这条丝巾我砍到 180 拿下！姐妹们去的话也可以试试，老板态度超好~ #西安夜市攻略",
        pinyin: "Xī'ān yèshì zhè tiáo sījīn wǒ kǎn dào 180 ná xià! Jiěmèimen qù de huà yě kěyǐ shìshi, lǎobǎn tàidu chāo hǎo~ #Xī'ān yèshì gōnglüè",
        vi: "Khăn này ở chợ đêm Tây An mình mặc cả xuống 180 mua được! Chị em đi thử nhé, chủ thái độ siêu tốt~ #cẩmnangChợĐêmTâyAn",
        usageNoteVi: "Soft natural — caption Xiaohongshu khoe deal.",
        riskNoteVi: "Chỉ dùng online — không nói khi đang trong cửa hàng.",
      },
    ],
    corporateToneScore: 7,
    clarityScore: 9,
    naturalnessScore: 8,
    suggestedVocabulary: [
      { hanzi: "多少钱", pinyin: "duōshǎo qián", vi: "bao nhiêu tiền" },
      { hanzi: "便宜点", pinyin: "piányi diǎn", vi: "rẻ hơn chút" },
      { hanzi: "试穿", pinyin: "shìchuān", vi: "mặc thử" },
      { hanzi: "微信支付", pinyin: "Wēixìn zhīfù", vi: "trả qua WeChat Pay" },
      { hanzi: "扫码", pinyin: "sǎo mǎ", vi: "quét mã QR" },
    ],
    keyVocabulary: mkVocab([
      ["老板", "lǎobǎn", "anh/chị chủ"],
      ["多少钱", "duōshǎo qián", "bao nhiêu tiền"],
      ["便宜点", "piányi diǎn", "rẻ hơn chút"],
      ["微信支付", "Wēixìn zhīfù", "WeChat Pay"],
    ]),
    followUpQuestion: {
      zh: "要发票吗？我们这边能开。",
      pinyin: "Yào fāpiào ma? Wǒmen zhèbiān néng kāi.",
      vi: "Có cần hoá đơn không? Bên em xuất được.",
    },
    partnerReply: {
      zh: "200 吧，刚才已经亏本了。",
      pinyin: "200 ba, gāngcái yǐjīng kuīběn le.",
      vi: "200 đi, vừa nãy đã lỗ rồi.",
    },
    suggestedResponse: {
      zh: "好的，190 我就拿。可以微信支付吗？",
      pinyin: "Hǎo de, 190 wǒ jiù ná. Kěyǐ Wēixìn zhīfù ma?",
      vi: "Được, 190 em lấy. Trả WeChat Pay được không?",
    },
  };
}

function mockDramaSocial(userInput: string): WeChatCoachResult {
  return {
    originalInput: userInput,
    versions: [
      {
        tone: "friendly",
        zh: "笑死，这剧颜值真的绝绝子！男主太帅了，求安利同款 OST～",
        pinyin: "Xiào sǐ, zhè jù yánzhí zhēn de juéjuézǐ! Nán zhǔ tài shuài le, qiú ānlì tóng kuǎn OST~",
        vi: "Cười chết, phim này nhan sắc đỉnh thật! Nam chính đẹp trai quá, xin reco bài OST cùng~",
        usageNoteVi: "Casual — comment trong fan group hoặc nhắn bạn thân.",
        riskNoteVi: "Hơi cute nếu reply người lạ — chuyển sang soft natural.",
      },
      {
        tone: "polite",
        zh: "我也很喜欢这部剧的画面和音乐，男主角的演技很自然，期待下周更新。",
        pinyin: "Wǒ yě hěn xǐhuān zhè bù jù de huàmiàn hé yīnyuè, nán zhǔjué de yǎnjì hěn zìrán, qídài xià zhōu gēngxīn.",
        vi: "Tôi cũng rất thích hình ảnh và nhạc của bộ phim này, diễn xuất nam chính rất tự nhiên, mong tuần sau ra tập mới.",
        usageNoteVi: "Polite — reply người lạ ở Weibo, comment dưới một bài báo phim.",
        riskNoteVi: "An toàn nhưng hơi formal cho fan group thân.",
      },
      {
        tone: "firm",
        zh: "看完这集真的破防了 😭 男主告白那段太戳人，谁懂啊！期待下集更新～#追剧日常",
        pinyin: "Kàn wán zhè jí zhēn de pòfáng le 😭 Nán zhǔ gàobái nà duàn tài chuō rén, shéi dǒng a! Qídài xià jí gēngxīn~ #zhuī jù rìcháng",
        vi: "Xem xong tập này tan chảy luôn 😭 đoạn nam chính tỏ tình quá thấm, ai mà hiểu nổi! Hóng tập tiếp~ #ngàyNgàyDuổiPhim",
        usageNoteVi: "Soft natural — caption post Xiaohongshu/Weibo, vibe fangirl nhưng vẫn lịch sự.",
        riskNoteVi: "Tốt cho mọi post công khai về drama.",
      },
    ],
    corporateToneScore: 8,
    clarityScore: 8,
    naturalnessScore: 9,
    suggestedVocabulary: [
      { hanzi: "颜值", pinyin: "yánzhí", vi: "nhan sắc (slang)" },
      { hanzi: "yyds", pinyin: "yyds (永远的神)", vi: "GOAT / đỉnh" },
      { hanzi: "破防", pinyin: "pòfáng", vi: "tan chảy / xúc động" },
      { hanzi: "求安利", pinyin: "qiú ānlì", vi: "xin reco" },
      { hanzi: "追剧", pinyin: "zhuī jù", vi: "đuổi phim / theo dõi drama" },
    ],
    keyVocabulary: mkVocab([
      ["这剧", "zhè jù", "phim này"],
      ["颜值", "yánzhí", "nhan sắc"],
      ["演技", "yǎnjì", "diễn xuất"],
      ["求安利", "qiú ānlì", "xin reco"],
      ["破防", "pòfáng", "tan chảy"],
    ]),
    followUpQuestion: {
      zh: "你看到第几集了？后面会更精彩。",
      pinyin: "Nǐ kàn dào dì jǐ jí le? Hòumiàn huì gèng jīngcǎi.",
      vi: "Bạn xem đến tập mấy rồi? Sau này hay hơn nữa.",
    },
    partnerReply: {
      zh: "刚看到第八集，男二也太可爱了！",
      pinyin: "Gāng kàn dào dì bā jí, nán èr yě tài kě'ài le!",
      vi: "Vừa xem đến tập 8, nam phụ cũng đáng yêu quá!",
    },
    suggestedResponse: {
      zh: "对对对，男二线才是隐藏好剧！下集见~",
      pinyin: "Duì duì duì, nán èr xiàn cái shì yǐncáng hǎo jù! Xià jí jiàn~",
      vi: "Đúng đúng, tuyến nam phụ mới là good drama ẩn! Hẹn tập sau~",
    },
  };
}

function mockGeneric(userInput: string): WeChatCoachResult {
  return {
    originalInput: userInput,
    versions: [
      {
        tone: "friendly",
        zh: "您好，方便聊一下吗？有个事想跟您确认。",
        pinyin: "nín hǎo, fāngbiàn liáo yīxià ma? yǒu ge shì xiǎng gēn nín quèrèn.",
        vi: "Chào anh, tiện nói chuyện chút không? Có một việc em muốn xác nhận với anh.",
        usageNoteVi: "WeChat thân thiện — dùng được với người đã quen.",
        riskNoteVi: "Hơi mơ hồ — nếu việc gấp, nên nêu chủ đề luôn.",
      },
      {
        tone: "polite",
        zh: "您好，请问现在方便沟通吗？我想跟您确认一个事情，谢谢。",
        pinyin:
          "nín hǎo, qǐngwèn xiànzài fāngbiàn gōutōng ma? wǒ xiǎng gēn nín quèrèn yīgè shìqing, xièxie.",
        vi: "Chào anh/chị, bây giờ có tiện trao đổi không? Em muốn xác nhận với anh/chị một việc, cảm ơn.",
        usageNoteVi: "Business chuẩn — 您 + 请问 + 谢谢. Dùng cho first-contact hoặc sếp.",
        riskNoteVi: "An toàn nhưng vẫn mơ hồ — kèm theo chủ đề ngay câu tiếp theo.",
      },
      {
        tone: "firm",
        zh: "您好，关于这个事情我想尽快得到确认，请您今天回复我，谢谢。",
        pinyin:
          "nín hǎo, guānyú zhège shìqing wǒ xiǎng jǐnkuài dédào quèrèn, qǐng nín jīntiān huífù wǒ, xièxie.",
        vi: "Chào anh/chị, em mong sớm nhận được xác nhận về việc này, xin anh/chị phản hồi em hôm nay, cảm ơn.",
        usageNoteVi: "Cứng nhưng lịch sự — khi đối phương đã trễ phản hồi nhiều lần.",
        riskNoteVi: "Tránh dùng ở first-contact. Có thể bị hiểu là pushy nếu chưa có background.",
      },
    ],
    corporateToneScore: 6,
    clarityScore: 5,
    naturalnessScore: 7,
    suggestedVocabulary: [
      { hanzi: "确认", pinyin: "quèrèn", vi: "xác nhận" },
      { hanzi: "尽快", pinyin: "jǐnkuài", vi: "sớm nhất có thể" },
      { hanzi: "回复", pinyin: "huífù", vi: "phản hồi" },
      { hanzi: "方便", pinyin: "fāngbiàn", vi: "tiện / convenient" },
      { hanzi: "稍后", pinyin: "shāohòu", vi: "lát nữa" },
    ],
    keyVocabulary: mkVocab([
      ["确认", "quèrèn", "xác nhận"],
      ["尽快", "jǐnkuài", "sớm nhất có thể"],
      ["回复", "huífù", "phản hồi"],
    ]),
    followUpQuestion: {
      zh: "您方便几点开会？",
      pinyin: "nín fāngbiàn jǐ diǎn kāihuì?",
      vi: "Anh/chị tiện họp lúc mấy giờ?",
    },
    partnerReply: {
      zh: "好的，下午三点可以吗？",
      pinyin: "hǎo de, xiàwǔ sān diǎn kěyǐ ma?",
      vi: "Được, 3 giờ chiều được không?",
    },
    suggestedResponse: {
      zh: "可以，三点见。我先发资料给您。",
      pinyin: "kěyǐ, sān diǎn jiàn. wǒ xiān fā zīliào gěi nín.",
      vi: "Được, 3 giờ gặp. Em gửi tài liệu trước cho anh/chị.",
    },
  };
}

export async function analyzeLyrics(
  lyrics: string,
  title?: string,
  artistNote?: string,
): Promise<LyricsAnalysis> {
  if (!hasApiKey()) return mockLyricsAnalysis(lyrics, title, artistNote);
  try {
    const raw = await callOpenAI(buildLyricsAnalyzePrompt(lyrics, title, artistNote));
    const parsed = safeParseJson<Partial<LyricsAnalysis>>(raw);
    const normalized = normalizeLyricsAnalysis(parsed, lyrics, title, artistNote);
    if (!normalized) return mockLyricsAnalysis(lyrics, title, artistNote);
    return normalized;
  } catch (err) {
    console.error("[ai.analyzeLyrics] falling back to mock:", err);
    return mockLyricsAnalysis(lyrics, title, artistNote);
  }
}

function normalizeLyricsAnalysis(
  input: Partial<LyricsAnalysis> | null,
  fallbackLyrics: string,
  fallbackTitle?: string,
  fallbackArtist?: string,
): LyricsAnalysis | null {
  if (!input || typeof input !== "object") return null;
  const allowedUse: Array<LyricsLine["dailyUse"]> = ["yes", "no", "careful"];
  const lines = Array.isArray(input.lines)
    ? input.lines
        .filter((l): l is LyricsLine => !!l && typeof (l as any).zh === "string")
        .map((l) => ({
          zh: String(l.zh).trim(),
          pinyin: typeof l.pinyin === "string" ? l.pinyin.trim() : "",
          vi: typeof l.vi === "string" ? l.vi.trim() : "",
          keyPhrases: Array.isArray(l.keyPhrases)
            ? l.keyPhrases.map((p) => String(p)).filter(Boolean).slice(0, 5)
            : [],
          dailyUse: allowedUse.includes(l.dailyUse as any) ? (l.dailyUse as any) : "careful",
          spokenEquivalentZh: typeof l.spokenEquivalentZh === "string" ? l.spokenEquivalentZh : "",
          spokenEquivalentVi: typeof l.spokenEquivalentVi === "string" ? l.spokenEquivalentVi : "",
          styleNoteVi: typeof l.styleNoteVi === "string" ? l.styleNoteVi : "",
        }))
    : [];
  if (lines.length === 0) return null;
  const shadowingPrompts = Array.isArray(input.shadowingPrompts)
    ? input.shadowingPrompts.map((p) => String(p)).filter(Boolean).slice(0, 5)
    : [];
  return {
    title: typeof input.title === "string" ? input.title : fallbackTitle,
    artistNote: typeof input.artistNote === "string" ? input.artistNote : fallbackArtist,
    lines,
    shadowingPrompts,
  };
}

/**
 * Hand-curated breakdowns for the two original sample lyric sets the app
 * ships (LyricsMode placeholder + rf-10 / rf-14 Real Feed items). All lines
 * are original text written for this app — no copyrighted lyrics.
 *
 * Keyed by a normalized first-line, so pasting either sample (or the
 * placeholder) gives a useful preview before the user adds an API key.
 */
const CURATED_LYRICS_LINES: Record<string, LyricsLine[]> = {
  "夜风轻轻吹": [
    {
      zh: "夜风轻轻吹，月亮挂在窗",
      pinyin: "Yè fēng qīng qīng chuī, yuèliàng guà zài chuāng",
      vi: "Gió đêm khẽ thổi, trăng treo ngoài cửa sổ",
      keyPhrases: ["夜风", "轻轻", "月亮", "挂在窗"],
      dailyUse: "no",
      spokenEquivalentZh: "今晚风很轻，月亮看得很清楚。",
      spokenEquivalentVi: "Tối nay gió nhẹ, trăng nhìn rõ.",
      styleNoteVi:
        "Dòng mở — reduplication 轻轻 + ẩn dụ 月亮挂在窗 tạo không khí ballad. Văn vẻ, không dùng cho email/WeChat business.",
    },
    {
      zh: "我想起那条街，那杯热茶的香",
      pinyin: "Wǒ xiǎngqǐ nà tiáo jiē, nà bēi rè chá de xiāng",
      vi: "Tôi nhớ con phố ấy, hương trà nóng ấy",
      keyPhrases: ["想起", "那条街", "热茶", "香"],
      dailyUse: "careful",
      spokenEquivalentZh: "我想起以前那条街，还有那杯热茶。",
      spokenEquivalentVi: "Tôi nhớ con phố ngày trước, và ly trà nóng ấy.",
      styleNoteVi:
        "Dòng hồi tưởng. 那 lặp hai lần kéo cảm xúc. Cấu trúc 我想起 ... dùng được trong WeChat thân thiện.",
    },
    {
      zh: "时间一直走，心还停在你的方向",
      pinyin: "Shíjiān yīzhí zǒu, xīn hái tíng zài nǐ de fāngxiàng",
      vi: "Thời gian cứ trôi, tim vẫn dừng ở hướng em",
      keyPhrases: ["一直", "心", "停", "方向"],
      dailyUse: "no",
      spokenEquivalentZh: "时间过得快，可是我还是想着你。",
      spokenEquivalentVi: "Thời gian trôi nhanh, nhưng tôi vẫn nghĩ về em.",
      styleNoteVi:
        "Dòng kết — đối lập 时间一直走 (động) vs 心还停 (tĩnh). Văn vẻ, chỉ dùng cho post cá nhân.",
    },
  ],
  "雨慢慢落": [
    {
      zh: "雨慢慢落，街灯一盏一盏亮",
      pinyin: "Yǔ mànman luò, jiē dēng yī zhǎn yī zhǎn liàng",
      vi: "Mưa từ từ rơi, đèn đường từng ngọn sáng lên",
      keyPhrases: ["慢慢", "街灯", "一盏一盏", "亮"],
      dailyUse: "careful",
      spokenEquivalentZh: "下雨了，路灯一个一个亮起来。",
      spokenEquivalentVi: "Trời mưa rồi, đèn đường lần lượt sáng lên.",
      styleNoteVi:
        "Reduplication 慢慢 + measure-word reduplication 一盏一盏 tạo nhịp đều. Spoken version đơn giản hơn.",
    },
    {
      zh: "我撑着伞，听见从前的笑声",
      pinyin: "Wǒ chēng zhe sǎn, tīngjiàn cóngqián de xiàoshēng",
      vi: "Tôi che ô, nghe tiếng cười ngày xưa",
      keyPhrases: ["撑着伞", "听见", "从前", "笑声"],
      dailyUse: "no",
      spokenEquivalentZh: "我打着伞，突然想起以前的事。",
      spokenEquivalentVi: "Tôi che ô, bỗng nhớ chuyện ngày trước.",
      styleNoteVi:
        "Cấu trúc 听见 + danh ngữ trừu tượng (从前的笑声) là văn vẻ — đời thường dùng 想起.",
    },
    {
      zh: "谁的影子，在玻璃上轻轻晃",
      pinyin: "Shéi de yǐngzi, zài bōlí shàng qīngqīng huàng",
      vi: "Bóng của ai, khẽ đung đưa trên kính",
      keyPhrases: ["影子", "玻璃", "轻轻", "晃"],
      dailyUse: "no",
      spokenEquivalentZh: "玻璃上有个影子动了一下。",
      spokenEquivalentVi: "Trên kính có cái bóng vừa động.",
      styleNoteVi:
        "Câu hỏi mở 谁的 + reduplication 轻轻 = mood ballad. Không dùng trong business writing.",
    },
  ],
};

/**
 * Mock lyrics analysis — never bundles any real song. If the user pastes
 * one of the app's own original samples, return a hand-curated breakdown
 * with proper pinyin / Vietnamese / style notes so the feature is useful
 * even before the user adds an API key. Otherwise return a generic
 * structure with placeholder fields.
 */
function mockLyricsAnalysis(
  lyrics: string,
  title?: string,
  artistNote?: string,
): LyricsAnalysis {
  const rawLines = lyrics.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const firstLine = rawLines[0] || "";

  // Try to match a curated sample by first-line prefix (covers minor edits).
  let curated: LyricsLine[] | null = null;
  for (const [key, val] of Object.entries(CURATED_LYRICS_LINES)) {
    if (firstLine.startsWith(key)) {
      curated = val;
      break;
    }
  }

  let lines: LyricsLine[];
  if (curated && curated.length === rawLines.length) {
    // Exact match — use curated breakdown directly.
    lines = curated;
  } else if (curated) {
    // Partial match — use curated for matching lines, generic for the rest.
    lines = rawLines.slice(0, 12).map((zh, i) => {
      const c = curated![i];
      if (c && c.zh === zh) return c;
      return makeGenericLyricsLine(zh, i, rawLines.length);
    });
  } else {
    lines = rawLines.slice(0, 12).map((zh, i) => makeGenericLyricsLine(zh, i, rawLines.length));
  }

  return {
    title,
    artistNote,
    lines,
    shadowingPrompts: [
      "Đọc lại từng dòng 3 lần, chú ý tone của chữ cuối.",
      "Tự ghi âm dòng dài nhất, nghe lại — so với native nhịp.",
      "Lấy 1 cụm từ poetic, viết lại theo cách bạn sẽ nói thường ngày.",
      "Bật OPENAI_API_KEY để có pinyin + dịch chính xác cho lyric tự dán.",
    ],
  };
}

function makeGenericLyricsLine(zh: string, i: number, total: number): LyricsLine {
  return {
    zh,
    pinyin: "",
    vi: "(Mock — bật OPENAI_API_KEY để dịch + pinyin chính xác.)",
    keyPhrases: zh.length > 4 ? [zh.slice(0, 2), zh.slice(-2)] : [zh],
    dailyUse: "careful",
    spokenEquivalentZh: "",
    spokenEquivalentVi:
      "Bản spoken sẽ có khi bạn bật API key — bản poetic thường dùng văn vẻ, hãy thử rephrase.",
    styleNoteVi:
      i === 0
        ? "Dòng mở — thường thiết lập không gian (nighttime, season, mood)."
        : i === total - 1
        ? "Dòng kết — thường để lại cảm xúc lửng / câu hỏi."
        : "Dòng giữa — thường có reduplication hoặc imagery (gió, trăng, đèn).",
  };
}

export async function roleplayReply(
  scenarioContext: string,
  history: Array<{ role: string; content: string }>,
  userMessage: string,
): Promise<{ zh: string; pinyin: string; vi: string }> {
  if (!hasApiKey()) return mockRoleplayReply(userMessage);
  try {
    const raw = await callOpenAI(buildRoleplayTurnPrompt(scenarioContext, history, userMessage));
    const parsed = safeParseJson<Partial<{ zh: string; pinyin: string; vi: string }>>(raw);
    const normalized = normalizeRoleplayReply(parsed);
    if (!normalized) return mockRoleplayReply(userMessage);
    return normalized;
  } catch (err) {
    console.error("[ai.roleplayReply] falling back to mock:", err);
    return mockRoleplayReply(userMessage);
  }
}

function normalizeRoleplayReply(
  input: Partial<{ zh: string; pinyin: string; vi: string }> | null,
): { zh: string; pinyin: string; vi: string } | null {
  if (!input || typeof input !== "object") return null;
  const zh = typeof input.zh === "string" ? input.zh.trim() : "";
  if (!zh) return null;
  return {
    zh,
    pinyin: typeof input.pinyin === "string" ? input.pinyin.trim() : "",
    vi: typeof input.vi === "string" ? input.vi.trim() : "",
  };
}

function normalizeCorrection(input: Partial<CorrectionResult>, fallbackOriginal: string): CorrectionResult {
  const allowed: ErrorType[] = [
    "grammar", "vocabulary", "pronunciation", "fluency",
    "cultural_context", "word_order", "measure_word", "tone", "register",
  ];
  const errorTypes = Array.isArray(input.errorTypes)
    ? input.errorTypes.filter((t): t is ErrorType => allowed.includes(t as ErrorType))
    : [];
  return {
    originalSentence: input.originalSentence || fallbackOriginal,
    issues: Array.isArray(input.issues) ? input.issues : [],
    correctedSentence: input.correctedSentence || fallbackOriginal,
    pinyin: input.pinyin || "",
    explanationVi: input.explanationVi || "",
    moreNaturalVersion: input.moreNaturalVersion || input.correctedSentence || fallbackOriginal,
    practice1: input.practice1 || "",
    practice2: input.practice2 || "",
    errorTypes,
  };
}

// ----------------- Mock fallbacks (used when no API key) -----------------

function mockCorrection(userSentence: string, context: string): CorrectionResult {
  const trimmed = userSentence.trim();
  const isPinyinish = /^[\sA-Za-z0-9āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙǕǗǙǛÜ,.?!'"-]+$/.test(trimmed);
  const looksTooShort = trimmed.length > 0 && trimmed.length < 4;

  const issues: string[] = [];
  const errorTypes: ErrorType[] = [];
  if (isPinyinish) {
    issues.push("Câu đang ở dạng pinyin / Latin, nên viết bằng chữ Hán để luyện đọc.");
    errorTypes.push("register");
  }
  if (looksTooShort) {
    issues.push("Câu quá ngắn, thử mở rộng thêm chủ ngữ hoặc bối cảnh.");
    errorTypes.push("fluency");
  }
  if (!issues.length) {
    issues.push("Câu dùng được. Có thể nâng cấp cho tự nhiên hơn trong ngữ cảnh công việc.");
    errorTypes.push("register");
  }

  return {
    originalSentence: trimmed || "(empty)",
    issues,
    correctedSentence: trimmed || "我们今天可以开会吗？",
    pinyin: "wǒmen jīntiān kěyǐ kāihuì ma?",
    explanationVi:
      "Đây là phản hồi mock (chưa có OPENAI_API_KEY). Khi đã cắm key, AI sẽ phân tích cấu trúc câu, từ vựng và ngữ cảnh công việc cụ thể.",
    moreNaturalVersion: "我们今天下午方便开个短会吗？",
    practice1: "我想跟你确认一下时间。",
    practice2: "请问你下午三点方便吗？",
    errorTypes,
  };
}

function mockLesson(day: number, topic: string) {
  return {
    titleZh: `第 ${day} 课：${topic || "工作中文"}`,
    titleVi: `Bài ${day}: ${topic || "Tiếng Trung công việc"} (mock)`,
    objectiveVi: "Mock lesson. Thêm OPENAI_API_KEY để generate nội dung thật.",
    durationMinutes: 20,
    vocabulary: [],
    sentencePatterns: [],
    dialogue: [],
    roleplayScenario: {
      titleVi: "Mock scenario",
      titleZh: "模拟场景",
      contextVi: "Mock",
      aiRole: "Business partner",
      userRole: "Bao",
      targetPhrases: [],
      difficulty: "easy",
    },
    quiz: [],
  };
}

function mockRoleplayReply(userMessage: string): { zh: string; pinyin: string; vi: string } {
  const acks = [
    { zh: "好的，我明白了。你那边什么时候方便？", pinyin: "hǎo de, wǒ míngbai le. nǐ nàbiān shénme shíhòu fāngbiàn?", vi: "Được, tôi hiểu rồi. Bên anh khi nào tiện?" },
    { zh: "可以，我们下午三点开个短会，怎么样？", pinyin: "kěyǐ, wǒmen xiàwǔ sān diǎn kāi ge duǎn huì, zěnmeyàng?", vi: "Được, chiều nay 3 giờ họp ngắn một buổi nhé?" },
    { zh: "明白。请问预算大概是多少？", pinyin: "míngbai. qǐngwèn yùsuàn dàgài shì duōshǎo?", vi: "Hiểu rồi. Ngân sách khoảng bao nhiêu?" },
    { zh: "我先确认一下，稍后回复你。", pinyin: "wǒ xiān quèrèn yíxià, shāohòu huífù nǐ.", vi: "Để tôi xác nhận lại, lát phản hồi anh." },
  ];
  const pick = acks[Math.abs(hash(userMessage)) % acks.length];
  return pick;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}
