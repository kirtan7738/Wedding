/**
 * Canvas painters for the cinema world — every texture is drawn at runtime (no downloads):
 * carved temple doors, haveli wall, rangoli, the arched couple frame. Shared by the WebGL world and
 * the CSS-door fallback (via toDataURL).
 */

const TAU = Math.PI * 2;

export function makeCanvas(w, h) {
  const c = typeof OffscreenCanvas !== 'undefined' && !globalThis.document ? new OffscreenCanvas(w, h) : document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const GOLD = ['#7a4f14', '#c99a3b', '#f3d58a', '#fff3c9'];

function goldGrad(ctx, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, GOLD[0]);
  g.addColorStop(0.35, GOLD[1]);
  g.addColorStop(0.5, GOLD[3]);
  g.addColorStop(0.65, GOLD[1]);
  g.addColorStop(1, GOLD[0]);
  return g;
}

/** Raised boss (brass stud) with a highlight — reads as 3D under the scene lights. */
function boss(ctx, x, y, r) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, '#fff6d0');
  g.addColorStop(0.35, '#e2b65a');
  g.addColorStop(0.8, '#8a5a17');
  g.addColorStop(1, '#3a2006');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
}

/** Lotus / mandala rosette made of petal rings. */
function rosette(ctx, x, y, R, { rings = 3, petals = 12, fill = true } = {}) {
  ctx.save();
  ctx.translate(x, y);
  for (let k = rings; k >= 1; k--) {
    const r = (R * k) / rings;
    const n = petals + (k - 1) * 4;
    ctx.save();
    ctx.rotate(k % 2 ? 0 : Math.PI / n);
    for (let i = 0; i < n; i++) {
      ctx.rotate(TAU / n);
      ctx.beginPath();
      ctx.moveTo(0, r * 0.35);
      ctx.quadraticCurveTo(r * 0.28, r * 0.68, 0, r);
      ctx.quadraticCurveTo(-r * 0.28, r * 0.68, 0, r * 0.35);
      if (fill) {
        ctx.fillStyle = goldGrad(ctx, -r * 0.3, r * 0.3, r * 0.3, r);
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(40,10,4,0.55)';
      ctx.lineWidth = Math.max(1, R * 0.012);
      ctx.stroke();
    }
    ctx.restore();
  }
  boss(ctx, 0, 0, R * 0.2);
  ctx.restore();
}

function lacquer(ctx, w, h, base = ['#5a0a14', '#8f1423', '#5a0a14']) {
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, base[0]);
  g.addColorStop(0.5, base[1]);
  g.addColorStop(1, base[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // wood grain / lacquer sheen
  const r = rng(7);
  ctx.globalAlpha = 0.07;
  for (let i = 0; i < 160; i++) {
    ctx.strokeStyle = r() > 0.5 ? '#000' : '#ff9a7a';
    ctx.lineWidth = 1 + r() * 2;
    const x = r() * w;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + (r() - 0.5) * 30, h * 0.3, x + (r() - 0.5) * 30, h * 0.7, x + (r() - 0.5) * 20, h);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function bandBorder(ctx, x, y, w, h, t) {
  ctx.lineWidth = t;
  ctx.strokeStyle = goldGrad(ctx, x, y, x + w, y + h);
  ctx.strokeRect(x + t / 2, y + t / 2, w - t, h - t);
  ctx.lineWidth = Math.max(1, t * 0.18);
  ctx.strokeStyle = 'rgba(30,6,2,0.7)';
  ctx.strokeRect(x + t * 1.2, y + t * 1.2, w - t * 2.4, h - t * 2.4);
}

/** One carved door leaf (the right leaf is the mirror). 512 × 1472 ≈ 1.6 × 4.6 m. */
export function paintDoor(w = 512, h = 1472, { mirror = false } = {}) {
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  lacquer(ctx, w, h);
  bandBorder(ctx, 0, 0, w, h, 26);
  // recessed panels with rosettes
  const panels = [
    [0.1, 0.05, 0.8, 0.2],
    [0.1, 0.28, 0.8, 0.34],
    [0.1, 0.65, 0.8, 0.3],
  ];
  panels.forEach(([px, py, pw, ph], i) => {
    const X = px * w;
    const Y = py * h;
    const W = pw * w;
    const H = ph * h;
    const inner = ctx.createLinearGradient(X, Y, X, Y + H);
    inner.addColorStop(0, 'rgba(0,0,0,0.45)');
    inner.addColorStop(0.08, 'rgba(0,0,0,0.05)');
    inner.addColorStop(0.92, 'rgba(255,170,120,0.05)');
    inner.addColorStop(1, 'rgba(255,190,140,0.25)');
    ctx.fillStyle = inner;
    ctx.fillRect(X, Y, W, H);
    bandBorder(ctx, X, Y, W, H, 12);
    if (i === 1) {
      // arch niche with a big lotus
      ctx.save();
      ctx.beginPath();
      const ax = X + W / 2;
      ctx.moveTo(X + 30, Y + H - 30);
      ctx.lineTo(X + 30, Y + H * 0.42);
      ctx.bezierCurveTo(X + 30, Y + 60, ax - 30, Y + 60, ax, Y + 34);
      ctx.bezierCurveTo(ax + 30, Y + 60, X + W - 30, Y + 60, X + W - 30, Y + H * 0.42);
      ctx.lineTo(X + W - 30, Y + H - 30);
      ctx.closePath();
      ctx.lineWidth = 10;
      ctx.strokeStyle = goldGrad(ctx, X, Y, X + W, Y + H);
      ctx.stroke();
      ctx.restore();
      rosette(ctx, ax, Y + H * 0.58, W * 0.32, { rings: 3, petals: 10 });
    } else {
      rosette(ctx, X + W / 2, Y + H / 2, Math.min(W, H) * 0.32, { rings: 2, petals: 12 });
      // corner buds
      [[0.14, 0.18], [0.86, 0.18], [0.14, 0.82], [0.86, 0.82]].forEach(([u, v]) => boss(ctx, X + u * W, Y + v * H, 9));
    }
  });
  // stud rows (brass bosses) between panels
  [0.265, 0.632, 0.962].forEach((v) => {
    for (let i = 0; i < 6; i++) boss(ctx, w * (0.14 + i * 0.144), h * v - 6, 11);
  });
  // ring knocker near the meeting edge
  const kx = mirror ? w * 0.12 : w * 0.88;
  const ky = h * 0.52;
  ctx.lineWidth = 9;
  ctx.strokeStyle = goldGrad(ctx, kx - 40, ky, kx + 40, ky + 80);
  ctx.beginPath();
  ctx.arc(kx, ky + 34, 34, 0, TAU);
  ctx.stroke();
  boss(ctx, kx, ky, 16);
  if (mirror) {
    const m = makeCanvas(w, h);
    const mc = m.getContext('2d');
    mc.translate(w, 0);
    mc.scale(-1, 1);
    mc.drawImage(c, 0, 0);
    return m;
  }
  return c;
}

/** Haveli wall around the doorway: maroon plaster, gold jharokha outlines and a carved frieze. Tileable in x. */
export function paintWall(w = 1024, h = 1024) {
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#efe2c6');
  g.addColorStop(0.6, '#e4d2ae');
  g.addColorStop(1, '#d6c098');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const r = rng(11);
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 2500; i++) {
    ctx.fillStyle = r() > 0.5 ? '#8a6a3a' : '#ffffff';
    ctx.fillRect(r() * w, r() * h, 2, 2);
  }
  ctx.globalAlpha = 1;
  // jharokha (arched window) outlines
  for (let k = 0; k < 2; k++) {
    const cx = w * (0.25 + k * 0.5);
    const top = h * 0.18;
    const bw = w * 0.28;
    const bh = h * 0.5;
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(160,110,40,0.7)';
    ctx.beginPath();
    ctx.moveTo(cx - bw / 2, top + bh);
    ctx.lineTo(cx - bw / 2, top + bh * 0.35);
    ctx.bezierCurveTo(cx - bw / 2, top, cx - 20, top + 10, cx, top - 20);
    ctx.bezierCurveTo(cx + 20, top + 10, cx + bw / 2, top, cx + bw / 2, top + bh * 0.35);
    ctx.lineTo(cx + bw / 2, top + bh);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'rgba(122,20,36,0.18)';
    ctx.fill();
    rosette(ctx, cx, top + bh * 0.55, bw * 0.22, { rings: 2, petals: 10 });
  }
  // frieze band
  ctx.fillStyle = goldGrad(ctx, 0, h * 0.86, 0, h * 0.9);
  ctx.fillRect(0, h * 0.86, w, h * 0.012);
  ctx.fillRect(0, h * 0.94, w, h * 0.012);
  for (let i = 0; i < 16; i++) boss(ctx, (i + 0.5) * (w / 16), h * 0.9, 9);
  return c;
}

/** Rangoli — radial, saturated powder colours with a soft grainy edge. */
export function paintRangoli(size = 1024, seed = 3, palette = null, ground = null) {
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d');
  const R = size / 2;
  if (ground) {
    ctx.fillStyle = ground;
    ctx.fillRect(0, 0, size, size);
  }
  ctx.translate(R, R);
  const cols = palette || ['#c8102e', '#f08a12', '#ffc21a', '#2f8f5b', '#1d5fa8', '#e0457b', '#fff4dc'];
  const r = rng(seed);
  const ring = (rad, n, len, wid, col, rot = 0) => {
    ctx.save();
    ctx.rotate(rot);
    for (let i = 0; i < n; i++) {
      ctx.rotate(TAU / n);
      ctx.beginPath();
      ctx.moveTo(0, rad);
      ctx.quadraticCurveTo(wid, rad + len * 0.5, 0, rad + len);
      ctx.quadraticCurveTo(-wid, rad + len * 0.5, 0, rad);
      ctx.fillStyle = col;
      ctx.fill();
    }
    ctx.restore();
  };
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ring(R * 0.62, 24, R * 0.34, R * 0.09, cols[0]);
  ring(R * 0.66, 24, R * 0.24, R * 0.05, cols[1], Math.PI / 24);
  ring(R * 0.42, 16, R * 0.26, R * 0.1, cols[2]);
  ring(R * 0.45, 16, R * 0.18, R * 0.05, cols[5]);
  ring(R * 0.22, 12, R * 0.22, R * 0.08, cols[3], Math.PI / 12);
  ring(R * 0.24, 12, R * 0.14, R * 0.04, cols[6], Math.PI / 12);
  ring(R * 0.05, 8, R * 0.2, R * 0.07, cols[4]);
  // dotted circles
  [0.4, 0.6, 0.97].forEach((k, j) => {
    const n = Math.round(60 * k + 20);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * R * k, Math.sin(a) * R * k, R * 0.012, 0, TAU);
      ctx.fillStyle = j === 2 ? cols[6] : cols[2];
      ctx.fill();
    }
  });
  ctx.beginPath();
  ctx.arc(0, 0, R * 0.07, 0, TAU);
  ctx.fillStyle = cols[2];
  ctx.fill();
  // powder grain
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    const n = (r() - 0.5) * 50;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
    if (r() < 0.08) d[i + 3] = 120;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/** Red silk backdrop with a gold border and woven butis; folds are added in the shader. */
export function paintSilk(w = 512, h = 512) {
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#8d1022';
  ctx.fillRect(0, 0, w, h);
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const cx = (x + (y % 2 ? 0.5 : 0)) * (w / 8);
      const cy = (y + 0.5) * (h / 8);
      ctx.fillStyle = 'rgba(243,213,138,0.55)';
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * TAU;
        ctx.ellipse(cx + Math.cos(a) * 6, cy + Math.sin(a) * 6, 5, 2.5, a, 0, TAU);
      }
      ctx.fill();
    }
  }
  return c;
}

