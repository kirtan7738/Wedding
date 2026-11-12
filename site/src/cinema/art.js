/**
 * Hand-painted (procedural) Mughal-miniature cut-outs after the user's reference reel: cypress, plantain,
 * bougainvillea, peacock, chhatri, jharokha gate, ivory door leaf. Each painter returns a canvas with a
 * transparent background. scripts/art.mjs renders them to public/img/art/*.webp; the world stands them up
 * as layers (painted.js).
 */
import { makeCanvas } from './paint.js';

const TAU = Math.PI * 2;
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const lerp = (a, b, t) => a + (b - a) * t;
const INK = 'rgba(52,30,14,0.55)';
const SAND = ['#f6ead0', '#ead8b2', '#d6bd8c', '#b99a62'];
const GOLD = ['#8a5f1c', '#c99a3b', '#f3d58a', '#fff1c7'];

function gold(ctx, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, GOLD[0]);
  g.addColorStop(0.4, GOLD[1]);
  g.addColorStop(0.55, GOLD[3]);
  g.addColorStop(0.7, GOLD[2]);
  g.addColorStop(1, GOLD[0]);
  return g;
}
function leafShape(ctx, len, wid) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(wid, -len * 0.45, 0, -len);
  ctx.quadraticCurveTo(-wid, -len * 0.45, 0, 0);
}
function flower5(ctx, x, y, r, petal, centre = '#ffd34d') {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i++) {
    ctx.rotate(TAU / 5);
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.55, r * 0.42, r * 0.6, 0, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = centre;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.25, 0, TAU);
  ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- cypress with a flowering vine
export function cypress(W = 560, H = 1500, seed = 4) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  const r = rng(seed);
  const cx = W / 2;
  const top = 20;
  const base = H - 90;
  const width = (y) => {
    const u = (y - top) / (base - top);
    return W * 0.46 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.92 + 0.04)), 0.75) * (0.55 + 0.45 * u);
  };
  // trunk
  ctx.fillStyle = '#5a3a1e';
  ctx.fillRect(cx - 10, base - 20, 20, H - base + 10);
  // canopy as hundreds of scalloped leaf tufts, dark to light
  const greens = ['#16361f', '#1f4a2a', '#2b5f33', '#3c7a3c', '#5b9548'];
  for (let layer = 0; layer < 5; layer++) {
    const n = 900;
    for (let i = 0; i < n; i++) {
      const y = lerp(top + 30, base, Math.pow(r(), 0.9));
      const w = width(y);
      const x = cx + (r() * 2 - 1) * w * (1 - layer * 0.12);
      const light = (x - cx) / Math.max(1, w); // lit from the left
      if (layer >= 3 && light > 0.2) continue;
      ctx.fillStyle = greens[layer];
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 2 + (r() - 0.5) * 1.4);
      const s = 9 + r() * 10 - layer;
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.ellipse(k * s * 0.5 - s * 0.5, 0, s * 0.55, s * 0.32, (k - 1) * 0.5, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }
  }
  // flame tip
  ctx.fillStyle = greens[2];
  ctx.beginPath();
  ctx.moveTo(cx, top);
  ctx.quadraticCurveTo(cx + 14, top + 60, cx + 6, top + 110);
  ctx.lineTo(cx - 6, top + 110);
  ctx.quadraticCurveTo(cx - 14, top + 60, cx, top);
  ctx.fill();
  // flowering vine spiralling up
  ctx.strokeStyle = '#4c3a1a';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  for (let y = base; y > top + 160; y -= 6) {
    const w = width(y) * 0.8;
    const x = cx + Math.sin(y * 0.018) * w;
    if (y === base) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  for (let y = base - 10; y > top + 170; y -= 22) {
    const w = width(y) * 0.8;
    const x = cx + Math.sin(y * 0.018) * w;
    if (Math.cos(y * 0.018) < -0.2) continue; // behind the tree
    flower5(ctx, x + (r() - 0.5) * 16, y, 7 + r() * 4, r() > 0.4 ? '#fff4e6' : '#f2a7b5');
  }
  // soft grass tuft at the foot
  grassTuft(ctx, cx, H - 20, W * 0.7, r);
  return c;
}

