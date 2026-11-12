import { describe, it, expect } from 'vitest';
import { sampleRig, easeShot, buildAnchors, filmTimeAt, springTo } from './rig.js';

const K = [
  { t: 0, pos: [0, 0, 10], target: [0, 0, 0], fov: 50 },
  { t: 1, pos: [0, 2, 0], target: [0, 2, -10], fov: 40 },
  { t: 1.5, pos: [4, 2, -5], target: [0, 2, -15], fov: 45, via: true },
  { t: 2, pos: [0, 1, -10], target: [0, 1, -20], fov: 30 },
];

describe('sampleRig', () => {
  it('lands exactly on each shot keyframe', () => {
    for (const k of [K[0], K[1], K[3]]) {
      const s = sampleRig(K, k.t);
      expect(s.pos.map((v) => +v.toFixed(5))).toEqual(k.pos);
      expect(s.target.map((v) => +v.toFixed(5))).toEqual(k.target);
      expect(s.fov).toBeCloseTo(k.fov, 5);
    }
  });

  it('clamps outside the film', () => {
    expect(sampleRig(K, -3).pos).toEqual([0, 0, 10]);
    expect(sampleRig(K, 9).pos.map((v) => +v.toFixed(5))).toEqual([0, 1, -10]);
  });

  it('passes through via-points between shots (camera can swing around obstacles)', () => {
    // the via point is reached when the eased shot time crosses 1.5
    const s = sampleRig(K, 1.5);
    expect(s.pos[0]).toBeCloseTo(4, 3);
  });

  it('is continuous (no jumps) across the whole film', () => {
    let prev = sampleRig(K, 0).pos;
    for (let t = 0.01; t <= 2; t += 0.01) {
      const p = sampleRig(K, t).pos;
      const d = Math.hypot(p[0] - prev[0], p[1] - prev[1], p[2] - prev[2]);
      expect(d).toBeLessThan(0.6);
      prev = p;
    }
  });
});

describe('easeShot', () => {
  it('holds still at whole shots and is monotonic', () => {
    expect(easeShot(2)).toBe(2);
    expect(easeShot(2.5)).toBeCloseTo(2.5, 6);
    expect(easeShot(2.02) - 2).toBeLessThan(0.01);
    let prev = -1;
    for (let t = 0; t <= 3; t += 0.05) {
      expect(easeShot(t)).toBeGreaterThanOrEqual(prev);
      prev = easeShot(t);
    }
  });
});

describe('scroll → film time', () => {
  // sections: hero 0..900, invitation 900..2400, countdown 2400..3300 ; viewport 800
  const sections = [
    { top: 0, height: 900 },
    { top: 900, height: 1500 },
    { top: 2400, height: 900 },
  ];
  const A = buildAnchors(sections, 800, { firstShot: 1, hold: 0.12 });

  it('is the first shot at the top of the page', () => {
    expect(filmTimeAt(0, A)).toBeCloseTo(1 - 0.12, 5);
  });

  it('holds near the shot while a long section is being read', () => {
    const mid = filmTimeAt(900 + 750 - 400, A); // invitation centred
    expect(mid).toBeGreaterThan(2 - 0.13);
    expect(mid).toBeLessThan(2 + 0.13);
  });

  it('moves between shots as sections hand over, monotonically', () => {
    let prev = -Infinity;
    for (let y = 0; y <= 2500; y += 25) {
      const t = filmTimeAt(y, A);
      expect(t).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = t;
    }
    expect(filmTimeAt(2500, A)).toBeGreaterThan(2.5);
  });

  it('a section can name its own shot (the camera passes the skipped shot on the way)', () => {
    const B = buildAnchors([{ top: 0, height: 900 }, { top: 900, height: 900, shot: 4 }], 800, { firstShot: 1, hold: 0.1 });
    expect(B.map((a) => a.t)).toEqual([0.9, 1.1, 3.9, 4.1]);
  });

  it('clamps past the last anchor', () => {
    expect(filmTimeAt(99999, A)).toBeCloseTo(3 + 0.12, 5);
  });
});

describe('springTo', () => {
  it('approaches the target without overshoot and converges', () => {
    let x = 0;
    let v = 0;
    let max = 0;
    for (let i = 0; i < 240; i++) {
      [x, v] = springTo(x, v, 1, 1 / 60, 0.35);
      max = Math.max(max, x);
    }
    expect(max).toBeLessThanOrEqual(1.0001);
    expect(x).toBeCloseTo(1, 3);
  });
});
