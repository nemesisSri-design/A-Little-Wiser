import type { Lesson } from '../types/lesson';

export const COURSE_START_DATE = '2026-01-01';

export const daysSinceStart = (date: Date, startDate: Date): number => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const utcDate = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const utcStart = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
  return Math.floor((utcDate - utcStart) / msPerDay);
};

export const lessonForDate = (date: Date, lessons: Lesson[], startDate = new Date(COURSE_START_DATE)): Lesson => {
  if (lessons.length === 0) {
    throw new Error('No lessons are available.');
  }

  const elapsed = daysSinceStart(date, startDate);
  const normalized = ((elapsed % lessons.length) + lessons.length) % lessons.length;
  return lessons[normalized];
};
