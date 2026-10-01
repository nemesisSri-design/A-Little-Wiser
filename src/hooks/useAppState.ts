import { useEffect, useMemo, useState } from 'react';

import { lessons } from '../content/loadLessons';
import { advanceReview, scheduleReview, toISODate } from '../lib/spacedRepetition';
import { readAppState, writeAppState } from '../lib/storage';
import type { Lesson, LessonWord } from '../types/lesson';
import type { AppStorageState, StoredReflection, StoredReview } from '../types/storage';

const reviewKey = (lessonId: string, word: string): string => `${lessonId}:${word.toLowerCase()}`;

const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));

export const useAppState = () => {
  const [state, setState] = useState<AppStorageState>(() => readAppState());
  const [todayIso] = useState(() => toISODate(new Date()));

  useEffect(() => {
    writeAppState(state);
  }, [state]);

  const completeLesson = (lesson: Lesson, date = new Date()): void => {
    setState((current) => {
      const completionDate = toISODate(date);
      const alreadyCompleted = Boolean(current.completedLessons[lesson.id]);
      const completedLessons = alreadyCompleted
        ? current.completedLessons
        : { ...current.completedLessons, [lesson.id]: completionDate };

      const nextReviews = { ...current.reviews };
      for (const item of lesson.words) {
        const key = reviewKey(lesson.id, item.word);
        if (!nextReviews[key]) {
          nextReviews[key] = scheduleReview(key, item.word, lesson.id, date);
        }
      }

      return {
        ...current,
        completedLessons,
        reviews: nextReviews,
      };
    });
  };

  const recordReview = (review: StoredReview, remembered: boolean, date = new Date()): void => {
    setState((current) => ({
      ...current,
      reviews: {
        ...current.reviews,
        [review.wordKey]: advanceReview(review, remembered, date),
      },
    }));
  };

  const saveReflection = (reflection: StoredReflection): void => {
    setState((current) => {
      const withoutExisting = current.reflections.filter(
        (item) => !(item.lessonId === reflection.lessonId && item.date === reflection.date),
      );

      return {
        ...current,
        reflections: [reflection, ...withoutExisting],
      };
    });
  };

  const dueToday = useMemo(
    () => Object.values(state.reviews).filter((review) => review.dueDate <= todayIso),
    [state.reviews, todayIso],
  );

  const reflectionsWithLesson = useMemo(
    () =>
      state.reflections.map((reflection) => ({
        ...reflection,
        lesson: lessonById.get(reflection.lessonId),
      })),
    [state.reflections],
  );

  const learnedWords = useMemo(() => {
    const words: Array<LessonWord & { lessonId: string; nextReviewDate: string | null }> = [];
    for (const lessonId of Object.keys(state.completedLessons)) {
      const lesson = lessonById.get(lessonId);
      if (!lesson) {
        continue;
      }

      for (const word of lesson.words) {
        const key = reviewKey(lesson.id, word.word);
        words.push({
          ...word,
          lessonId: lesson.id,
          nextReviewDate: state.reviews[key]?.dueDate ?? null,
        });
      }
    }

    return words;
  }, [state.completedLessons, state.reviews]);

  return {
    lessons,
    state,
    dueToday,
    completeLesson,
    recordReview,
    saveReflection,
    reflectionsWithLesson,
    learnedWords,
  };
};
