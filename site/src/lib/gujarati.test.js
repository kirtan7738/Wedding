import { describe, it, expect } from 'vitest';
import { toGujaratiDigits } from './gujarati.js';

describe('toGujaratiDigits', () => {
  it('converts every ASCII digit in a string, keeping separators', () => {
    expect(toGujaratiDigits('13/12/2026')).toBe('૧૩/૧૨/૨૦૨૬');
  });
  it('converts numbers', () => {
    expect(toGujaratiDigits(7)).toBe('૭');
    expect(toGujaratiDigits(1890)).toBe('૧૮૯૦');
  });
  it('leaves non-digits untouched', () => {
    expect(toGujaratiDigits('૬:૦૦ pm')).toBe('૬:૦૦ pm');
  });
});
