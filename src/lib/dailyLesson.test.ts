import { describe, expect, it } from 'vitest';

import { daysSinceStart, lessonForDate } from './dailyLesson';

const lessons = [
  { id: '001' },
  { id: '002' },
  { id: '003' },
] as const;

describe('daily lesson selection', () => {
  it('computes whole-day elapsed values in UTC', () => {
    expect(daysSinceStart(new Date('2026-01-02T23:59:59Z'), new Date('2026-01-01T10:00:00Z'))).toBe(1);
  });

  it('cycles through lessons by date modulo lesson count', () => {
    const day0 = lessonForDate(new Date('2026-01-01T08:00:00Z'), lessons as never, new Date('2026-01-01'));
    const day2 = lessonForDate(new Date('2026-01-03T08:00:00Z'), lessons as never, new Date('2026-01-01'));
    const day3 = lessonForDate(new Date('2026-01-04T08:00:00Z'), lessons as never, new Date('2026-01-01'));

    expect(day0.id).toBe('001');
    expect(day2.id).toBe('003');
    expect(day3.id).toBe('001');
  });
});
