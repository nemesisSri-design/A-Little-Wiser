import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { useAppState } from './hooks/useAppState';
import { readTheme, writeTheme } from './lib/storage';
import { ArchivePage } from './pages/ArchivePage';
import { CommonplacePage } from './pages/CommonplacePage';
import { LexiconPage } from './pages/LexiconPage';
import { MapPage } from './pages/MapPage';
import { ProgressPage } from './pages/ProgressPage';
import { TodayPage } from './pages/TodayPage';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => readTheme());

  const {
    lessons,
    state,
    dueToday,
    completeLesson,
    recordReview,
    saveReflection,
    reflectionsWithLesson,
    learnedWords,
  } = useAppState();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeTheme(theme);
  }, [theme]);

  return (
    <Routes>
      <Route
        element={
          <Layout
            theme={theme}
            onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
          />
        }
      >
        <Route
          index
          element={
            <TodayPage
              lessons={lessons}
              completedLessons={state.completedLessons}
              dueToday={dueToday}
              onReview={recordReview}
              onCompleteLesson={completeLesson}
              onSaveReflection={saveReflection}
            />
          }
        />
        <Route path="commonplace" element={<CommonplacePage reflections={reflectionsWithLesson} />} />
        <Route path="lexicon" element={<LexiconPage words={learnedWords} />} />
        <Route path="map" element={<MapPage lessons={lessons} completedLessons={state.completedLessons} />} />
        <Route
          path="progress"
          element={<ProgressPage completedLessons={state.completedLessons} wordsLearned={learnedWords.length} />}
        />
        <Route
          path="archive"
          element={<ArchivePage lessons={lessons} completedLessons={state.completedLessons} />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
