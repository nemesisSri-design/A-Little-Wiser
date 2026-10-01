import { useMemo, useState } from 'react';

type ReflectionItem = {
  lessonId: string;
  date: string;
  text: string;
  lesson?: { title: string };
};

type CommonplacePageProps = {
  reflections: ReflectionItem[];
};

const download = (filename: string, content: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const CommonplacePage = ({ reflections }: CommonplacePageProps) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    if (!lowered) {
      return reflections;
    }
    return reflections.filter((entry) =>
      `${entry.text} ${entry.lesson?.title ?? ''} ${entry.lessonId}`.toLowerCase().includes(lowered),
    );
  }, [query, reflections]);

  return (
    <section>
      <header>
        <p className="label">Commonplace Book</p>
        <h2>Reflections</h2>
      </header>

      <input
        aria-label="Search reflections"
        placeholder="Search by phrase or lesson"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="stack horizontal">
        <button
          type="button"
          onClick={() => download('commonplace.json', JSON.stringify(reflections, null, 2), 'application/json')}
        >
          Export JSON
        </button>
        <button
          className="secondary"
          type="button"
          onClick={() => {
            const markdown = reflections
              .map(
                (entry) =>
                  `## ${entry.date} · ${entry.lesson?.title ?? entry.lessonId}\n\n${entry.text.replace(/\n/g, '\n\n')}`,
              )
              .join('\n\n');
            download('commonplace.md', markdown, 'text/markdown');
          }}
        >
          Export Markdown
        </button>
      </div>

      {filtered.length === 0 ? <p className="panel">No reflections saved yet.</p> : null}

      <ul className="word-list">
        {filtered.map((entry) => (
          <li key={`${entry.lessonId}-${entry.date}`}>
            <p className="label">{entry.date}</p>
            <h3>{entry.lesson?.title ?? entry.lessonId}</h3>
            <p>{entry.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
