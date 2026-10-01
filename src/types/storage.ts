export type StoredReview = {
  wordKey: string;
  word: string;
  lessonId: string;
  dueDate: string;
  intervalIndex: number;
};

export type StoredReflection = {
  lessonId: string;
  date: string;
  text: string;
};

export type AppStorageState = {
  completedLessons: Record<string, string>;
  reviews: Record<string, StoredReview>;
  reflections: StoredReflection[];
};
