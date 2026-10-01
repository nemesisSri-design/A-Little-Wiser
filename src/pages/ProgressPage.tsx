type ProgressPageProps = {
  completedLessons: Record<string, string>;
  wordsLearned: number;
};

const uniqueSortedDates = (completedLessons: Record<string, string>): string[] =>
  [...new Set(Object.values(completedLessons))].sort((a, b) => a.localeCompare(b));

const asDate = (date: string): Date => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const streakLength = (dates: string[]): { current: number; longest: number } => {
  if (dates.length === 0) {
    return { current: 0, longest: 0 };
  }

  let longest = 1;
  let running = 1;

  for (let i = 1; i < dates.length; i += 1) {
    const previous = asDate(dates[i - 1]);
    const current = asDate(dates[i]);
    const diff = Math.floor((current.getTime() - previous.getTime()) / (24 * 60 * 60 * 1000));

    if (diff === 1) {
      running += 1;
      longest = Math.max(longest, running);
    } else {
      running = 1;
    }
  }

  let current = 0;
  const today = new Date();
  for (let i = dates.length - 1; i >= 0; i -= 1) {
    const target = asDate(dates[i]);
    const compare = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - current));
    if (target.getTime() === compare.getTime()) {
      current += 1;
    } else {
      break;
    }
  }

  return { current, longest };
};

export const ProgressPage = ({ completedLessons, wordsLearned }: ProgressPageProps) => {
  const dates = uniqueSortedDates(completedLessons);
  const streak = streakLength(dates);

  return (
    <section>
      <header>
        <p className="label">Progress</p>
        <h2>Learning totals</h2>
      </header>
      <dl className="stats-grid">
        <div>
          <dt>Current streak</dt>
          <dd>{streak.current}</dd>
        </div>
        <div>
          <dt>Longest streak</dt>
          <dd>{streak.longest}</dd>
        </div>
        <div>
          <dt>Lessons completed</dt>
          <dd>{Object.keys(completedLessons).length}</dd>
        </div>
        <div>
          <dt>Words learned</dt>
          <dd>{wordsLearned}</dd>
        </div>
      </dl>
    </section>
  );
};
