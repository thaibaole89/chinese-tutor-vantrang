export type UserLevel =
  | "absolute_beginner"
  | "beginner_plus"
  | "hsk1"
  | "hsk2"
  | "hsk3"
  | "intermediate"
  | "advanced";

export type ErrorType =
  | "grammar"
  | "vocabulary"
  | "pronunciation"
  | "fluency"
  | "cultural_context"
  | "word_order"
  | "measure_word"
  | "tone"
  | "register";

export type ReviewStatus = "new" | "learning" | "familiar" | "mastered";

/**
 * Register awareness — when can a phrase be used safely?
 *   casual          — chit-chat, slang
 *   wechat          — WeChat messaging, semi-formal
 *   business_polite — standard business spoken / written
 *   firm_negotiation — firm but professional
 *   formal_written  — contracts, formal emails, regulator docs
 */
export type Register =
  | "casual"
  | "wechat"
  | "business_polite"
  | "firm_negotiation"
  | "formal_written";

/**
 * Static visual spec. Local-first. Either an emoji, a named gradient, a
 * local image, or a stored prompt for future hand-drawn illustration.
 * `illustrationPrompt` is metadata only — never rendered as text.
 *
 * Phase 1.6 adds learning-purpose metadata so visuals can do real teaching
 * work (context recall, register comparison, dialogue framing, memory hooks)
 * rather than just decoration.
 */
export type VisualType =
  | "emoji"
  | "gradient_card"
  | "local_image"
  | "illustration_prompt"
  | "learning_scene"
  | "comic_strip"
  | "memory_hook";

export type VisualLearningPurpose =
  | "context"
  | "memory"
  | "register"
  | "dialogue";

/**
 * Phase 1.7 scene types — each one has a hand-composed CSS/SVG
 * illustration in components/LearningIllustration.tsx.
 */
export type SceneType =
  | "ai_office"
  | "market_competition"
  | "wechat_meeting"
  | "crypto_risk"
  | "dutyfree_customer"
  | "hotel_pricing"
  | "airport_traffic"
  | "slang_register"
  | "trust_reliability"
  | "music_rhythm"
  | "business_negotiation"
  | "crypto_exchange"
  | "airport_retail"
  | "hotel_operations"
  | "ai_productivity";

export type VisualSpec = {
  type: VisualType;
  emoji?: string;
  gradient?: string;
  imageSrc?: string;
  altVi: string;
  captionVi?: string;
  illustrationPrompt?: string;
  /** Phase 1.6 learning metadata */
  learningPurpose?: VisualLearningPurpose;
  sceneDescriptionVi?: string;
  keyObjects?: string[];
  visualQuestionVi?: string;
  /** Phase 1.7 — rendered scene */
  sceneType?: SceneType;
};

export type VisualHintMode = "emoji" | "illustration" | "local_image";

export interface VisualHint {
  emoji?: string;
  imagePrompt?: string;
  altVi?: string;
  memoryHookVi?: string;
  /** Phase 1.9 — image-first flashcard support */
  imageSrc?: string;
  sceneType?: SceneType;
  mode?: VisualHintMode;
}

/** A Chinese line with pinyin + Vietnamese gloss — small reusable unit. */
export interface ZhTriplet {
  zh: string;
  pinyin: string;
  vi: string;
}

export type QuizType =
  | "vi_to_zh"
  | "zh_to_vi"
  | "choose_pinyin"
  | "complete_sentence"
  | "roleplay_response";

export type Goal =
  | "daily_communication"
  | "business_chinese"
  | "exam_hsk"
  | "travel"
  | "media";

export type Interest =
  | "business"
  | "finance"
  | "crypto"
  | "AI"
  | "current_news"
  | "WeChat"
  | "meetings"
  | "travel"
  | "food";

export type LearningMethod =
  | "role_play"
  | "practical_use"
  | "minimal_theory"
  | "flashcards"
  | "reading";

export interface UserProfile {
  id: string;
  name: string;
  nativeLanguage: "vi";
  targetLanguage: "zh";
  currentLevel: UserLevel;
  goals: Goal[];
  dailyStudyTime: string;
  interests: Interest[];
  learningMethod: LearningMethod[];
  createdAt: string;
}

export interface VocabularyItem {
  id: string;
  hanzi: string;
  pinyin: string;
  vietnameseMeaning: string;
  synonyms: string[];
  exampleZh: string;
  exampleVi: string;
  tags: string[];
  frequencyLevel: "high" | "medium" | "low";
  visualHint?: VisualHint;
}

export interface SentencePattern {
  id: string;
  zh: string;
  pinyin: string;
  vi: string;
  usageNoteVi?: string;
  register?: Register;
}

export interface DialogueLine {
  speaker: string;
  zh: string;
  pinyin: string;
  vi: string;
}