/** Soft radial glow (bokeh, flames, light). */
export function paintGlow(size = 128) {
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.2, 'rgba(255,255,255,0.6)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.15)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}

/**
 * The couple photo inside a carved gold arch with a deep velvet mat — painted as one texture so the
 * 3D frame is a single cheap quad. Returns the canvas (aspect 3:4).
 */
export function paintArchFrame(img, w = 768, h = 1024, emblem = null) {
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  const arch = (inset) => {
    const x0 = inset;
    const x1 = w - inset;
    const y1 = h - inset;
    const rr = (x1 - x0) / 2;
    const yTop = inset + rr * 0.95;
    ctx.beginPath();
    ctx.moveTo(x0, y1);
    ctx.lineTo(x0, yTop);
    ctx.bezierCurveTo(x0, yTop - rr * 0.9, w / 2 - rr * 0.35, inset + rr * 0.15, w / 2, inset);
    ctx.bezierCurveTo(w / 2 + rr * 0.35, inset + rr * 0.15, x1, yTop - rr * 0.9, x1, yTop);
    ctx.lineTo(x1, y1);
    ctx.closePath();
  };
  // outer gold
  arch(4);
  ctx.fillStyle = goldGrad(ctx, 0, 0, w, h);
  ctx.fill();
  // carved bead line
  arch(26);
  ctx.fillStyle = '#5a0a14';
  ctx.fill();
  arch(36);
  ctx.fillStyle = goldGrad(ctx, w, 0, 0, h);
  ctx.fill();
  // photo
  ctx.save();
  arch(50);
  ctx.clip();
  if (img) {
    const s = Math.max((w - 100) / img.width, (h - 100) / img.height);
    const iw = img.width * s;
    const ih = img.height * s;
    ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2 + 20, iw, ih);
  } else {
    paintEmblem(ctx, w, h, emblem);
  }
  // warm grade + vignette inside the arch
  const v = ctx.createRadialGradient(w / 2, h * 0.5, h * 0.2, w / 2, h * 0.5, h * 0.75);
  v.addColorStop(0, 'rgba(255,190,120,0.06)');
  v.addColorStop(1, 'rgba(60,8,12,0.55)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
  // studs around the arch
  for (let i = 0; i < 26; i++) {
    const t = i / 25;
    const y = h - 20 - t * (h * 0.62);
    boss(ctx, 16, y, 7);
    boss(ctx, w - 16, y, 7);
  }
  return c;
}

/**
 * Painted-paper red ground with a gold tree-of-life boota (after the user's reference reel: Mughal
 * miniature invitations). Drawn as a symmetric half and mirrored.
 */
export function paintEmblem(ctx, w, h, emblem = null) {
  const g = ctx.createRadialGradient(w / 2, h * 0.45, h * 0.05, w / 2, h * 0.5, h * 0.75);
  g.addColorStop(0, '#b3202e');
  g.addColorStop(0.6, '#8e1222');
  g.addColorStop(1, '#5a0812');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const r = rng(29);
  // gouache mottling
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = r() > 0.5 ? 'rgba(255,170,150,0.035)' : 'rgba(40,0,6,0.05)';
    ctx.beginPath();
    ctx.arc(r() * w, r() * h, 4 + r() * 30, 0, TAU);
    ctx.fill();
  }
  if (emblem) {
    // the painted gold tree-of-life (Flow) in the crown of the arch; the lower half stays clear for the names
    const eh = h * 0.36;
    const ew = (eh * emblem.width) / emblem.height;
    ctx.drawImage(emblem, (w - ew) / 2, h * 0.11, ew, eh);
    return;
  }
  const cx = w / 2;
  const top = h * 0.13;
  const bot = h * 0.47;
  const H = bot - top;
  const gold = goldGrad(ctx, cx - w * 0.3, top, cx + w * 0.3, bot);
  const half = (side) => {
    ctx.save();
    ctx.translate(cx, 0);
    ctx.scale(side, 1);
    // drop outline
    ctx.beginPath();
    ctx.moveTo(0, top);
    ctx.bezierCurveTo(w * 0.05, top + H * 0.18, w * 0.3, top + H * 0.38, w * 0.27, top + H * 0.66);
    ctx.bezierCurveTo(w * 0.25, top + H * 0.88, w * 0.1, bot, 0, bot);
    ctx.lineWidth = 5;
    ctx.strokeStyle = gold;
    ctx.stroke();
    // branches with leaves and flowers
    for (let k = 0; k < 7; k++) {
      const y = top + H * (0.2 + k * 0.1);
      const reach = w * (0.07 + 0.15 * Math.sin(((k + 1) / 8) * Math.PI));
      ctx.beginPath();
      ctx.moveTo(0, y + 18);
      ctx.quadraticCurveTo(reach * 0.6, y - 8, reach, y - 18);
      ctx.lineWidth = 3;
      ctx.stroke();
      for (let l = 1; l <= 3; l++) {
        const u = l / 4;
        const lx = reach * u;
        const ly = y + 18 - (36 * u) + 6;
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(-0.9 + (l % 2) * 1.6);
        ctx.beginPath();
        ctx.ellipse(0, -9, 4.5, 11, 0, 0, TAU);
        ctx.fillStyle = gold;
        ctx.fill();
        ctx.restore();
      }
      // five-petal flower at the tip
      ctx.save();
      ctx.translate(reach, y - 20);
      for (let p = 0; p < 5; p++) {
        ctx.rotate(TAU / 5);
        ctx.beginPath();
        ctx.ellipse(0, -7, 4.5, 7.5, 0, 0, TAU);
        ctx.fillStyle = gold;
        ctx.fill();
      }
      boss(ctx, 0, 0, 4);
      ctx.restore();
    }
    ctx.restore();
  };
  ctx.strokeStyle = gold;
  half(1);
  half(-1);
  // stem, crown bud and base pot
  ctx.beginPath();
  ctx.moveTo(cx, top + H * 0.12);
  ctx.lineTo(cx, bot - 10);
  ctx.lineWidth = 5;
  ctx.strokeStyle = gold;
  ctx.stroke();
  rosette(ctx, cx, top + H * 0.1, 22, { rings: 2, petals: 8 });
  ctx.beginPath();
  ctx.moveTo(cx - 46, bot + 4);
  ctx.quadraticCurveTo(cx, bot + 40, cx + 46, bot + 4);
  ctx.closePath();
  ctx.fillStyle = gold;
  ctx.fill();
  rosette(ctx, cx, top + H * 0.62, 30, { rings: 2, petals: 10 });
}

