import { describe, it, expect } from 'vitest';
import { revealTween, REVEAL_START } from './reveal.js';

describe('revealTween', () => {
  it('triggers at top 85% of the viewport', () => {
    expect(REVEAL_START).toBe('top 85%');
  });
  it('full motion: small rise within 400–700 ms, never more than 24px', () => {
    const t = revealTween(false);
    expect(t.from.opacity).toBe(0);
    expect(Math.abs(t.from.y)).toBeLessThanOrEqual(24);
    expect(t.to.duration).toBeGreaterThanOrEqual(0.4);
    expect(t.to.duration).toBeLessThanOrEqual(0.7);
    expect(t.to).toMatchObject({ opacity: 1, y: 0 });
  });
  it('variants give each section its own entrance', () => {
    expect(revealTween(false, 'wipe').from.clipPath).toBe('inset(0% 100% 0% 0%)');
    expect(revealTween(false, 'wipe').to.clipPath).toBe('inset(0% 0% 0% 0%)');
    expect(revealTween(false, 'flip').from.rotationX).toBe(-75);
    expect(revealTween(false, 'drop').from.y).toBeLessThan(-30);
    expect(revealTween(false, 'drop').to.ease).toMatch(/elastic|back/);
    expect(revealTween(false, 'tilt').from.rotationX).toBeGreaterThan(0);
    expect(revealTween(false, 'rise-arch').from.clipPath).toMatch(/^inset\(100%/);
    expect(revealTween(false, 'unknown')).toEqual(revealTween(false));
  });

  it('reduced motion ignores variants (opacity only)', () => {
    for (const v of ['wipe', 'flip', 'drop', 'tilt', 'rise-arch']) {
      const t = revealTween(true, v);
      expect(Object.keys(t.from)).toEqual(['opacity']);
    }
  });

  it('reduced motion: opacity only, ≤ 300 ms', () => {
    const t = revealTween(true);
    expect(t.from.y ?? 0).toBe(0);
    expect(t.to.duration).toBeLessThanOrEqual(0.3);
  });
});
