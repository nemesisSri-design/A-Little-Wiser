import type { AppStorageState } from '../types/storage';

const APP_STORAGE_KEY = 'a-little-wiser-state-v1';
const THEME_STORAGE_KEY = 'a-little-wiser-theme-v1';

const emptyState: AppStorageState = {
  completedLessons: {},
  reviews: {},
  reflections: [],
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const sanitizeState = (value: unknown): AppStorageState => {
  if (!isObject(value)) {
    return emptyState;
  }

  const completedLessons = isObject(value.completedLessons)
    ? Object.fromEntries(
        Object.entries(value.completedLessons).filter(
          (entry): entry is [string, string] => typeof entry[0] === 'string' && typeof entry[1] === 'string',
        ),
      )
    : {};

  const reviews = isObject(value.reviews)
    ? Object.fromEntries(
        Object.entries(value.reviews).flatMap(([key, raw]) => {
          if (!isObject(raw)) {
            return [];
          }
          const word = typeof raw.word === 'string' ? raw.word : null;
          const lessonId = typeof raw.lessonId === 'string' ? raw.lessonId : null;
          const dueDate = typeof raw.dueDate === 'string' ? raw.dueDate : null;
          const intervalIndex = typeof raw.intervalIndex === 'number' ? raw.intervalIndex : null;
          if (!word || !lessonId || !dueDate || intervalIndex === null) {
            return [];
          }

          return [
            [
              key,
              {
                wordKey: key,
                word,
                lessonId,
                dueDate,
                intervalIndex,
              },
            ],
          ];
        }),
      )
    : {};

  const reflections = Array.isArray(value.reflections)
    ? value.reflections.flatMap((item) => {
        if (!isObject(item)) {
          return [];
        }
        if (
          typeof item.lessonId !== 'string' ||
          typeof item.date !== 'string' ||
          typeof item.text !== 'string'
        ) {
          return [];
        }
        return [{ lessonId: item.lessonId, date: item.date, text: item.text }];
      })
    : [];

  return { completedLessons, reviews, reflections };
};

export const readAppState = (): AppStorageState => {
  try {
    const raw = window.localStorage.getItem(APP_STORAGE_KEY);
    if (!raw) {
      return emptyState;
    }

    return sanitizeState(JSON.parse(raw));
  } catch {
    return emptyState;
  }
};

export const writeAppState = (state: AppStorageState): void => {
  try {
    window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore write failures
  }
};

export const clearAppState = (): void => {
  try {
    window.localStorage.removeItem(APP_STORAGE_KEY);
  } catch {
    // ignore delete failures
  }
};

export const readTheme = (): 'light' | 'dark' => {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return raw === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const writeTheme = (theme: 'light' | 'dark'): void => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore write failures
  }
};
