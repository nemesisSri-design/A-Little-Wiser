import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { StepProgress } from '../components/StepProgress';
import { lessonForDate } from '../lib/dailyLesson';
import { toISODate } from '../lib/spacedRepetition';
import type { Lesson, LessonQuizItem } from '../types/lesson';
import type { StoredReview } from '../types/storage';

type TodayPageProps = {
  lessons: Lesson[];
  completedLessons: Record<string, string>;
  dueToday: StoredReview[];
  onReview: (review: StoredReview, remembered: boolean) => void;
  onCompleteLesson: (lesson: Lesson) => void;
  onSaveReflection: (payload: { lessonId: string; date: string; text: string }) => void;
};

const ReviewStep = ({
  reviews,
  onReview,
}: {
  reviews: StoredReview[];
  onReview: (review: StoredReview, remembered: boolean) => void;
}) => {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (reviews.length === 0) {
    return null;
  }

  const review = reviews[index];
  const done = index >= reviews.length;

  if (done) {
    return <p className="panel">All due words reviewed for today.</p>;
  }

  return (
    <section className="panel">
      <p className="label">Review</p>
      <h3>{review.word}</h3>
      <p>Recall the meaning before revealing.</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} type="button">
          Reveal
        </button>
      ) : (
        <div className="stack">
          <button
            onClick={() => {
              onReview(review, true);
              setRevealed(false);
              setIndex((value) => value + 1);
            }}
            type="button"
          >
            I remembered
          </button>
          <button
            className="secondary"
            onClick={() => {
              onReview(review, false);
              setRevealed(false);
              setIndex((value) => value + 1);
            }}
            type="button"
          >
            I missed it
          </button>
        </div>
      )}
    </section>
  );
};