export interface RoleplayScenario {
  id: string;
  titleVi: string;
  titleZh: string;
  contextVi: string;
  aiRole: string;
  userRole: string;
  targetPhrases: string[];
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizQuestion {
  id: string;
  type: QuizType;
  prompt: string;
  answer: string;
  options?: string[];
  explanationVi?: string;
}

export interface Lesson {
  id: string;
  week: number;
  day: number;
  titleZh: string;
  titleVi: string;
  objectiveVi: string;
  durationMinutes: number;
  vocabulary: VocabularyItem[];
  sentencePatterns: SentencePattern[];
  dialogue: DialogueLine[];
  roleplayScenario: RoleplayScenario;
  quiz: QuizQuestion[];
}

export interface CorrectionResult {
  originalSentence: string;
  issues: string[];
  correctedSentence: string;
  pinyin: string;
  explanationVi: string;
  moreNaturalVersion: string;
  practice1: string;
  practice2: string;
  errorTypes: ErrorType[];
}

export interface Mistake {
  id: string;
  userId: string;
  originalSentence: string;
  correctedSentence: string;
  pinyin: string;
  explanationVi: string;
  betterVersion: string;
  errorTypes: ErrorType[];
  context: string;
  createdAt: string;
  reviewCount: number;
  mastered: boolean;
}

/**
 * Vân Trang lifestyle sources. "business" / "wechat" kept for backward
 * compatibility with the underlying field name, but UI labels and the
 * fresh content set lean on travel / drama / social / news / music.
 */
export type RealFeedSource = "news" | "social" | "music" | "wechat" | "travel" | "drama";

/**
 * High-level grouping for filtering on /real-feed. Re-cast for Vân Trang:
 * travel sub-buckets (food, hotel, directions, shopping), then drama,
 * social, news, music. Each item carries exactly one category.
 */
export type RealFeedCategoryGroup =
  | "travel"
  | "food"
  | "hotel"
  | "directions"
  | "shopping"
  | "drama"
  | "social"
  | "news"
  | "music";

export interface RealFeedItem {
  id: string;
  titleZh: string;
  titleVi: string;
  sourceType: RealFeedSource;
  difficulty: "easy" | "medium";
  topicTags: string[];
  originalZh: string;
  pinyin: string;
  translationVi: string;
  keyVocabulary: VocabularyItem[];
  sentencePatterns: SentencePattern[];
  registerNotesVi: string;
  discussionPrompts: string[];
  roleplayScenario: RoleplayScenario;
  /** Phase 1.5 — visual + register awareness */
  visual: VisualSpec;
  usageNotesVi: string;
  whenToUseVi: string;
  whenNotToUseVi: string;
  spokenVersion: ZhTriplet;
  businessSafeVersion: ZhTriplet;
  speakingPrompts?: string[];
  /** Phase 1.7 — "Nhìn hình, nhớ câu" annotated practice */
  annotatedPractice?: {
    keyChips: string[];
    sentence: ZhTriplet;
  };
  /** Phase 1.9 — high-level category for filtering. */
  categoryGroup?: RealFeedCategoryGroup;
}

// ---------------- Phase 1.9 — Lyrics Mode ----------------

export interface LyricsLine {
  zh: string;
  pinyin: string;
  vi: string;
  keyPhrases: string[];
  /** Whether this line works in daily speech. */
  dailyUse: "yes" | "no" | "careful";
  /** Spoken-style equivalent of a poetic line. */
  spokenEquivalentZh?: string;
  spokenEquivalentVi?: string;
  /** Brief Vietnamese note: poetic vs spoken character. */
  styleNoteVi?: string;
}

export interface LyricsAnalysis {
  title?: string;
  artistNote?: string;
  lines: LyricsLine[];
  shadowingPrompts: string[];
}

export interface DomainPack {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  vocabulary: VocabularyItem[];
  sentencePatterns: SentencePattern[];
  roleplayScenarios: RoleplayScenario[];
  visual?: VisualSpec;
  /** Phase 1.9 — short Vietnamese prompts the user pastes into WeChat Coach. */
  wechatDrills?: string[];
}

export type WeChatTone = "friendly" | "polite" | "firm";

/** Phase 1.9 — adds per-version risk note and per-result scores. */
export interface WeChatVersion {
  zh: string;
  pinyin: string;
  vi: string;
  tone: WeChatTone;
  usageNoteVi: string;
  riskNoteVi?: string;
}

export interface WeChatCoachResult {
  originalInput: string;
  versions: WeChatVersion[];
  keyVocabulary: VocabularyItem[];
  followUpQuestion: { zh: string; pinyin: string; vi: string };
  partnerReply: { zh: string; pinyin: string; vi: string };
  suggestedResponse: { zh: string; pinyin: string; vi: string };
  /** Phase 1.9 — quality scores 1-10 for the user input message. */
  corporateToneScore?: number;
  clarityScore?: number;
  naturalnessScore?: number;
  /** 5 useful vocab suggestions for this conversational context. */
  suggestedVocabulary?: Array<{ hanzi: string; pinyin: string; vi: string }>;
}

export interface FlashcardState {
  id: string;
  hanzi: string;
  pinyin: string;
  vietnameseMeaning: string;
  synonyms: string[];
  exampleZh: string;
  exampleVi: string;
  tags: string[];
  frequencyLevel: "high" | "medium" | "low";
  reviewStatus: ReviewStatus;
  updatedAt: string;
  visualHint?: VisualHint;
}

export interface QuizResult {
  id: string;
  lessonId: string;
  score: number;
  total: number;
  answers: Array<{ questionId: string; userAnswer: string; correct: boolean }>;
  createdAt: string;
}

export interface ProgressSnapshot {
  lessonsCompleted: number;
  totalVocabulary: number;
  masteredVocabulary: number;
  recurringMistakes: number;
  quizAverage: number;
  streak: number;
  speakingPracticeCount: number;
  lastStudyDate?: string;
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: "local-user",
  name: "Vân Trang",
  nativeLanguage: "vi",
  targetLanguage: "zh",
  currentLevel: "beginner_plus",
  goals: ["daily_communication", "travel", "media"],
  dailyStudyTime: "15-20 minutes",
  interests: ["travel", "food", "current_news", "WeChat"],
  learningMethod: ["role_play", "practical_use", "minimal_theory", "reading"],
  createdAt: new Date(0).toISOString(),
};
