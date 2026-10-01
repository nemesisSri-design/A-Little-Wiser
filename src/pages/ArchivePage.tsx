import { Link } from 'react-router-dom';

import type { Lesson } from '../types/lesson';

type ArchivePageProps = {
  lessons: Lesson[];
  completedLessons: Record<string, string>;
};

export const ArchivePage = ({ lessons, completedLessons }: ArchivePageProps) => (
  <section>
    <header>
      <p className="label">Archive</p>
      <h2>All lessons</h2>
    </header>

    <ul className="word-list">
      {lessons.map((lesson) => (
        <li key={lesson.id}>
          <h3>{lesson.title}</h3>
          <p>
            {lesson.id} · {lesson.tradition}
          </p>
          <p>{completedLessons[lesson.id] ? `Completed on ${completedLessons[lesson.id]}` : 'Not completed yet'}</p>
          <Link to={`/?lesson=${lesson.id}`}>Read lesson</Link>
        </li>
      ))}
    </ul>
  </section>
);
