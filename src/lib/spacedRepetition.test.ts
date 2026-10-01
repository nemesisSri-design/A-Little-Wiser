import { describe, expect, it } from 'vitest';

import { advanceReview, dueReviews, nextReviewDate, scheduleReview } from './spacedRepetition';

describe('spaced repetition intervals', () => {
  it('schedules first review one day later', () => {
    const review = scheduleReview('001:apatheia', 'apatheia', '001-stoicism', new Date('2026-01-01'));
    expect(review.dueDate).toBe('2026-01-02');
    expect(review.intervalIndex).toBe(0);
  });

  it('advances successful reviews through configured intervals', () => {
    const start = scheduleReview('001:apatheia', 'apatheia', '001-stoicism', new Date('2026-01-01'));
    const one = advanceReview(start, true, new Date('2026-01-02'));
    const two = advanceReview(one, true, new Date('2026-01-05'));

    expect(one.intervalIndex).toBe(1);
    expect(one.dueDate).toBe(nextReviewDate(new Date('2026-01-02'), 1));
    expect(two.intervalIndex).toBe(2);
    expect(two.dueDate).toBe(nextReviewDate(new Date('2026-01-05'), 2));
  });

  it('resets failed reviews to the first interval', () => {
    const start = scheduleReview('001:apatheia', 'apatheia', '001-stoicism', new Date('2026-01-01'));
    const progressed = advanceReview(start, true, new Date('2026-01-02'));
    const failed = advanceReview(progressed, false, new Date('2026-01-03'));

    expect(failed.intervalIndex).toBe(0);
    expect(failed.dueDate).toBe('2026-01-04');
  });

  it('returns only items due as of today', () => {
    const items = [
      { wordKey: 'a', word: 'a', lessonId: 'l1', dueDate: '2026-01-03', intervalIndex: 1 },
      { wordKey: 'b', word: 'b', lessonId: 'l1', dueDate: '2026-01-10', intervalIndex: 1 },
    ];

    expect(dueReviews(items, new Date('2026-01-04')).map((item) => item.wordKey)).toEqual(['a']);
  });
});
