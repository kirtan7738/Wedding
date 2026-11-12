import { describe, it, expect } from 'vitest';
import { nibStroke, composePlate } from './swash.mjs';

describe('nibStroke (broad-nib calligraphic stroke)', () => {
  const curve = [[0, 0], [40, 40], [80, -40], [120, 0]]; // one cubic: x0 y0, c1, c2, end
  it('returns a closed filled outline', () => {
    const { d } = nibStroke([curve], { maxW: 10, minW: 1 });
    expect(d.startsWith('M')).toBe(true);
    expect(d.trim().endsWith('Z')).toBe(true);
  });
  it('is thick across the nib angle and thin along it, and tapers at the ends', () => {
    const { widths } = nibStroke([curve], { maxW: 10, minW: 1, nibDeg: 35, samples: 120 });
    expect(Math.max(...widths)).toBeGreaterThan(6);
    expect(widths[0]).toBeLessThan(2.5);
    expect(widths[widths.length - 1]).toBeLessThan(2.5);
  });
});

describe('composePlate', () => {
  it('wraps lettering + swashes in one SVG whose viewBox contains both', () => {
    const lettering = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" role="img" aria-label="x"><path class="glyph" d="M0 0L100 50"/></svg>';
    const svg = composePlate({ lettering, swashes: [{ d: 'M-30 60L130 60L130 62L-30 62Z', bounds: [-30, 60, 130, 62] }] });
    const [x, y, w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
    expect(x).toBeLessThanOrEqual(-30);
    expect(x + w).toBeGreaterThanOrEqual(130);
    expect(y + h).toBeGreaterThanOrEqual(62);
    expect(svg).toContain('class="glyph"');
    expect(svg).toContain('class="swash"');
    expect(svg).toContain('aria-label="x"');
  });
});
