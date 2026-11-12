/**
 * Camera rig maths for the cinema world (storyboard rev 4). Pure functions — no Three.js.
 *
 * Film time `t`: whole numbers are shots (0 = doors, 1 = hero, 2 = invitation …). Keyframes may also
 * sit at fractional times (`via: true`) so the camera can swing around scenery between two shots.
 */

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smootherstep = (x) => x * x * x * (x * (x * 6 - 15) + 10);

/** Ease within each shot-to-shot move so the camera settles on every shot (holds still at integers). */
export function easeShot(t) {
  const i = Math.floor(t);
  return i + smootherstep(t - i);
}

function cr(p0, p1, p2, p3, u) {
  const u2 = u * u;
  const u3 = u2 * u;
  return 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3);
}
const crVec = (a, b, c, d, u) => [0, 1, 2].map((k) => cr(a[k], b[k], c[k], d[k], u));

/** Camera state at film time t: { pos:[x,y,z], target:[x,y,z], fov, roll }. */
export function sampleRig(keys, t) {
  const first = keys[0];
  const last = keys[keys.length - 1];
  const te = easeShot(clamp(t, first.t, last.t));
  let i = 0;
  while (i < keys.length - 2 && te > keys[i + 1].t) i++;
  const a = keys[Math.max(0, i - 1)];
  const b = keys[i];
  const c = keys[i + 1];
  const d = keys[Math.min(keys.length - 1, i + 2)];
  const span = c.t - b.t || 1;
  const u = clamp((te - b.t) / span, 0, 1);
  const fu = smootherstep(u);
  return {
    pos: crVec(a.pos, b.pos, c.pos, d.pos, u),
    target: crVec(a.target, b.target, c.target, d.target, u),
    fov: b.fov + (c.fov - b.fov) * fu,
    roll: (b.roll || 0) + ((c.roll || 0) - (b.roll || 0)) * fu,
  };
}

/**
 * Scroll anchors. Each section gets two: its top reaching the viewport top (shot − hold) and its
 * bottom reaching the viewport bottom (shot + hold). Between sections the camera travels.
 */
export function buildAnchors(sections, vh, { firstShot = 1, hold = 0.12 } = {}) {
  const out = [];
  sections.forEach((s, i) => {
    const shot = s.shot ?? firstShot + i;
    const y1 = s.top;
    const y2 = s.top + s.height - vh;
    if (y2 > y1) out.push({ y: y1, t: shot - hold }, { y: y2, t: shot + hold });
    else out.push({ y: s.top + (s.height - vh) / 2, t: shot });
  });
  for (let i = 1; i < out.length; i++) if (out[i].y <= out[i - 1].y) out[i].y = out[i - 1].y + 1;
  return out;
}

/** Piecewise-linear lookup of film time for a scroll position. */
export function filmTimeAt(y, anchors) {
  if (!anchors.length) return 0;
  if (y <= anchors[0].y) return anchors[0].t;
  for (let i = 1; i < anchors.length; i++) {
    const b = anchors[i];
    if (y <= b.y) {
      const a = anchors[i - 1];
      return a.t + ((y - a.y) / (b.y - a.y)) * (b.t - a.t);
    }
  }
  return anchors[anchors.length - 1].t;
}

/** Critically damped spring step (no overshoot). Returns [x, v]. */
export function springTo(x, v, target, dt, smoothTime = 0.35) {
  const omega = 2 / Math.max(1e-4, smoothTime);
  const k = omega * dt;
  const e = 1 / (1 + k + 0.48 * k * k + 0.235 * k * k * k);
  const change = x - target;
  const temp = (v + omega * change) * dt;
  let nv = (v - omega * temp) * e;
  let nx = target + (change + temp) * e;
  if (target - x > 0 === nx > target) {
    nx = target;
    nv = 0;
  }
  return [nx, nv];
}
