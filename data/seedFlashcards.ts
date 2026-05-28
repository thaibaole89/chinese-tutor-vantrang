import type { FlashcardState } from "@/lib/types";
import { week1Lessons } from "./week1Lessons";
import { visualHintFor } from "@/lib/visualHints";

export function buildSeedFlashcards(): FlashcardState[] {
  const cards: FlashcardState[] = [];
  for (const lesson of week1Lessons) {
    for (const v of lesson.vocabulary) {
      cards.push({
        id: v.id,
        hanzi: v.hanzi,
        pinyin: v.pinyin,
        vietnameseMeaning: v.vietnameseMeaning,
        synonyms: v.synonyms,
        exampleZh: v.exampleZh,
        exampleVi: v.exampleVi,
        tags: [...v.tags, `day-${lesson.day}`],
        frequencyLevel: v.frequencyLevel,
        reviewStatus: "new",
        updatedAt: new Date(0).toISOString(),
        visualHint: v.visualHint ?? visualHintFor(v.hanzi),
      });
    }
  }
  return cards;
}
