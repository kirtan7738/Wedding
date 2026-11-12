import { describe, it, expect } from 'vitest';
import { chooseTier, createFpsWatchdog } from './tier.js';

const base = { gpuTier: 3, isMobile: true, reducedMotion: false, webgl2: true, cores: 8, width: 390 };

describe('chooseTier', () => {
  it.each([
    [{}, 'high'],
    [{ reducedMotion: true }, 'static'],
    [{ reducedMotion: true, webgl2: false, gpuTier: 0 }, 'static'],
    [{ webgl2: false }, '2d'],
    [{ gpuTier: 1 }, '2d'],
    [{ gpuTier: 0 }, '2d'],
    [{ gpuTier: 2 }, 'lite'],
    [{ cores: 4 }, 'lite'],
    [{ cores: 4, isMobile: false }, 'high'],
  ])('%o → %s', (over, expected) => {
    expect(chooseTier({ ...base, ...over })).toBe(expected);
  });
});

describe('createFpsWatchdog', () => {
  const run = (frameMs, frames) => {
    let drops = 0;
    const wd = createFpsWatchdog({ threshold: 40, windowMs: 500, onDrop: () => drops++ });
    let t = 0;
    for (let i = 0; i < frames; i++) wd.tick((t += frameMs));
    return drops;
  };
  it('stays quiet at 60 fps', () => expect(run(16.7, 120)).toBe(0));
  it('fires exactly once when frames slow to 25 fps', () => expect(run(40, 120)).toBe(1));
  it('ignores the very first frames (warm-up)', () => expect(run(100, 3)).toBe(0));
});
