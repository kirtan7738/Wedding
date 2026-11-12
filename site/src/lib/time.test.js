import { describe, it, expect } from 'vitest';
import { countdownParts, countdownState } from './time.js';

const T = '2026-12-13T18:00:00+05:30';
const at = (iso) => Date.parse(iso);

describe('countdownParts', () => {
  it('exactly one day before', () => {
    expect(countdownParts(at('2026-12-12T18:00:00+05:30'), T)).toMatchObject({ days: 1, hours: 0, minutes: 0, seconds: 0 });
  });
  it('mixed units', () => {
    expect(countdownParts(at('2026-12-11T15:28:57+05:30'), T)).toMatchObject({ days: 2, hours: 2, minutes: 31, seconds: 3 });
  });
  it('never negative after the target', () => {
    const p = countdownParts(at('2026-12-14T00:00:00+05:30'), T);
    expect(p.totalMs).toBe(0);
    expect(p).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe('countdownState (IST calendar, independent of host TZ)', () => {
  it('today shortly after IST midnight (still the 12th in UTC)', () => {
    expect(countdownState(at('2026-12-13T00:30:00+05:30'), T)).toBe('today');
  });
  it('before on the evening of the 12th IST', () => {
    expect(countdownState(at('2026-12-12T23:59:00+05:30'), T)).toBe('before');
  });
  it('after at the exact target', () => {
    expect(countdownState(at('2026-12-13T18:00:00+05:30'), T)).toBe('after');
  });
  it('today one minute before the target', () => {
    expect(countdownState(at('2026-12-13T17:59:00+05:30'), T)).toBe('today');
  });
});
