/**
 * Petal-cannon physics shared by the 2D and 3D tiers (spec §7.3). Technique studied from public
 * references and reimplemented: launch from both bottom corners, quadratic drag that is weak on the
 * way up and strong on the way down, a terminal fall speed, and sideways sway while falling.
 */
export const PHYSICS = {
  angleDeg: 72,
  spreadDeg: 22,
  maxAngleDeg: 88, // never past vertical: petals always travel inward
  speedMin: 780,
  speedMax: 1320,
  gravity: 900,
  dragUp: 0.0011,
  dragDown: 0.009,
  terminal: 150,
  swayFreq: [0.9, 2.1],
  swayAmp: [26, 74],
  spin: 5,
  mobileScale: 0.55,
  perSide: 52,
  leafShare: 0.08,
};

const lerp = (a, b, t) => a + (b - a) * t;

export function spawnBurst({ width, height, rand = Math.random, palette, leafColor = '#4f8a35', perSide: forcedPerSide, leafShare = PHYSICS.leafShare }) {
  const perSide = forcedPerSide ?? (width < 640 ? Math.round(PHYSICS.perSide * PHYSICS.mobileScale) : PHYSICS.perSide);
  const out = [];
  for (const side of ['left', 'right']) {
    const dir = side === 'left' ? 1 : -1;
    for (let i = 0; i < perSide; i++) {
      const deg = Math.min(PHYSICS.maxAngleDeg, PHYSICS.angleDeg + (rand() * 2 - 1) * PHYSICS.spreadDeg);
      const a = (deg * Math.PI) / 180;
      const speed = lerp(PHYSICS.speedMin, PHYSICS.speedMax, rand());
      const leaf = rand() < leafShare;
      out.push({
        side,
        kind: leaf ? 'leaf' : 'petal',
        x: width * (side === 'left' ? 0.05 : 0.95),
        y: height * 0.95,
        vx: Math.cos(a) * speed * dir,
        vy: -Math.sin(a) * speed,
        rot: rand() * Math.PI * 2,
        vrot: (rand() * 2 - 1) * PHYSICS.spin,
        flip: rand() * Math.PI * 2,
        vflip: lerp(2, 6, rand()),
        size: leaf ? lerp(14, 20, rand()) : lerp(10, 18, rand()),
        color: leaf ? leafColor : palette[Math.floor(rand() * palette.length)],
        swayPhase: rand() * Math.PI * 2,
        swayFreq: lerp(PHYSICS.swayFreq[0], PHYSICS.swayFreq[1], rand()),
        swayAmp: lerp(PHYSICS.swayAmp[0], PHYSICS.swayAmp[1], rand()),
        fall: 0, // seconds spent falling (drives sway in)
        t: 0,
      });
    }
  }
  return out;
}

/** Pure step: returns a new particle advanced by dt seconds. */
export function stepParticle(p, dt) {
  let { vx, vy } = p;
  vy += PHYSICS.gravity * dt;
  const k = vy < 0 ? PHYSICS.dragUp : PHYSICS.dragDown;
  const speed = Math.hypot(vx, vy);
  vx -= k * vx * speed * dt;
  vy -= k * vy * speed * dt;
  if (vy > PHYSICS.terminal) vy = PHYSICS.terminal;
  return {
    ...p,
    vx,
    vy,
    x: p.x + vx * dt,
    y: p.y + vy * dt,
    rot: p.rot + p.vrot * dt,
    flip: p.flip + p.vflip * dt,
    fall: vy > 0 ? p.fall + dt : p.fall,
    t: p.t + dt,
  };
}

/** Horizontal sway offset to add when drawing (eases in once the petal starts falling). */
export function swayX(p) {
  const ease = Math.min(1, p.fall / 0.8);
  return Math.sin(p.swayPhase + p.t * p.swayFreq * Math.PI * 2) * p.swayAmp * ease;
}
