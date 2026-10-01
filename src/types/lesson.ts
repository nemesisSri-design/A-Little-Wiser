export type LessonWord = {
  word: string;
  meaning: string;
  etymology: string;
  example: string;
};

export type LessonQuizItem = {
  question: string;
  answer: string;
  options?: string[];
};

export type LessonSource = {
  text: string;
  author: string;
  work: string;
  translator: string;
};

export type Lesson = {
  id: string;
  title: string;
  tradition: string;
  concept: string;
  source: LessonSource;
  words: LessonWord[];
  quiz: LessonQuizItem[];
  reflection: string;
  related: string[];
};
