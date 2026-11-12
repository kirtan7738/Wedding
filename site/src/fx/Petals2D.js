import { spawnBurst, stepParticle, swayX } from './petalPhysics.js';

const SPRITE = 96;

/** Pre-render one petal (or leaf) sprite: cupped teardrop, light-to-deep gradient, soft midrib. */
function makeSprite(color, { leaf = false, blur = 0 } = {}) {
  const c = document.createElement('canvas');
  c.width = SPRITE;
  c.height = SPRITE;
  const g = c.getContext('2d');
  if (blur) g.filter = `blur(${blur}px)`;
  g.translate(SPRITE / 2, SPRITE / 2);
  const h = SPRITE * 0.42;
  const w = leaf ? SPRITE * 0.16 : SPRITE * 0.26;
  g.beginPath();
  g.moveTo(0, -h);
  g.bezierCurveTo(w * 1.6, -h * 0.55, w * 1.25, h * 0.75, 0, h);
  g.bezierCurveTo(-w * 1.25, h * 0.75, -w * 1.6, -h * 0.55, 0, -h);
  const grad = g.createLinearGradient(0, -h, 0, h);
  grad.addColorStop(0, leaf ? '#9cc56a' : '#fff4e3');
  grad.addColorStop(0.35, color);
  grad.addColorStop(1, shade(color, -0.28));
  g.fillStyle = grad;
  g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.35)';
  g.lineWidth = 1.2;
  g.beginPath();
  g.moveTo(0, -h * 0.8);
  g.quadraticCurveTo(w * 0.15, 0, 0, h * 0.85);
  g.stroke();
  return c;
}

function shade(hex, amt) {
  const n = parseInt(hex.replace('#', ''), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + 255 * amt)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

/**
 * 2D celebration layer (fallback tier + reduced-cost devices).
 * burst(): petal cannon from both bottom corners. ambient(on): ~12 slow petals drifting down.
 */
export function createPetals2D(canvas, { palette, leafColor = '#4f8a35', ambientCount = 12 } = {}) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  let W = 0, H = 0;
  const resize = () => {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  const sprites = new Map();
  const sprite = (p) => {
    const key = `${p.color}|${p.kind}|${p.blur ? 1 : 0}`;
    if (!sprites.has(key)) sprites.set(key, makeSprite(p.color, { leaf: p.kind === 'leaf', blur: p.blur ? 2 : 0 }));
    return sprites.get(key);
  };

  let burstPs = [];
  let ambientPs = [];
  let ambientOn = false;
  let raf = 0;
  let last = 0;
  let paused = false;

  const newAmbient = (initial) => ({
    kind: Math.random() < 0.1 ? 'leaf' : 'petal',
    color: Math.random() < 0.1 ? leafColor : palette[Math.floor(Math.random() * palette.length)],
    x: Math.random() * W,
    y: initial ? Math.random() * H : -30,
    vy: H / (13 + Math.random() * 12), // crosses the screen in 13–25 s
    rot: Math.random() * 6.28,
    vrot: (Math.random() * 2 - 1) * 1.2,
    flip: Math.random() * 6.28,
    vflip: 1 + Math.random() * 2,
    size: 10 + Math.random() * 8,
    blur: Math.random() < 0.3,
    swayPhase: Math.random() * 6.28,
    swayFreq: 0.15 + Math.random() * 0.2,
    swayAmp: 18 + Math.random() * 26,
    fall: 1,
    t: 0,
  });

  const draw = (p, alpha = 1) => {
    const s = p.size;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(p.x + swayX(p), p.y);
    ctx.rotate(p.rot);
    ctx.scale(Math.max(0.12, Math.abs(Math.cos(p.flip))), 1); // cheap 3D flip
    ctx.drawImage(sprite(p), -s, -s, s * 2, s * 2);
    ctx.restore();
  };

  const frame = (now) => {
    raf = 0;
    if (paused || document.hidden) return;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    ctx.clearRect(0, 0, W, H);

    burstPs = burstPs.map((p) => stepParticle(p, dt)).filter((p) => p.y < H + 40);
    for (const p of burstPs) draw(p, p.y > H * 0.9 ? Math.max(0, (H + 40 - p.y) / (H * 0.1 + 40)) : 1);

    if (ambientOn && ambientPs.length < ambientCount) ambientPs.push(newAmbient(false));
    ambientPs = ambientPs
      .map((p) => ({ ...p, y: p.y + p.vy * dt, rot: p.rot + p.vrot * dt, flip: p.flip + p.vflip * dt, t: p.t + dt }))
      .filter((p) => p.y < H + 30 && (ambientOn || p.y > -30));
    for (const p of ambientPs) draw(p, 0.9);

    if (burstPs.length || ambientPs.length || ambientOn) raf = requestAnimationFrame(frame);
  };
  const kick = () => {
    if (!raf && !paused) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  };
  const onVis = () => (document.hidden ? cancelAnimationFrame(raf) || (raf = 0) : kick());
  document.addEventListener('visibilitychange', onVis);

  return {
    burst() {
      burstPs = burstPs.concat(spawnBurst({ width: W, height: H, palette, leafColor }));
      kick();
    },
    ambient(on) {
      ambientOn = on;
      if (on && !ambientPs.length) ambientPs = Array.from({ length: Math.round(ambientCount / 2) }, () => newAmbient(true));
      kick();
    },
    setPaused(b) {
      paused = b;
      if (b) cancelAnimationFrame(raf), (raf = 0);
      else kick();
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      ctx.clearRect(0, 0, W, H);
    },
  };
}
