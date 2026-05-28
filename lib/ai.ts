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
  // Detect intent from input keywords to vary the mock — feels less generic.
  const lower = userInput.toLowerCase();
  const isMou =
    /mou|hợp tác|scope|exclusiv|sla|hỗ trợ kỹ thuật|hợp đồng|合作|协议|合同/.test(lower);
  const isProgress =
    /tiến độ|progress|status|blocker|risk|rủi ro|deadline|进度|延期|风险/.test(lower);
  const isVip =
    /vip|đón|sân bay|khách sạn|airport|hotel|reception|接待|机场|酒店/.test(lower);

  if (isMou) return mockMou(userInput);
  if (isProgress) return mockProgress(userInput);
  if (isVip) return mockVip(userInput);
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
    tags: ["wechat", "business"],
    frequencyLevel: "high",
  }));
}

function mockMou(userInput: string): WeChatCoachResult {
  return {
    originalInput: userInput,
    versions: [
      {
        tone: "friendly",
        zh: "您好王总，咱们 MOU 的合作范围、时间表和技术支持费这几点，我想再跟您对一下。",
        pinyin:
          "nín hǎo Wáng zǒng, zánmen MOU de hézuò fànwéi, shíjiānbiǎo hé jìshù zhīchí fèi zhè jǐ diǎn, wǒ xiǎng zài gēn nín duì yīxià.",
        vi: "Chào anh Vương, về MOU em muốn rà lại 3 điểm với anh: scope hợp tác, timeline, và phí hỗ trợ kỹ thuật.",
        usageNoteVi: "WeChat đã quen anh Vương vài tuần — dùng 您 + 咱们 vừa thân vừa giữ tôn trọng.",
        riskNoteVi: "Phù hợp nếu đã ký NDA và đang trong giai đoạn term sheet. Hơi quá thân nếu first-contact.",
      },
      {
        tone: "polite",
        zh: "王总您好，关于 MOU 的合作范围、时间表、技术支持费以及 SLA，几个细节想跟您确认。方便的话今天稍后能否聊 15 分钟？",
        pinyin:
          "Wáng zǒng nín hǎo, guānyú MOU de hézuò fànwéi, shíjiānbiǎo, jìshù zhīchí fèi yǐjí SLA, jǐ ge xìjié xiǎng gēn nín quèrèn. Fāngbiàn de huà jīntiān shāohòu néng fǒu liáo 15 fēnzhōng?",
        vi: "Chào sếp Vương, em muốn xác nhận một vài chi tiết MOU: scope, timeline, phí hỗ trợ kỹ thuật và SLA. Tiện thì hôm nay 15 phút được không?",
        usageNoteVi: "Business-standard. Đầy đủ 4 hạng mục + đề xuất thời lượng cụ thể (15 phút) — đối phương dễ accept.",
        riskNoteVi: "Hợp hầu hết tình huống business WeChat. Không quá soft, không quá direct.",
      },
      {
        tone: "firm",
        zh: "王总您好，MOU 的合作范围、独家合作条款、技术支持费和 SLA 我们这边需要在本周三前定稿。烦请今明两天给我具体反馈，便于推进下一步。",
        pinyin:
          "Wáng zǒng nín hǎo, MOU de hézuò fànwéi, dújiā hézuò tiáokuǎn, jìshù zhīchí fèi hé SLA wǒmen zhèbiān xūyào zài běn zhōusān qián dìnggǎo. Fánqǐng jīn-míng liǎng tiān gěi wǒ jùtǐ fǎnkuì, biàn yú tuījìn xià yī bù.",
        vi: "Chào sếp Vương, MOU (scope, điều khoản độc quyền, phí hỗ trợ kỹ thuật, SLA) bên em cần chốt trước thứ Tư tuần này. Mong anh phản hồi cụ thể trong 1-2 ngày tới để chốt bước tiếp.",
        usageNoteVi: "Firm — đưa deadline rõ + lý do (推进下一步). Dùng 烦请 thay vì 请 cho lịch sự cứng.",
        riskNoteVi: "OK khi đã trao đổi nhiều vòng. Tránh dùng ở first-contact hoặc với khách hàng VIP cấp C-suite.",
      },
    ],
    corporateToneScore: 7,
    clarityScore: 8,
    naturalnessScore: 7,
    suggestedVocabulary: [
      { hanzi: "合作范围", pinyin: "hézuò fànwéi", vi: "phạm vi hợp tác / scope" },
      { hanzi: "独家合作", pinyin: "dújiā hézuò", vi: "hợp tác độc quyền / exclusivity" },
      { hanzi: "技术支持费", pinyin: "jìshù zhīchí fèi", vi: "phí hỗ trợ kỹ thuật" },
      { hanzi: "服务水平协议", pinyin: "fúwù shuǐpíng xiéyì", vi: "SLA" },
      { hanzi: "定稿", pinyin: "dìnggǎo", vi: "chốt nội dung cuối" },
    ],
    keyVocabulary: mkVocab([
      ["MOU", "MOU", "biên bản ghi nhớ hợp tác"],
      ["合作范围", "hézuò fànwéi", "scope hợp tác"],
      ["时间表", "shíjiānbiǎo", "lịch / timeline"],
      ["技术支持费", "jìshù zhīchí fèi", "phí hỗ trợ kỹ thuật"],
      ["SLA", "SLA", "service level agreement"],
    ]),
    followUpQuestion: {
      zh: "技术支持费您这边是按月还是按项目算？",
      pinyin: "Jìshù zhīchí fèi nín zhèbiān shì àn yuè háishì àn xiàngmù suàn?",
      vi: "Phí hỗ trợ kỹ thuật anh tính theo tháng hay theo project?",
    },
    partnerReply: {
      zh: "好的，我让法务核对一下 SLA 部分，明天上午给您回复。",
      pinyin: "Hǎo de, wǒ ràng fǎwù héduì yīxià SLA bùfèn, míngtiān shàngwǔ gěi nín huífù.",
      vi: "Được, để bộ phận pháp lý rà lại phần SLA, sáng mai trả lời anh.",
    },
    suggestedResponse: {
      zh: "好的，那我等您明天上午的回复。技术支持费的计费方式我们也再准备一版对比。",
      pinyin:
        "Hǎo de, nà wǒ děng nín míngtiān shàngwǔ de huífù. Jìshù zhīchí fèi de jìfèi fāngshì wǒmen yě zài zhǔnbèi yī bǎn duìbǐ.",
      vi: "Được, em chờ phản hồi anh sáng mai. Phương án tính phí hỗ trợ em cũng chuẩn bị thêm 1 bản so sánh.",
    },
  };
}