const QuizStep = ({ quiz }: { quiz: LessonQuizItem[] }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [showOptions, setShowOptions] = useState<Record<number, boolean>>({});

  const question = quiz[questionIndex];

  return (
    <section className="panel">
      <p className="label">Quiz</p>
      <p>
        Question {questionIndex + 1} of {quiz.length}
      </p>
      <h3>{question.question}</h3>

      <textarea
        value={answers[questionIndex] ?? ''}
        onChange={(event) => {
          const value = event.target.value;
          setAnswers((current) => ({ ...current, [questionIndex]: value }));
        }}
        placeholder="Write your answer from memory"
        rows={4}
      />

      {!revealed[questionIndex] ? (
        <div className="stack">
          <button
            type="button"
            onClick={() => setRevealed((current) => ({ ...current, [questionIndex]: true }))}
          >
            Reveal model answer
          </button>
          {question.options ? (
            <button
              className="secondary"
              type="button"
              onClick={() => setShowOptions((current) => ({ ...current, [questionIndex]: !current[questionIndex] }))}
            >
              {showOptions[questionIndex] ? 'Hide options' : 'Need options'}
            </button>
          ) : null}
        </div>
      ) : (
        <div className="stack">
          <p className="model-answer">Model answer: {question.answer}</p>
          <p>Self-grade: did your answer match the central point?</p>
          <div className="stack horizontal">
            <button type="button">Yes</button>
            <button className="secondary" type="button">
              No
            </button>
          </div>
        </div>
      )}

      {question.options && showOptions[questionIndex] ? (
        <ul>
          {question.options.map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ul>
      ) : null}

      <div className="stack horizontal">
        <button
          className="secondary"
          disabled={questionIndex === 0}
          type="button"
          onClick={() => setQuestionIndex((value) => value - 1)}
        >
          Previous
        </button>
        <button
          disabled={questionIndex === quiz.length - 1}
          type="button"
          onClick={() => setQuestionIndex((value) => value + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export const TodayPage = ({
  lessons,
  completedLessons,
  dueToday,
  onReview,
  onCompleteLesson,
  onSaveReflection,
}: TodayPageProps) => {
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get('lesson');
  const [sessionDate] = useState(() => new Date());

  const lesson = useMemo(() => {
    if (selectedId) {
      const selected = lessons.find((entry) => entry.id === selectedId);
      if (selected) {
        return selected;
      }
    }

    return lessonForDate(sessionDate, lessons);
  }, [lessons, selectedId, sessionDate]);

  const [step, setStep] = useState(0);
  const [reflection, setReflection] = useState('');
  const [completed, setCompleted] = useState(false);

  const steps = [
    ...(dueToday.length > 0 ? ['Review'] : []),
    'Concept',
    'Primary source',
    'Vocabulary',
    'Quiz',
    'Reflection',
    'Complete',
  ];

  const atStep = (name: string): boolean => steps[step] === name;

  const nextReviewDate = Object.values(dueToday)
    .map((entry) => entry.dueDate)
    .sort((a, b) => a.localeCompare(b))[0];

  const dayCount = Object.keys(completedLessons).length + (completedLessons[lesson.id] ? 0 : completed ? 1 : 0);

  return (
    <article className="session">
      <header>
        <p className="label">Today</p>
        <h2>{lesson.title}</h2>
        <p>
          {lesson.tradition} · lesson {lesson.id}
        </p>
      </header>

      <StepProgress currentIndex={Math.min(step, steps.length - 1)} steps={steps} />

      {atStep('Review') ? <ReviewStep reviews={dueToday} onReview={onReview} /> : null}

      {atStep('Concept') ? (
        <section className="panel">
          <p className="label">Concept</p>
          <p>{lesson.concept}</p>
          {lesson.related.length > 0 ? (
            <p>
              Related: {lesson.related.map((id, index) => (
                <span key={id}>
                  <Link to={`/?lesson=${id}`}>{id}</Link>
                  {index < lesson.related.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          ) : null}
        </section>
      ) : null}

      {atStep('Primary source') ? (
        <section className="panel">
          <p className="label">Primary source</p>
          <blockquote>{lesson.source.text}</blockquote>
          <p>
            — {lesson.source.author}, <em>{lesson.source.work}</em>, translated by {lesson.source.translator}
          </p>
        </section>
      ) : null}

      {atStep('Vocabulary') ? (
        <section className="panel">
          <p className="label">Vocabulary</p>
          <ul className="word-list">
            {lesson.words.map((word) => (
              <li key={word.word}>
                <h3>{word.word}</h3>
                <p>{word.meaning}</p>
                <p>
                  <strong>Etymology:</strong> {word.etymology}
                </p>
                <p>
                  <strong>Example:</strong> {word.example}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {atStep('Quiz') ? <QuizStep quiz={lesson.quiz} /> : null}

      {atStep('Reflection') ? (
        <section className="panel">
          <p className="label">Reflection</p>
          <p>{lesson.reflection}</p>
          <textarea
            rows={5}
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="Write two or three sentences in your own words"
          />
        </section>
      ) : null}

      {atStep('Complete') ? (
        <section className="panel">
          <p className="label">Completed</p>
          <h3>Session finished</h3>
          <p>Day count: {dayCount}</p>
          <p>Next review due: {nextReviewDate ?? 'No reviews due yet.'}</p>
        </section>
      ) : null}

      <div className="stack horizontal">
        <button
          className="secondary"
          type="button"
          disabled={step === 0}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
        >
          Back
        </button>
        <button
          type="button"
          disabled={step === steps.length - 1}
          onClick={() => {
            if (atStep('Reflection') && reflection.trim().length > 0) {
              onSaveReflection({
                lessonId: lesson.id,
                date: toISODate(new Date()),
                text: reflection.trim(),
              });
            }

            if (step === steps.length - 2) {
              onCompleteLesson(lesson);
              setCompleted(true);
            }

            setStep((value) => Math.min(steps.length - 1, value + 1));
          }}
        >
          Continue
        </button>
      </div>
    </article>
  );
};
