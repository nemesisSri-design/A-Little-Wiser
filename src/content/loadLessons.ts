import type { Lesson } from '../types/lesson';

const guard = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

const validateLesson = (candidate: unknown, filePath: string): Lesson => {
  guard(typeof candidate === 'object' && candidate !== null, `${filePath}: lesson must be an object`);

  const lesson = candidate as Record<string, unknown>;
  guard(typeof lesson.id === 'string', `${filePath}: id must be a string`);
  guard(typeof lesson.title === 'string', `${filePath}: title must be a string`);
  guard(typeof lesson.tradition === 'string', `${filePath}: tradition must be a string`);
  guard(typeof lesson.concept === 'string', `${filePath}: concept must be a string`);
  guard(typeof lesson.reflection === 'string', `${filePath}: reflection must be a string`);
  guard(Array.isArray(lesson.related), `${filePath}: related must be an array`);
  guard((lesson.related as unknown[]).every((id) => typeof id === 'string'), `${filePath}: related values must be strings`);

  guard(typeof lesson.source === 'object' && lesson.source !== null, `${filePath}: source must be an object`);
  const source = lesson.source as Record<string, unknown>;
  guard(typeof source.text === 'string', `${filePath}: source.text must be a string`);
  guard(typeof source.author === 'string', `${filePath}: source.author must be a string`);
  guard(typeof source.work === 'string', `${filePath}: source.work must be a string`);
  guard(typeof source.translator === 'string', `${filePath}: source.translator must be a string`);

  guard(Array.isArray(lesson.words), `${filePath}: words must be an array`);
  guard((lesson.words as unknown[]).length === 3, `${filePath}: words must include exactly 3 entries`);
  for (const [index, entry] of (lesson.words as unknown[]).entries()) {
    guard(typeof entry === 'object' && entry !== null, `${filePath}: words[${index}] must be an object`);
    const word = entry as Record<string, unknown>;
    guard(typeof word.word === 'string', `${filePath}: words[${index}].word must be a string`);
    guard(typeof word.meaning === 'string', `${filePath}: words[${index}].meaning must be a string`);
    guard(typeof word.etymology === 'string', `${filePath}: words[${index}].etymology must be a string`);
    guard(typeof word.example === 'string', `${filePath}: words[${index}].example must be a string`);
  }

  guard(Array.isArray(lesson.quiz), `${filePath}: quiz must be an array`);
  guard((lesson.quiz as unknown[]).length === 4, `${filePath}: quiz must include exactly 4 entries`);
  for (const [index, entry] of (lesson.quiz as unknown[]).entries()) {
    guard(typeof entry === 'object' && entry !== null, `${filePath}: quiz[${index}] must be an object`);
    const quiz = entry as Record<string, unknown>;
    guard(typeof quiz.question === 'string', `${filePath}: quiz[${index}].question must be a string`);
    guard(typeof quiz.answer === 'string', `${filePath}: quiz[${index}].answer must be a string`);
    if (quiz.options !== undefined) {
      guard(Array.isArray(quiz.options), `${filePath}: quiz[${index}].options must be an array`);
      guard((quiz.options as unknown[]).every((option) => typeof option === 'string'), `${filePath}: quiz[${index}].options values must be strings`);
    }
  }

  return lesson as Lesson;
};

const lessonModules = import.meta.glob('./lessons/*.json', { eager: true });

export const lessons = Object.entries(lessonModules)
  .map(([path, moduleValue]) => {
    const raw = (moduleValue as { default?: unknown }).default ?? moduleValue;
    return validateLesson(raw, path);
  })
  .sort((a, b) => a.id.localeCompare(b.id));

if (import.meta.env.DEV) {
  const ids = new Set<string>();
  for (const lesson of lessons) {
    if (ids.has(lesson.id)) {
      throw new Error(`Duplicate lesson id: ${lesson.id}`);
    }
    ids.add(lesson.id);
  }
}