function mockProgress(userInput: string): WeChatCoachResult {
  return {
    originalInput: userInput,
    versions: [
      {
        tone: "friendly",
        zh: "您好，咱们项目目前到哪一步了？有没有什么需要我这边支持的？",
        pinyin:
          "nín hǎo, zánmen xiàngmù mùqián dào nǎ yī bù le? yǒu méiyǒu shénme xūyào wǒ zhèbiān zhīchí de?",
        vi: "Chào anh, dự án mình hiện tới đâu rồi? Có gì cần bên em hỗ trợ không?",
        usageNoteVi: "Mở đầu nhẹ, dùng cho daily standup hoặc check-in giữa tuần với PM thân.",
        riskNoteVi: "Quá nhẹ nếu đối phương đã trễ deliverable — họ có thể né câu hỏi.",
      },
      {
        tone: "polite",
        zh: "王总您好，想了解一下项目目前的进度、主要问题和下个时间节点，方便的话今天下午能否同步 20 分钟？",
        pinyin:
          "Wáng zǒng nín hǎo, xiǎng liǎojiě yīxià xiàngmù mùqián de jìndù, zhǔyào wèntí hé xià ge shíjiān jiédiǎn, fāngbiàn de huà jīntiān xiàwǔ néng fǒu tóngbù 20 fēnzhōng?",
        vi: "Chào sếp Vương, em muốn nắm tiến độ hiện tại, vấn đề chính và mốc thời gian tiếp theo của dự án. Chiều nay 20 phút sync được không?",
        usageNoteVi: "Standard — liệt kê 3 hạng mục cần update + đề xuất khung giờ cụ thể.",
        riskNoteVi: "Đúng tone cho check-in tuần. Đối phương dễ chấp nhận.",
      },
      {
        tone: "firm",
        zh: "王总您好，项目这周已经到关键节点了。请您今天发我一份进度更新，包括当前主要风险、负责人和后续安排，便于我们决定下一步。",
        pinyin:
          "Wáng zǒng nín hǎo, xiàngmù zhè zhōu yǐjīng dào guānjiàn jiédiǎn le. Qǐng nín jīntiān fā wǒ yī fèn jìndù gēngxīn, bāokuò dāngqián zhǔyào fēngxiǎn, fùzérén hé hòuxù ānpái, biàn yú wǒmen juédìng xià yī bù.",
        vi: "Chào sếp Vương, dự án tuần này đã tới mốc quan trọng. Xin anh gửi em update tiến độ hôm nay — gồm rủi ro chính, người phụ trách và kế hoạch follow-up — để bên em quyết bước tiếp.",
        usageNoteVi: "Firm — yêu cầu cụ thể (3 nội dung), deadline cứng (hôm nay), lý do (decision needed).",
        riskNoteVi: "Dùng khi đã missed timeline 1-2 lần. Tránh ở vòng đầu — nghe gay gắt.",
      },
    ],
    corporateToneScore: 7,
    clarityScore: 8,
    naturalnessScore: 8,
    suggestedVocabulary: [
      { hanzi: "项目进度", pinyin: "xiàngmù jìndù", vi: "tiến độ dự án" },
      { hanzi: "时间节点", pinyin: "shíjiān jiédiǎn", vi: "milestone / mốc thời gian" },
      { hanzi: "负责人", pinyin: "fùzérén", vi: "người phụ trách" },
      { hanzi: "后续安排", pinyin: "hòuxù ānpái", vi: "kế hoạch follow-up" },
      { hanzi: "关键节点", pinyin: "guānjiàn jiédiǎn", vi: "mốc quan trọng" },
    ],
    keyVocabulary: mkVocab([
      ["进度", "jìndù", "tiến độ"],
      ["主要问题", "zhǔyào wèntí", "vấn đề chính"],
      ["时间节点", "shíjiān jiédiǎn", "milestone"],
      ["风险", "fēngxiǎn", "rủi ro"],
      ["后续安排", "hòuxù ānpái", "kế hoạch follow-up"],
    ]),
    followUpQuestion: {
      zh: "目前最大的风险是哪一块？",
      pinyin: "Mùqián zuì dà de fēngxiǎn shì nǎ yī kuài?",
      vi: "Rủi ro lớn nhất hiện giờ nằm ở phần nào?",
    },
    partnerReply: {
      zh: "技术联调那块还有两个 bug，预计本周五前修完。",
      pinyin:
        "Jìshù liántiáo nà kuài hái yǒu liǎng ge bug, yùjì běn zhōu wǔ qián xiū wán.",
      vi: "Phần tích hợp kỹ thuật còn 2 bug, dự kiến fix xong trước thứ Sáu tuần này.",
    },
    suggestedResponse: {
      zh: "好的，那周五我们做一次联调验收。如果有阻塞先告诉我。",
      pinyin: "Hǎo de, nà zhōu wǔ wǒmen zuò yī cì liántiáo yànshōu. Rúguǒ yǒu zǔsè xiān gàosù wǒ.",
      vi: "Được, thứ Sáu mình verify tích hợp. Nếu có blocker báo em sớm.",
    },
  };
}