/** Ivory canopy with gilt ribs and a band of painted flowers (wraps a lathe dome: u = around, v = up). */
export function paintDomeRibs(w = 1024, h = 512) {
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#e6d5b0');
  g.addColorStop(1, '#fbf3e1');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 32; i++) {
    const x = (i / 32) * w;
    ctx.fillStyle = goldGrad(ctx, x - 4, 0, x + 4, 0);
    ctx.fillRect(x - 3, 0, 6, h);
  }
  ctx.fillStyle = '#7a1424';
  ctx.fillRect(0, h * 0.06, w, h * 0.05);
  for (let i = 0; i < 64; i++) {
    const x = (i + 0.5) * (w / 64);
    ctx.fillStyle = i % 2 ? '#c8102e' : '#2f5d3a';
    ctx.beginPath();
    ctx.arc(x, h * 0.085, 5, 0, TAU);
    ctx.fill();
  }
  return c;
}

/**
 * The panel inside the hero gate (user, 12 Nov: no big emblem): crimson silk with soft vertical folds, a gold zari
 * border woven with a small flower-and-leaf repeat, a scatter of tiny gold butis, and a gold mango-leaf toran across
 * the top. The names are DOM type pinned over the middle. Canvas 460 × 900 ↔ plane 2.3 × 4.5 m.
 */
