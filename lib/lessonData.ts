import type { Lesson } from "./types";
import { week1Lessons } from "@/data/week1Lessons";

const ALL_LESSONS: Lesson[] = [...week1Lessons];

export function getAllLessons(): Lesson[] {
  return ALL_LESSONS;
}

export function getLessonByDay(day: number): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.day === day);
}

export function getTodayLesson(completedIds: string[]): Lesson {
  const next = ALL_LESSONS.find((l) => !completedIds.includes(l.id));
  return next ?? ALL_LESSONS[ALL_LESSONS.length - 1];
}

export function getNextLesson(currentDay: number): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.day === currentDay + 1);
}

export function totalLessonCount(): number {
  return ALL_LESSONS.length;
}