function mockVip(userInput: string): WeChatCoachResult {
  return {
    originalInput: userInput,
    versions: [
      {
        tone: "friendly",
        zh: "王总到了吗？我已经在到达口外面等您了，开一辆黑色 SUV。",
        pinyin: "Wáng zǒng dào le ma? Wǒ yǐjīng zài dàodá kǒu wàimiàn děng nín le, kāi yī liàng hēisè SUV.",
        vi: "Sếp Vương xuống chưa? Em đang đợi ngoài cổng đến, lái 1 chiếc SUV đen.",
        usageNoteVi: "Khi VIP vừa hạ cánh — ngắn gọn, action-oriented, không hoa lá.",
        riskNoteVi: "Hợp khi đã chat WeChat vài lần. First-time nên dùng polite version.",
      },
      {
        tone: "polite",
        zh: "王总您好，欢迎来到越南。我已经在到达口等您了，黑色 SUV，车牌后两位 88。酒店和明天上午十点的会议都已经安排好。",
        pinyin:
          "Wáng zǒng nín hǎo, huānyíng lái dào Yuènán. Wǒ yǐjīng zài dàodá kǒu děng nín le, hēisè SUV, chēpái hòu liǎng wèi 88. Jiǔdiàn hé míngtiān shàngwǔ shí diǎn de huìyì dōu yǐjīng ānpái hǎo.",
        vi: "Chào sếp Vương, hoan nghênh tới Việt Nam. Em đang đợi ở cổng đến, SUV đen biển 88. Khách sạn và họp 10h sáng mai đã sắp xếp xong.",
        usageNoteVi: "Standard VIP welcome — chào mừng + định vị xe + xác nhận lịch.",
        riskNoteVi: "An toàn cho mọi tình huống. Có thể tách thành 2 tin để dễ đọc trên phone.",
      },
      {
        tone: "firm",
        zh: "王总，请您出口后直接联系我，我在 A 出口外面，请告诉我您大概几分钟到。",
        pinyin: "Wáng zǒng, qǐng nín chūkǒu hòu zhíjiē liánxì wǒ, wǒ zài A chūkǒu wàimiàn, qǐng gàosù wǒ nín dàgài jǐ fēnzhōng dào.",
        vi: "Sếp Vương, anh ra cổng xong gọi em luôn nhé, em đang đợi ngoài cổng A. Anh báo em khoảng mấy phút nữa tới.",
        usageNoteVi: "Khi VIP chậm trễ hoặc xe bị tắc — direct, lệnh nhẹ.",
        riskNoteVi: "Cứng. Chỉ dùng khi quá thời gian dự kiến >20 phút và cần điều phối xe.",
      },
    ],
    corporateToneScore: 8,
    clarityScore: 9,
    naturalnessScore: 8,
    suggestedVocabulary: [
      { hanzi: "到达口", pinyin: "dàodá kǒu", vi: "cổng đến (arrival gate)" },
      { hanzi: "车牌", pinyin: "chēpái", vi: "biển số xe" },
      { hanzi: "安排好", pinyin: "ānpái hǎo", vi: "đã sắp xếp xong" },
      { hanzi: "行程", pinyin: "xíngchéng", vi: "lịch trình" },
      { hanzi: "接机", pinyin: "jiējī", vi: "đón ở sân bay" },
    ],
    keyVocabulary: mkVocab([
      ["欢迎", "huānyíng", "chào mừng"],
      ["接机", "jiējī", "đón sân bay"],
      ["酒店", "jiǔdiàn", "khách sạn"],
      ["行程", "xíngchéng", "lịch trình"],
      ["安排", "ānpái", "sắp xếp"],
    ]),
    followUpQuestion: {
      zh: "您行李多吗？要不要安排一辆更大的车？",
      pinyin: "Nín xínglǐ duō ma? Yào bù yào ānpái yī liàng gèng dà de chē?",
      vi: "Anh nhiều hành lý không? Có cần sắp xe lớn hơn không?",
    },
    partnerReply: {
      zh: "不多，一个行李箱。十分钟到。",
      pinyin: "Bù duō, yī ge xínglǐxiāng. Shí fēnzhōng dào.",
      vi: "Không nhiều, 1 vali. 10 phút nữa tới.",
    },
    suggestedResponse: {
      zh: "好的，我在 A 出口外面等您。",
      pinyin: "Hǎo de, wǒ zài A chūkǒu wàimiàn děng nín.",
      vi: "Được, em đợi anh ở cổng A.",
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