export function paintNamesPanel(paper = null, _emblem = null, w = 460, h = 900) {
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  if (paper) {
    const s = Math.max(w / paper.width, h / paper.height);
    ctx.drawImage(paper, (w - paper.width * s) / 2, (h - paper.height * s) / 2, paper.width * s, paper.height * s);
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#7c0d1d');
    g.addColorStop(0.45, '#9d1527');
    g.addColorStop(1, '#6a0a18');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // silk folds: soft vertical sheen bands
    for (let x = 0; x < w; x += 2) {
      const v = 0.5 + 0.5 * Math.sin(x * 0.055) * Math.sin(x * 0.013 + 1.2);
      ctx.fillStyle = v > 0.5 ? `rgba(255,170,160,${(v - 0.5) * 0.12})` : `rgba(30,0,6,${(0.5 - v) * 0.18})`;
      ctx.fillRect(x, 0, 2, h);
    }
  }
  const gold = goldGrad(ctx, 0, 0, w, h);
  // zari border bands (outer + inner rule) with a woven flower/leaf repeat between them
  const B = 30;
  ctx.fillStyle = 'rgba(40,4,10,0.35)';
  ctx.fillRect(0, 0, w, B + 6);
  ctx.fillRect(0, h - B - 6, w, B + 6);
  ctx.fillRect(0, 0, B + 6, h);
  ctx.fillRect(w - B - 6, 0, B + 6, h);
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(6, 6, w - 12, h - 12);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(B + 4, B + 4, w - 2 * B - 8, h - 2 * B - 8);
  const motif = (x, y, rot) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = gold;
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(s * 6, 0, 5, 2.2, s * 0.5, 0, TAU);
      ctx.fill();
    }
    for (let k = 0; k < 5; k++) {
      ctx.rotate(TAU / 5);
      ctx.beginPath();
      ctx.ellipse(0, -3.2, 1.9, 3, 0, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  };
  const mid = B / 2 + 5;
  for (let x = 30; x < w - 20; x += 26) motif(x, mid, 0), motif(x, h - mid, 0);
  for (let y = 56; y < h - 40; y += 26) motif(mid, y, Math.PI / 2), motif(w - mid, y, Math.PI / 2);
  // tiny gold butis, staggered, kept clear of the centre where the names sit
  const r = rng(17);
  for (let y = B + 40; y < h - B - 30; y += 46) {
    for (let x = B + 34; x < w - B - 20; x += 50) {
      const xx = x + ((y / 46) % 2) * 25;
      const ny = (y - h * 0.52) / (h * 0.2);
      const nx = (xx - w / 2) / (w * 0.42);
      if (nx * nx + ny * ny < 1) continue;
      ctx.save();
      ctx.translate(xx, y);
      ctx.globalAlpha = 0.55 + r() * 0.2;
      ctx.fillStyle = gold;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.quadraticCurveTo(4, -1, 0, 5);
      ctx.quadraticCurveTo(-4, -1, 0, -6);
      ctx.fill();
      ctx.restore();
    }
  }
  ctx.globalAlpha = 1;
  // gold mango-leaf toran across the top of the field
  const ty = B + 14;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(B + 8, ty);
  ctx.lineTo(w - B - 8, ty);
  ctx.stroke();
  for (let x = B + 22; x < w - B - 10; x += 22) {
    ctx.save();
    ctx.translate(x, ty);
    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(6, 10, 0, 24);
    ctx.quadraticCurveTo(-6, 10, 0, 0);
    ctx.fill();
    ctx.restore();
  }
  return c;
}

export const _test = { rng };
