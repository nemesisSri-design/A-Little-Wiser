type LexiconWord = {
  word: string;
  meaning: string;
  etymology: string;
  lessonId: string;
  nextReviewDate: string | null;
};

type LexiconPageProps = {
  words: LexiconWord[];
};

export const LexiconPage = ({ words }: LexiconPageProps) => (
  <section>
    <header>
      <p className="label">Lexicon</p>
      <h2>Learned words</h2>
    </header>
    {words.length === 0 ? <p className="panel">Complete a lesson to populate the lexicon.</p> : null}
    <ul className="word-list">
      {words.map((word) => (
        <li key={`${word.lessonId}-${word.word}`}>
          <h3>{word.word}</h3>
          <p>{word.meaning}</p>
          <p>
            <strong>Etymology:</strong> {word.etymology}
          </p>
          <p>
            <strong>Source lesson:</strong> {word.lessonId}
          </p>
          <p>
            <strong>Next review:</strong> {word.nextReviewDate ?? 'Not scheduled'}
          </p>
        </li>
      ))}
    </ul>
  </section>
);
