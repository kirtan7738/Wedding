import { describe, it, expect } from 'vitest';
import { PHYSICS, spawnBurst, stepParticle } from './petalPhysics.js';

const seeded = () => {
  let s = 42;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};
const palette = ['#f2a93b', '#e67e22', '#f2beb8', '#ca7373'];

describe('spawnBurst', () => {
  it('fires from both bottom corners, scaled down on phones', () => {
    const ps = spawnBurst({ width: 390, height: 844, rand: seeded(), palette });
    expect(ps.length).toBe(2 * Math.round(PHYSICS.perSide * PHYSICS.mobileScale));
    const left = ps.filter((p) => p.side === 'left');
    const right = ps.filter((p) => p.side === 'right');
    expect(left.length).toBe(right.length);
    for (const p of left) expect(p.x).toBeCloseTo(390 * 0.05, 5);
    for (const p of right) expect(p.x).toBeCloseTo(390 * 0.95, 5);
    for (const p of ps) expect(p.y).toBeCloseTo(844 * 0.95, 5);
  });

  it('full count on wide screens', () => {
    expect(spawnBurst({ width: 1200, height: 900, rand: seeded(), palette }).length).toBe(PHYSICS.perSide * 2);
  });

  it('launch angles stay within 72° ± 22°, mirrored for the right side, upward', () => {
    for (const p of spawnBurst({ width: 390, height: 844, rand: seeded(), palette })) {
      const deg = (Math.atan2(-p.vy, Math.abs(p.vx)) * 180) / Math.PI;
      expect(deg).toBeGreaterThanOrEqual(PHYSICS.angleDeg - PHYSICS.spreadDeg - 1e-9);
      expect(deg).toBeLessThanOrEqual(Math.min(PHYSICS.angleDeg + PHYSICS.spreadDeg, PHYSICS.maxAngleDeg) + 1e-9);
      expect(p.vy).toBeLessThan(0);
      expect(Math.sign(p.vx)).toBe(p.side === 'left' ? 1 : -1);
      const speed = Math.hypot(p.vx, p.vy);
      expect(speed).toBeGreaterThanOrEqual(PHYSICS.speedMin - 1e-6);
      expect(speed).toBeLessThanOrEqual(PHYSICS.speedMax + 1e-6);
    }
  });
});

describe('stepParticle', () => {
  it('rises, turns over, and then drifts down no faster than terminal velocity', () => {
    let ps = spawnBurst({ width: 390, height: 844, rand: seeded(), palette });
    const dt = 1 / 60;
    for (let i = 0; i < 120; i++) ps = ps.map((p) => stepParticle(p, dt)); // 2 s
    for (const p of ps) {
      expect(p.vy).toBeGreaterThan(0);
      expect(p.vy).toBeLessThanOrEqual(PHYSICS.terminal + 1e-6);
    }
  });

  it('is pure (does not mutate its input)', () => {
    const [p] = spawnBurst({ width: 390, height: 844, rand: seeded(), palette });
    const copy = { ...p };
    stepParticle(p, 1 / 60);
    expect(p).toEqual(copy);
  });
});

describe('spawnBurst overrides', () => {
  it('honours an explicit per-side count and leaf share (3D tiers)', () => {
    const ps = spawnBurst({ width: 390, height: 844, rand: seeded(), palette, perSide: 40, leafShare: 0 });
    expect(ps.length).toBe(80);
    expect(ps.every((p) => p.kind === 'petal')).toBe(true);
  });
});