function grassTuft(ctx, cx, y, w, r) {
  for (let i = 0; i < 70; i++) {
    const x = cx + (r() - 0.5) * w;
    const h = 20 + r() * 50;
    ctx.strokeStyle = ['#2b5f33', '#3c7a3c', '#1f4a2a'][i % 3];
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + (r() - 0.5) * 20, y - h * 0.6, x + (r() - 0.5) * 30, y - h);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------- plantain (banana) clump
export function plantain(W = 1000, H = 1100, seed = 7) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  const r = rng(seed);
  const cx = W / 2;
  const base = H - 60;
  // pseudo-stems
  for (let i = -2; i <= 2; i++) {
    const g = ctx.createLinearGradient(cx + i * 30 - 20, 0, cx + i * 30 + 20, 0);
    g.addColorStop(0, '#3d6b2c');
    g.addColorStop(0.5, '#7fa45a');
    g.addColorStop(1, '#2f5422');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(cx + i * 30 - 22, base);
    ctx.lineTo(cx + i * 22 - 12, base - 420 + Math.abs(i) * 60);
    ctx.lineTo(cx + i * 22 + 12, base - 420 + Math.abs(i) * 60);
    ctx.lineTo(cx + i * 30 + 22, base);
    ctx.fill();
  }
  // big leaves arching out
  const leaves = [];
  for (let i = 0; i < 9; i++) leaves.push({ a: -Math.PI / 2 + (i / 8 - 0.5) * 2.6 + (r() - 0.5) * 0.2, len: 420 + r() * 140, sx: cx + (r() - 0.5) * 60, sy: base - 380 - r() * 80 });
  leaves.sort((a, b) => Math.abs(b.a + Math.PI / 2) - Math.abs(a.a + Math.PI / 2));
  for (const L of leaves) {
    ctx.save();
    ctx.translate(L.sx, L.sy);
    ctx.rotate(L.a + Math.PI / 2);
    const len = L.len;
    const wid = len * 0.2;
    const droop = (Math.abs(L.a + Math.PI / 2) / 1.3) * 0.5;
    const path = new Path2D();
    path.moveTo(0, 0);
    path.bezierCurveTo(wid, -len * 0.3, wid * 1.1 + droop * 120, -len * 0.75, droop * 200, -len);
    path.bezierCurveTo(-wid * 0.8 + droop * 120, -len * 0.75, -wid, -len * 0.3, 0, 0);
    const g = ctx.createLinearGradient(-wid, 0, wid, 0);
    g.addColorStop(0, '#2c5a26');
    g.addColorStop(0.5, '#6f9e4c');
    g.addColorStop(0.52, '#c7d78f');
    g.addColorStop(0.56, '#4f8238');
    g.addColorStop(1, '#244a1f');
    ctx.fillStyle = g;
    ctx.fill(path);
    // veins
    ctx.save();
    ctx.clip(path);
    ctx.strokeStyle = 'rgba(20,50,15,0.35)';
    ctx.lineWidth = 2;
    for (let k = 0; k < 26; k++) {
      const t = k / 26;
      ctx.beginPath();
      ctx.moveTo(droop * 200 * t * t, -len * t);
      ctx.lineTo(droop * 200 * t * t + wid * 1.2, -len * t - 40);
      ctx.moveTo(droop * 200 * t * t, -len * t);
      ctx.lineTo(droop * 200 * t * t - wid * 1.2, -len * t - 40);
      ctx.stroke();
    }
    // tears
    ctx.strokeStyle = 'rgba(255,255,230,0.25)';
    for (let k = 0; k < 5; k++) {
      const t = 0.3 + r() * 0.6;
      ctx.beginPath();
      ctx.moveTo(droop * 200 * t * t + 6, -len * t);
      ctx.lineTo(droop * 200 * t * t + wid, -len * t - 30);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.5;
    ctx.stroke(path);
    ctx.restore();
  }
  // red banana flower
  ctx.save();
  ctx.translate(cx + 60, base - 360);
  ctx.strokeStyle = '#4c6b2a';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(60, 40, 70, 150);
  ctx.stroke();
  ctx.fillStyle = '#7a1630';
  ctx.beginPath();
  ctx.ellipse(70, 190, 26, 50, 0.1, 0, TAU);
  ctx.fill();
  ctx.restore();
  grassTuft(ctx, cx, H - 20, W * 0.5, r);
  return c;
}

// ---------------------------------------------------------------- bougainvillea / rose bush mound
export function bougainvillea(W = 1000, H = 560, seed = 11) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  const r = rng(seed);
  const cx = W / 2;
  const base = H - 20;
  const inMound = (x, y) => {
    const u = (x - cx) / (W * 0.48);
    return y > base - (H - 40) * Math.sqrt(Math.max(0, 1 - u * u)) * (0.85 + 0.15 * Math.sin(x * 0.05));
  };
  const leaves = ['#1d4422', '#2a5a2c', '#3b7136', '#548a44'];
  for (let i = 0; i < 2600; i++) {
    const x = cx + (r() - 0.5) * W * 0.96;
    const y = base - r() * (H - 40);
    if (!inMound(x, y)) continue;
    const light = 1 - (y - 40) / H;
    ctx.fillStyle = leaves[Math.min(3, Math.floor(light * 3 + r() * 1.5))];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(r() * TAU);
    leafShape(ctx, 18 + r() * 10, 8);
    ctx.fill();
    ctx.restore();
  }
  // bracts: clusters of three papery magenta/crimson petals
  const reds = ['#c8102e', '#a50d2a', '#e0245a', '#d4194a', '#f25c7a'];
  for (let i = 0; i < 520; i++) {
    const x = cx + (r() - 0.5) * W * 0.92;
    const y = base - r() * (H - 60);
    if (!inMound(x, y + 10)) continue;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(r() * TAU);
    ctx.fillStyle = reds[Math.floor(r() * reds.length)];
    for (let k = 0; k < 3; k++) {
      ctx.rotate(TAU / 3);
      ctx.beginPath();
      ctx.ellipse(0, -7, 6, 9, 0, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = '#fff3d6';
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
  for (let i = 0; i < 70; i++) {
    const x = cx + (r() - 0.5) * W * 0.85;
    const y = base - r() * (H - 80);
    if (inMound(x, y + 12)) flower5(ctx, x, y, 7, '#fffaf0');
  }
  return c;
}

// ---------------------------------------------------------------- peacock perched, train hanging
export function peacock(W = 900, H = 1100) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  const r = rng(21);
  const perchY = 360;
  const bx = 330;
  // train: long feathers cascading down-right from the rump
  const rump = [bx + 120, perchY - 30];
  const feathers = [];
  for (let i = 0; i < 90; i++) {
    const t = r();
    feathers.push({ t, len: 380 + r() * 330, depth: r() });
  }
  feathers.sort((a, b) => b.len - a.len); // longest (back) first
  // soft train mass behind the feathers
  ctx.fillStyle = 'rgba(40,80,40,0.55)';
  ctx.beginPath();
  ctx.moveTo(rump[0] - 30, rump[1]);
  ctx.bezierCurveTo(rump[0] + 260, rump[1] + 120, rump[0] + 300, rump[1] + 520, rump[0] + 150, rump[1] + 720);
  ctx.bezierCurveTo(rump[0] + 40, rump[1] + 660, rump[0] - 20, rump[1] + 300, rump[0] - 30, rump[1]);
  ctx.fill();
  for (const F of feathers) {
    const t = F.t;
    const ang = 1.05 + t * 0.75;
    const len = F.len;
    const ex = rump[0] + Math.cos(ang) * len * 0.6 + 70;
    const ey = rump[1] + Math.sin(ang) * len;
    ctx.strokeStyle = 'rgba(80,110,40,0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(...rump);
    ctx.quadraticCurveTo(rump[0] + 160, rump[1] + len * 0.3, ex, ey);
    ctx.stroke();
    // barbs: soft bronze-green fringe along the shaft
    for (let k = 0.25; k < 0.95; k += 0.05) {
      const px = lerp(lerp(rump[0], rump[0] + 160, k), lerp(rump[0] + 160, ex, k), k);
      const py = lerp(lerp(rump[1], rump[1] + len * 0.3, k), lerp(rump[1] + len * 0.3, ey, k), k);
      ctx.fillStyle = `rgba(${90 + k * 40},${130 + k * 20},${50},0.35)`;
      ctx.beginPath();
      ctx.ellipse(px, py, 16 * k + 4, 6, ang, 0, TAU);
      ctx.fill();
    }
    // the eye
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(ang - Math.PI / 2);
    ctx.scale(0.75 + F.depth * 0.4, 0.75 + F.depth * 0.4);
    const rings = [
      ['#4f7a2a', 26, 34],
      ['#c9a02e', 19, 26],
      ['#1f7f86', 14, 19],
      ['#1d3f9a', 10, 13],
      ['#0d1c3a', 6, 8],
    ];
    for (const [col, rx, ry] of rings) {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }
  // perch (wall ledge line is the layer's own bottom edge is not used — perch is a short branch)
  ctx.fillStyle = '#6b4a24';
  ctx.fillRect(bx - 160, perchY + 4, 360, 14);
  // legs
  ctx.strokeStyle = '#8a7a6a';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(bx + 10, perchY - 40);
  ctx.lineTo(bx, perchY + 6);
  ctx.moveTo(bx + 50, perchY - 40);
  ctx.lineTo(bx + 46, perchY + 6);
  ctx.stroke();
  // body
  const body = ctx.createRadialGradient(bx - 20, perchY - 120, 10, bx + 20, perchY - 80, 150);
  body.addColorStop(0, '#2a6fd6');
  body.addColorStop(0.5, '#123f9c');
  body.addColorStop(1, '#0a2160');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(bx + 30, perchY - 80, 120, 62, -0.25, 0, TAU);
  ctx.fill();
  // wing: bronze with scale pattern
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(bx + 70, perchY - 70, 95, 46, -0.15, 0, TAU);
  ctx.clip();
  ctx.fillStyle = '#7a5a2a';
  ctx.fillRect(bx - 40, perchY - 130, 220, 120);
  for (let y = perchY - 125; y < perchY - 20; y += 12) {
    for (let x = bx - 30; x < bx + 170; x += 14) {
      ctx.strokeStyle = 'rgba(30,20,8,0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x + ((y / 12) % 2) * 7, y, 7, 0, Math.PI);
      ctx.stroke();
    }
  }
  ctx.fillStyle = 'rgba(40,90,60,0.55)';
  ctx.fillRect(bx + 90, perchY - 130, 120, 120);
  ctx.restore();
  // neck + head
  const neck = ctx.createLinearGradient(bx - 120, perchY - 300, bx - 10, perchY - 100);
  neck.addColorStop(0, '#2f7ef0');
  neck.addColorStop(1, '#0f3da0');
  ctx.fillStyle = neck;
  ctx.beginPath();
  ctx.moveTo(bx - 40, perchY - 120);
  ctx.bezierCurveTo(bx - 90, perchY - 170, bx - 70, perchY - 240, bx - 95, perchY - 285);
  ctx.bezierCurveTo(bx - 80, perchY - 315, bx - 40, perchY - 310, bx - 45, perchY - 270);
  ctx.bezierCurveTo(bx - 40, perchY - 220, bx - 10, perchY - 170, bx + 30, perchY - 135);
  ctx.closePath();
  ctx.fill();
  // face: white eye-stripe, beak
  ctx.fillStyle = '#f4f1e8';
  ctx.beginPath();
  ctx.ellipse(bx - 78, perchY - 292, 12, 5, -0.3, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(bx - 80, perchY - 293, 3, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#c9b08a';
  ctx.beginPath();
  ctx.moveTo(bx - 104, perchY - 290);
  ctx.lineTo(bx - 128, perchY - 282);
  ctx.lineTo(bx - 102, perchY - 280);
  ctx.fill();
  // crest fan
  for (let i = 0; i < 6; i++) {
    const a = -1.9 + i * 0.16;
    const x2 = bx - 82 + Math.cos(a) * 46;
    const y2 = perchY - 305 + Math.sin(a) * 46;
    ctx.strokeStyle = '#2a4a6a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx - 82, perchY - 305);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.fillStyle = '#1d5fd0';
    ctx.beginPath();
    ctx.arc(x2, y2, 5, 0, TAU);
    ctx.fill();
  }
  // ink outline on body for the miniature look
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(bx + 30, perchY - 80, 120, 62, -0.25, 0, TAU);
  ctx.stroke();
  return c;
}

// ---------------------------------------------------------------- chhatri pavilion
export function chhatri(W = 900, H = 1200) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  const cx = W / 2;
  const plinthY = H - 40;
  const stone = (x0, x1) => {
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, SAND[2]);
    g.addColorStop(0.35, SAND[0]);
    g.addColorStop(0.7, SAND[1]);
    g.addColorStop(1, SAND[3]);
    return g;
  };
  const outline = () => {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.stroke();
  };
  // plinth with steps
  [[0.86, 40], [0.76, 34], [0.68, 30]].forEach(([w, h], i) => {
    const y = plinthY - [0, 40, 74][i];
    ctx.fillStyle = stone(cx - (W * w) / 2, cx + (W * w) / 2);
    ctx.beginPath();
    ctx.rect(cx - (W * w) / 2, y - h, W * w, h);
    ctx.fill();
    outline();
    // inlay band
    ctx.fillStyle = '#b8283a';
    for (let x = cx - (W * w) / 2 + 14; x < cx + (W * w) / 2 - 14; x += 28) {
      ctx.beginPath();
      ctx.arc(x, y - h / 2, 4, 0, TAU);
      ctx.fill();
    }
  });
  const floorY = plinthY - 104;
  const colTop = floorY - 360;
  const span = W * 0.62;
  const cols = [-1, -1 / 3, 1 / 3, 1].map((u) => cx + (u * span) / 2);
  // dark interior
  ctx.fillStyle = '#3a1a10';
  ctx.fillRect(cols[0], colTop, span, floorY - colTop);
  // cusped arches between the columns
  for (let i = 0; i < 3; i++) {
    const x0 = cols[i] + 18;
    const x1 = cols[i + 1] - 18;
    const mid = (x0 + x1) / 2;
    const archTop = colTop + 40;
    const spring = colTop + 150;
    ctx.fillStyle = stone(x0, x1);
    ctx.beginPath();
    ctx.rect(x0 - 18, colTop, x1 - x0 + 36, spring - colTop + 10);
    ctx.fill();
    // cut the arch (interior colour)
    ctx.fillStyle = '#3a1a10';
    ctx.beginPath();
    ctx.moveTo(x0, floorY);
    ctx.lineTo(x0, spring);
    const lobes = 5;
    for (let k = 0; k <= lobes; k++) {
      const a = Math.PI + (k / lobes) * Math.PI;
      const px = mid + Math.cos(a) * (x1 - x0) / 2;
      const py = spring + Math.sin(a) * (spring - archTop);
      ctx.quadraticCurveTo(px - Math.cos(a) * 14, py - Math.sin(a) * 14, px, py);
    }
    ctx.lineTo(x1, floorY);
    ctx.fill();
    // garland swag in the arch
    ctx.strokeStyle = '#f59e1b';
    ctx.lineWidth = 7;
    ctx.setLineDash([2, 9]);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x0 + 6, spring + 10);
    ctx.quadraticCurveTo(mid, spring + 70, x1 - 6, spring + 10);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  // columns
  cols.forEach((x) => {
    ctx.fillStyle = stone(x - 18, x + 18);
    ctx.beginPath();
    ctx.rect(x - 16, colTop, 32, floorY - colTop);
    ctx.fill();
    outline();
    ctx.fillStyle = gold(ctx, x - 22, 0, x + 22, 0);
    ctx.fillRect(x - 22, floorY - 20, 44, 20);
    ctx.fillRect(x - 22, colTop, 44, 18);
    for (let y = colTop + 50; y < floorY - 30; y += 60) {
      ctx.fillStyle = '#b8283a';
      ctx.beginPath();
      ctx.moveTo(x, y - 10);
      ctx.lineTo(x + 7, y);
      ctx.lineTo(x, y + 10);
      ctx.lineTo(x - 7, y);
      ctx.fill();
    }
  });
  // chhajja (sloping eave) with brackets
  const eaveY = colTop - 10;
  ctx.fillStyle = stone(cx - span * 0.62, cx + span * 0.62);
  ctx.beginPath();
  ctx.moveTo(cx - span * 0.62, eaveY + 30);
  ctx.lineTo(cx - span * 0.52, eaveY - 30);
  ctx.lineTo(cx + span * 0.52, eaveY - 30);
  ctx.lineTo(cx + span * 0.62, eaveY + 30);
  ctx.closePath();
  ctx.fill();
  outline();
  ctx.fillStyle = 'rgba(80,40,20,0.25)';
  for (let x = cx - span * 0.55; x < cx + span * 0.55; x += 22) ctx.fillRect(x, eaveY + 4, 3, 24);
  // drum
  const drumY = eaveY - 30;
  ctx.fillStyle = stone(cx - span * 0.42, cx + span * 0.42);
  ctx.fillRect(cx - span * 0.42, drumY - 60, span * 0.84, 60);
  ctx.strokeStyle = INK;
  ctx.strokeRect(cx - span * 0.42, drumY - 60, span * 0.84, 60);
  for (let x = cx - span * 0.38; x < cx + span * 0.38; x += 36) {
    ctx.fillStyle = '#b8283a';
    ctx.beginPath();
    ctx.arc(x + 18, drumY - 30, 9, 0, TAU);
    ctx.fill();
  }
  // dome with ribs
  const domeBase = drumY - 60;
  const R = span * 0.42;
  const domeGrad = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
  domeGrad.addColorStop(0, SAND[2]);
  domeGrad.addColorStop(0.3, '#fffaf0');
  domeGrad.addColorStop(0.7, SAND[1]);
  domeGrad.addColorStop(1, SAND[3]);
  ctx.fillStyle = domeGrad;
  ctx.beginPath();
  ctx.moveTo(cx - R, domeBase);
  ctx.bezierCurveTo(cx - R * 1.15, domeBase - R * 0.9, cx - R * 0.2, domeBase - R * 1.15, cx, domeBase - R * 1.35);
  ctx.bezierCurveTo(cx + R * 0.2, domeBase - R * 1.15, cx + R * 1.15, domeBase - R * 0.9, cx + R, domeBase);
  ctx.closePath();
  ctx.fill();
  outline();
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = 'rgba(120,80,30,0.45)';
  ctx.lineWidth = 2;
  for (let k = -6; k <= 6; k++) {
    ctx.beginPath();
    ctx.moveTo(cx + (k / 6) * R, domeBase);
    ctx.quadraticCurveTo(cx + (k / 6) * R * 0.9, domeBase - R, cx, domeBase - R * 1.35);
    ctx.stroke();
  }
  ctx.restore();
  // lotus crown + kalash finial
  ctx.fillStyle = gold(ctx, cx - 40, 0, cx + 40, 0);
  const fy = domeBase - R * 1.35;
  ctx.beginPath();
  ctx.ellipse(cx, fy - 6, 34, 12, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, fy - 34, 18, 0, TAU);
  ctx.fill();
  ctx.fillRect(cx - 4, fy - 100, 8, 70);
  ctx.beginPath();
  ctx.arc(cx, fy - 104, 9, 0, TAU);
  ctx.fill();
  // little corner domes on the eave
  [-1, 1].forEach((s) => {
    const x = cx + s * span * 0.5;
    ctx.fillStyle = domeGrad;
    ctx.beginPath();
    ctx.arc(x, eaveY - 30, 30, Math.PI, 0);
    ctx.fill();
    outline();
    ctx.fillStyle = gold(ctx, x - 10, 0, x + 10, 0);
    ctx.fillRect(x - 3, eaveY - 80, 6, 22);
  });
  return c;
}

/** Pietra-dura inlay band: red and rose flowers with green leaves on ivory, gilt edge. */
export function inlayBand(ctx, x, y, w, h) {
  ctx.fillStyle = '#efe2c4';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = gold(ctx, x, y, x + w, y + h);
  ctx.lineWidth = 5;
  ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
  const vertical = h > w;
  const step = Math.min(w, h) * 0.9;
  const n = Math.floor((vertical ? h : w) / step);
  for (let i = 0; i < n; i++) {
    const px = vertical ? x + w / 2 : x + step / 2 + i * step;
    const py = vertical ? y + step / 2 + i * step : y + h / 2;
    ctx.save();
    ctx.translate(px, py);
    ctx.fillStyle = '#4c7a36';
    for (let k = 0; k < 4; k++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.ellipse(0, -step * 0.26, step * 0.08, step * 0.2, 0, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
    flower5(ctx, px, py, step * 0.2, i % 2 ? '#c8102e' : '#e0457b');
  }
}

/** Cusped (multifoil) arch outline from the floor up; caller fills / strokes / cuts. */
function cuspedArch(ctx, cx, openW, ground, spring, crown, lobes = 7, bite = 22) {
  ctx.beginPath();
  ctx.moveTo(cx - openW / 2, ground + 2);
  ctx.lineTo(cx - openW / 2, spring);
  for (let k = 0; k <= lobes; k++) {
    const a = Math.PI + (k / lobes) * Math.PI;
    const px = cx + (Math.cos(a) * openW) / 2;
    const py = spring + Math.sin(a) * (spring - crown);
    ctx.quadraticCurveTo(px - Math.cos(a) * bite, py - Math.sin(a) * bite, px, py);
  }
  ctx.lineTo(cx + openW / 2, ground + 2);
  ctx.closePath();
}

// ---------------------------------------------------------------- ivory arcade (mandap backdrop): three cusped arches open to the garden
/** 10 m × 6.6 m. Centre opening 3.0 m (behind the couple's arch), side openings 2.1 m. */
export function arcade(W = 2400, H = 1584) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  const m = W / 10;
  const stone = ctx.createLinearGradient(0, 0, W, 0);
  stone.addColorStop(0, '#d9c59c');
  stone.addColorStop(0.5, '#fbf3e1');
  stone.addColorStop(1, '#d9c59c');
  ctx.fillStyle = stone;
  ctx.fillRect(0, 0.55 * m, W, H - 0.55 * m);
  // cornice + parapet with little domes
  inlayBand(ctx, 0, 0.55 * m, W, 0.38 * m);
  ctx.fillStyle = '#e8d8b4';
  for (let x = 0.4 * m; x < W; x += 1.6 * m) {
    ctx.beginPath();
    ctx.arc(x, 0.55 * m, 0.32 * m, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = gold(ctx, x - 6, 0, x + 6, 0);
    ctx.fillRect(x - 3, 0.1 * m, 6, 0.16 * m);
    ctx.fillStyle = '#e8d8b4';
  }
  const ground = H;
  const arches = [
    [W / 2, 3.0 * m, ground - 3.7 * m, ground - 5.05 * m],
    [W / 2 - 3.3 * m, 2.1 * m, ground - 3.1 * m, ground - 4.1 * m],
    [W / 2 + 3.3 * m, 2.1 * m, ground - 3.1 * m, ground - 4.1 * m],
  ];
  // spandrel jaali dots
  ctx.fillStyle = 'rgba(150,110,60,0.22)';
  for (let y = 1.1 * m; y < ground - 3 * m; y += 18) for (let x = 0; x < W; x += 18) {
    ctx.beginPath();
    ctx.arc(x + ((y / 18) % 2) * 9, y, 2.4, 0, TAU);
    ctx.fill();
  }
  for (const [cx, w, spring, crown] of arches) {
    cuspedArch(ctx, cx, w, ground, spring, crown);
    ctx.lineWidth = 30;
    ctx.strokeStyle = gold(ctx, cx - w, 0, cx + w, 0);
    ctx.stroke();
    ctx.lineWidth = 9;
    ctx.strokeStyle = '#7a1424';
    ctx.stroke();
  }
  // pilasters between the arches, inlaid, with garland swags
  [W / 2 - 1.95 * m, W / 2 + 1.95 * m, 0.45 * m, W - 0.45 * m].forEach((x) => inlayBand(ctx, x - 0.2 * m, ground - 3.6 * m, 0.4 * m, 3.6 * m));
  ctx.lineCap = 'round';
  ctx.setLineDash([3, 11]);
  ctx.lineWidth = 12;
  for (const [cx, w, spring] of arches) {
    ctx.strokeStyle = '#f59e1b';
    ctx.beginPath();
    ctx.moveTo(cx - w / 2 - 10, spring - 20);
    ctx.quadraticCurveTo(cx, spring + 0.6 * m, cx + w / 2 + 10, spring - 20);
    ctx.stroke();
    ctx.strokeStyle = '#fff4e0';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(cx - w / 2 + 20, spring + 10);
    ctx.quadraticCurveTo(cx, spring + 0.85 * m, cx + w / 2 - 20, spring + 10);
    ctx.stroke();
    ctx.lineWidth = 12;
  }
  ctx.setLineDash([]);
  // cut the openings
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = '#000';
  for (const [cx, w, spring, crown] of arches) {
    cuspedArch(ctx, cx, w, ground, spring, crown);
    ctx.fill();
  }
  ctx.restore();
  return c;
}

// ---------------------------------------------------------------- jharokha gateway frame (opening cut out)
/**
 * Proportions match the 3D doorway: the painting is 8.2 m tall; the opening is 3.4 m wide and its
 * springing line sits at 4.5 m, the cusped crown at 5.6 m, centred.
 */
export function gate(W = 1280, H = 2000) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  const m = H / 8.2; // px per metre
  const cx = W / 2;
  const ground = H;
  const openW = 3.4 * m;
  const spring = ground - 4.5 * m;
  const crown = ground - 5.7 * m;
  const frameW = 6.1 * m;
  const frameTop = ground - 6.6 * m;
  const stone = ctx.createLinearGradient(cx - frameW / 2, 0, cx + frameW / 2, 0);
  stone.addColorStop(0, '#cdb88f');
  stone.addColorStop(0.2, '#f2e6cb');
  stone.addColorStop(0.5, '#fbf3e1');
  stone.addColorStop(0.8, '#ecdcbc');
  stone.addColorStop(1, '#bfa77a');
  // main frame block
  ctx.fillStyle = stone;
  ctx.fillRect(cx - frameW / 2, frameTop, frameW, ground - frameTop);
  // inlay border bands (pietra dura: red flowers, green leaves on ivory)
  const band = (x, y, w, h) => {
    ctx.fillStyle = '#efe2c4';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = gold(ctx, x, y, x + w, y + h);
    ctx.lineWidth = 5;
    ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
    const vertical = h > w;
    const n = Math.floor((vertical ? h : w) / 46);
    for (let i = 0; i < n; i++) {
      const px = vertical ? x + w / 2 : x + 23 + i * 46;
      const py = vertical ? y + 23 + i * 46 : y + h / 2;
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = '#4c7a36';
      for (let k = 0; k < 4; k++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.ellipse(0, -12, 4, 9, 0, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
      flower5(ctx, px, py, 9, i % 2 ? '#c8102e' : '#e0457b');
    }
  };
  const bw = 0.42 * m;
  band(cx - frameW / 2 + 20, frameTop + 20, bw, ground - frameTop - 20);
  band(cx + frameW / 2 - 20 - bw, frameTop + 20, bw, ground - frameTop - 20);
  band(cx - frameW / 2 + 20, frameTop + 20, frameW - 40, bw);
  // spandrels with jaali dots
  ctx.fillStyle = 'rgba(150,110,60,0.25)';
  for (let y = frameTop + bw + 40; y < spring; y += 22) {
    for (let x = cx - frameW / 2 + bw + 40; x < cx + frameW / 2 - bw - 40; x += 22) {
      if (Math.abs(x - cx) < openW / 2 + 30 && y > crown - 30) continue;
      ctx.beginPath();
      ctx.arc(x + ((y / 22) % 2) * 11, y, 3, 0, TAU);
      ctx.fill();
    }
  }
  // the cusped (multifoil) opening, cut out
  const archPath = () => {
    ctx.beginPath();
    ctx.moveTo(cx - openW / 2, ground + 2);
    ctx.lineTo(cx - openW / 2, spring);
    const lobes = 7;
    for (let k = 0; k <= lobes; k++) {
      const a = Math.PI + (k / lobes) * Math.PI;
      const px = cx + (Math.cos(a) * openW) / 2;
      const py = spring + Math.sin(a) * (spring - crown);
      ctx.quadraticCurveTo(px - Math.cos(a) * 26, py - Math.sin(a) * 26, px, py);
    }
    ctx.lineTo(cx + openW / 2, ground + 2);
    ctx.closePath();
  };
  // gilded arch moulding
  ctx.save();
  ctx.translate(0, 0);
  archPath();
  ctx.lineWidth = 34;
  ctx.strokeStyle = gold(ctx, cx - openW, 0, cx + openW, 0);
  ctx.stroke();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#7a1424';
  ctx.stroke();
  ctx.restore();
  ctx.save();
  archPath();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = '#000'; // fully opaque, or the cut only fades the stone
  ctx.fill();
  ctx.restore();
  // pilasters either side of the opening
  [-1, 1].forEach((s) => {
    const x = cx + s * (openW / 2 + 40);
    ctx.fillStyle = gold(ctx, x - 18, 0, x + 18, 0);
    ctx.fillRect(x - 14, spring - 40, 28, ground - spring + 40);
    for (let y = spring; y < ground; y += 70) {
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, TAU);
      ctx.fill();
    }
  });
  // bangaldar roof canopy above the frame: curved eave, ribbed vault, three finials
  const roofBase = frameTop + 10;
  const roofW = frameW * 1.06;
  ctx.fillStyle = stone;
  ctx.beginPath();
  ctx.moveTo(cx - roofW / 2, roofBase);
  ctx.quadraticCurveTo(cx, roofBase - 0.9 * m, cx + roofW / 2, roofBase);
  ctx.lineTo(cx + roofW / 2 - 30, roofBase + 40);
  ctx.quadraticCurveTo(cx, roofBase - 0.6 * m, cx - roofW / 2 + 30, roofBase + 40);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.stroke();
  const vaultTop = roofBase - 1.45 * m;
  ctx.fillStyle = stone;
  ctx.beginPath();
  ctx.moveTo(cx - roofW * 0.44, roofBase - 0.25 * m);
  ctx.bezierCurveTo(cx - roofW * 0.44, vaultTop, cx + roofW * 0.44, vaultTop, cx + roofW * 0.44, roofBase - 0.25 * m);
  ctx.quadraticCurveTo(cx, roofBase - 0.75 * m, cx - roofW * 0.44, roofBase - 0.25 * m);
  ctx.fill();
  ctx.stroke();
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = 'rgba(110,80,40,0.5)';
  ctx.lineWidth = 3;
  for (let k = -12; k <= 12; k++) {
    ctx.beginPath();
    ctx.moveTo(cx + (k / 12) * roofW * 0.44, roofBase - 0.25 * m);
    ctx.quadraticCurveTo(cx + (k / 12) * roofW * 0.3, vaultTop + 20, cx + (k / 12) * roofW * 0.12, vaultTop - 10);
    ctx.stroke();
  }
  ctx.restore();
  [-0.3, 0, 0.3].forEach((u) => {
    const x = cx + u * roofW;
    const y = vaultTop + Math.abs(u) * 140 + 30;
    ctx.fillStyle = gold(ctx, x - 20, 0, x + 20, 0);
    ctx.beginPath();
    ctx.ellipse(x, y - 10, 26, 10, 0, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y - 36, 15, 0, TAU);
    ctx.fill();
    ctx.fillRect(x - 3, y - 100, 6, 60);
    ctx.beginPath();
    ctx.arc(x, y - 104, 7, 0, TAU);
    ctx.fill();
  });
  // hanging bells under the eave
  for (let x = cx - roofW / 2 + 60; x < cx + roofW / 2 - 40; x += 90) {
    ctx.strokeStyle = GOLD[1];
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, roofBase + 30);
    ctx.lineTo(x, roofBase + 70);
    ctx.stroke();
    ctx.fillStyle = gold(ctx, x - 8, 0, x + 8, 0);
    ctx.beginPath();
    ctx.moveTo(x - 9, roofBase + 86);
    ctx.quadraticCurveTo(x, roofBase + 56, x + 9, roofBase + 86);
    ctx.fill();
  }
  return c;
}

// ---------------------------------------------------------------- ivory door leaf (reel style)
export function doorLeaf(W = 512, H = 1472) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, '#e9dcbf');
  g.addColorStop(0.5, '#fbf3e2');
  g.addColorStop(1, '#e2d2b0');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const r = rng(5);
  ctx.strokeStyle = gold(ctx, 0, 0, W, H);
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, W - 16, H - 16);
  // three arched niches, each with a painted flowering tree
  const niches = [
    [0.12, 0.04, 0.76, 0.27],
    [0.12, 0.34, 0.76, 0.34],
    [0.12, 0.72, 0.76, 0.24],
  ];
  niches.forEach(([nx, ny, nw, nh]) => {
    const x = nx * W;
    const y = ny * H;
    const w = nw * W;
    const h = nh * H;
    const mid = x + w / 2;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + w * 0.5);
    ctx.bezierCurveTo(x, y + 10, mid - 20, y + 20, mid, y);
    ctx.bezierCurveTo(mid + 20, y + 20, x + w, y + 10, x + w, y + w * 0.5);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    const ng = ctx.createLinearGradient(x, y, x + w, y + h);
    ng.addColorStop(0, '#d9ccad');
    ng.addColorStop(0.15, '#f3ead6');
    ng.addColorStop(0.85, '#efe4cc');
    ng.addColorStop(1, '#fffaf0');
    ctx.fillStyle = ng;
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.strokeStyle = gold(ctx, x, y, x + w, y + h);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = INK;
    ctx.stroke();
    // flowering tree: stem, symmetric branches, leaves, red flowers
    const top = y + h * 0.18;
    const bot = y + h - 20;
    ctx.strokeStyle = '#6a5a3a';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(mid, bot);
    ctx.lineTo(mid, top);
    ctx.stroke();
    for (let k = 0; k < 7; k++) {
      const yy = lerp(bot - 20, top + 10, k / 6);
      const reach = w * 0.34 * Math.sin(((k + 1) / 8) * Math.PI);
      [-1, 1].forEach((s) => {
        ctx.strokeStyle = '#6a5a3a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(mid, yy + 10);
        ctx.quadraticCurveTo(mid + s * reach * 0.6, yy, mid + s * reach, yy - 14);
        ctx.stroke();
        for (let l = 1; l <= 3; l++) {
          ctx.save();
          ctx.translate(mid + s * reach * (l / 3.4), yy + 6 - l * 6);
          ctx.rotate(s * (0.9 + r() * 0.4));
          ctx.fillStyle = l % 2 ? '#3f6e30' : '#5f8a46';
          leafShape(ctx, 26, 10);
          ctx.fill();
          ctx.restore();
        }
        flower5(ctx, mid + s * reach, yy - 16, 12, k % 2 ? '#c8102e' : '#e0457b');
      });
    }
    // pot
    ctx.fillStyle = gold(ctx, mid - 26, 0, mid + 26, 0);
    ctx.beginPath();
    ctx.moveTo(mid - 26, bot - 4);
    ctx.quadraticCurveTo(mid, bot + 26, mid + 26, bot - 4);
    ctx.fill();
  });
  // studs
  for (const v of [0.31, 0.69]) for (let i = 0; i < 5; i++) {
    const gx = W * (0.18 + i * 0.16);
    const gg = ctx.createRadialGradient(gx - 3, H * v - 3, 1, gx, H * v, 9);
    gg.addColorStop(0, '#fff3c9');
    gg.addColorStop(1, '#8a5f1c');
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(gx, H * v, 9, 0, TAU);
    ctx.fill();
  }
  return c;
}

export const ART = { cypress, plantain, bougainvillea, peacock, chhatri, gate, 'door-leaf': doorLeaf };
