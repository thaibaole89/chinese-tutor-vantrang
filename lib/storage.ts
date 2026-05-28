"use client";

import type {
  FlashcardState,
  Mistake,
  ProgressSnapshot,
  QuizResult,
  UserProfile,
  ReviewStatus,
  VocabularyItem,
} from "./types";
import { DEFAULT_USER_PROFILE } from "./types";
import { visualHintFor } from "./visualHints";

const KEYS = {
  profile: "ctb.profile.v1",
  flashcards: "ctb.flashcards.v1",
  mistakes: "ctb.mistakes.v1",
  quizResults: "ctb.quizResults.v1",
  lessonsCompleted: "ctb.lessonsCompleted.v1",
  streak: "ctb.streak.v1",
  lastStudyDate: "ctb.lastStudyDate.v1",
  speakingCount: "ctb.speakingCount.v1",
} as const;

function safeWindow(): Window | null {
  return typeof window === "undefined" ? null : window;
}

function read<T>(key: string, fallback: T): T {
  const w = safeWindow();
  if (!w) return fallback;
  try {
    const raw = w.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[storage.read] corrupt key ${key}, removing:`, err);
    try {
      w.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    return fallback;
  }
}

function readArray<T>(key: string): T[] {
  const w = safeWindow();
  if (!w) return [];
  try {
    const raw = w.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn(`[storage.readArray] ${key} is not an array, removing`);
      try {
        w.localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
      return [];
    }
    return parsed as T[];
  } catch (err) {
    console.warn(`[storage.readArray] corrupt ${key}, removing:`, err);
    try {
      w.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    return [];
  }
}

function write<T>(key: string, value: T): boolean {
  const w = safeWindow();
  if (!w) return false;
  try {
    w.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[storage.write] failed for ${key} (quota or private mode):`, err);
    return false;
  }
}

// ---- Profile ----

export function getProfile(): UserProfile {
  return read<UserProfile>(KEYS.profile, DEFAULT_USER_PROFILE);
}

export function saveProfile(profile: UserProfile): void {
  write(KEYS.profile, profile);
}

// ---- Flashcards ----

export function getFlashcards(): FlashcardState[] {
  return readArray<FlashcardState>(KEYS.flashcards);
}

export function saveFlashcards(cards: FlashcardState[]): void {
  write(KEYS.flashcards, cards);
}

export function upsertFlashcards(seed: FlashcardState[]): FlashcardState[] {
  const existing = getFlashcards();
  const byId = new Map(existing.map((c) => [c.id, c] as const));
  for (const card of seed) {
    if (!byId.has(card.id)) byId.set(card.id, card);
  }
  const merged = Array.from(byId.values());
  saveFlashcards(merged);
  return merged;
}

/**
 * Convert a vocabulary list into flashcards and merge into storage.
 * Used by Real Feed and Domain Packs to "save vocab to flashcards".
 * Optionally namespace IDs (e.g., source = "realfeed-3") so collisions
 * across sources stay unique.
 */
export function upsertVocabAsFlashcards(
  vocab: VocabularyItem[],
  options: { tagPrefix?: string; sourceTag?: string } = {},
): { added: number; total: number; cards: FlashcardState[] } {
  const existing = getFlashcards();
  const byId = new Map(existing.map((c) => [c.id, c] as const));
  let added = 0;
  for (const v of vocab) {
    const id = options.tagPrefix ? `${options.tagPrefix}-${v.id}` : v.id;
    if (byId.has(id)) continue;
    byId.set(id, {
      id,
      hanzi: v.hanzi,
      pinyin: v.pinyin,
      vietnameseMeaning: v.vietnameseMeaning,
      synonyms: v.synonyms,
      exampleZh: v.exampleZh,
      exampleVi: v.exampleVi,
      tags: options.sourceTag ? [...v.tags, options.sourceTag] : v.tags,
      frequencyLevel: v.frequencyLevel,
      reviewStatus: "new",
      updatedAt: new Date().toISOString(),
      visualHint: v.visualHint ?? visualHintFor(v.hanzi),
    });
    added += 1;
  }
  const cards = Array.from(byId.values());
  saveFlashcards(cards);
  return { added, total: cards.length, cards };
}

