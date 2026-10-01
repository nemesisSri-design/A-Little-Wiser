import type { StoredReview } from '../types/storage';

export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 21] as const;

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const toISODate = (date: Date): string => date.toISOString().slice(0, 10);

export const nextReviewDate = (fromDate: Date, intervalIndex: number): string => {
  const safeIndex = Math.max(0, Math.min(intervalIndex, REVIEW_INTERVALS_DAYS.length - 1));
  return toISODate(addDays(fromDate, REVIEW_INTERVALS_DAYS[safeIndex]));
};

export const scheduleReview = (wordKey: string, word: string, lessonId: string, fromDate: Date): StoredReview => ({
  wordKey,
  word,
  lessonId,
  intervalIndex: 0,
  dueDate: nextReviewDate(fromDate, 0),
});

export const advanceReview = (review: StoredReview, remembered: boolean, fromDate: Date): StoredReview => {
  const nextIndex = remembered
    ? Math.min(review.intervalIndex + 1, REVIEW_INTERVALS_DAYS.length - 1)
    : 0;

  return {
    ...review,
    intervalIndex: nextIndex,
    dueDate: nextReviewDate(fromDate, nextIndex),
  };
};

export const dueReviews = (reviews: StoredReview[], asOf: Date): StoredReview[] => {
  const today = toISODate(asOf);
  return reviews.filter((review) => review.dueDate <= today);
};