export function updateFlashcardStatus(id: string, reviewStatus: ReviewStatus): FlashcardState[] {
  const cards = getFlashcards().map((c) =>
    c.id === id ? { ...c, reviewStatus, updatedAt: new Date().toISOString() } : c,
  );
  saveFlashcards(cards);
  return cards;
}

// ---- Mistakes ----

export function getMistakes(): Mistake[] {
  return readArray<Mistake>(KEYS.mistakes);
}

export function saveMistake(mistake: Mistake): { ok: boolean; all: Mistake[] } {
  const all = [mistake, ...getMistakes()];
  const ok = write(KEYS.mistakes, all);
  return { ok, all };
}

export function markMistakeMastered(id: string, mastered: boolean): Mistake[] {
  const all = getMistakes().map((m) => (m.id === id ? { ...m, mastered } : m));
  write(KEYS.mistakes, all);
  return all;
}

export function incrementMistakeReview(id: string): Mistake[] {
  const all = getMistakes().map((m) => (m.id === id ? { ...m, reviewCount: m.reviewCount + 1 } : m));
  write(KEYS.mistakes, all);
  return all;
}

// ---- Quiz results ----

export function getQuizResults(): QuizResult[] {
  return readArray<QuizResult>(KEYS.quizResults);
}

export function saveQuizResult(result: QuizResult): QuizResult[] {
  const all = [result, ...getQuizResults()];
  write(KEYS.quizResults, all);
  return all;
}

// ---- Lessons completed / streak ----

export function getLessonsCompleted(): string[] {
  return readArray<string>(KEYS.lessonsCompleted);
}

export function markLessonCompleted(lessonId: string): string[] {
  const set = new Set(getLessonsCompleted());
  set.add(lessonId);
  const arr = Array.from(set);
  write(KEYS.lessonsCompleted, arr);
  touchStudyDay();
  return arr;
}

export function getStreak(): number {
  return read<number>(KEYS.streak, 0);
}

export function getLastStudyDate(): string | undefined {
  return read<string | undefined>(KEYS.lastStudyDate, undefined);
}

function localDay(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

function touchStudyDay(): void {
  const today = localDay();
  const last = getLastStudyDate();
  if (last === today) return;
  const yesterday = localDay(addDays(new Date(), -1));
  const currentStreak = getStreak();
  const next = last === yesterday ? currentStreak + 1 : 1;
  write(KEYS.streak, next);
  write(KEYS.lastStudyDate, today);
}

// ---- Speaking practice ----

export function getSpeakingCount(): number {
  return read<number>(KEYS.speakingCount, 0);
}

export function incrementSpeakingCount(): number {
  const next = getSpeakingCount() + 1;
  write(KEYS.speakingCount, next);
  touchStudyDay();
  return next;
}

// ---- Aggregate progress ----

export function getProgressSnapshot(): ProgressSnapshot {
  const flashcards = getFlashcards();
  const mistakes = getMistakes();
  const quizzes = getQuizResults();
  const lessonsCompleted = getLessonsCompleted().length;
  const mastered = flashcards.filter((c) => c.reviewStatus === "mastered").length;
  const recurring = mistakes.filter((m) => !m.mastered && m.reviewCount >= 1).length;
  const quizAverage = quizzes.length
    ? Math.round(
        (quizzes.reduce((acc, q) => acc + (q.total > 0 ? q.score / q.total : 0), 0) / quizzes.length) * 100,
      )
    : 0;

  return {
    lessonsCompleted,
    totalVocabulary: flashcards.length,
    masteredVocabulary: mastered,
    recurringMistakes: recurring,
    quizAverage,
    streak: getStreak(),
    speakingPracticeCount: getSpeakingCount(),
    lastStudyDate: getLastStudyDate(),
  };
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}
