// Cuts painted art (generated on a flat coloured background) into transparent cut-outs for the 3D set.
//   node scripts/art-cut.mjs <source image> <name>      → public/img/art/<name>.webp
// - background colour is sampled from the image corners (any flat colour works, not only #FF00FF)
// - soft alpha edge + colour de-spill (no pink fringe)
// - removes the Gemini/Flow ✦ watermark in the bottom-right corner
// - per-asset clean-up rules (RULES) for things like a ledge running off the edge
// - trims to the subject and caps the size for the web
import sharp from 'sharp';

const [src, name] = process.argv.slice(2);
if (!src || !name) throw new Error('usage: node scripts/art-cut.mjs <source> <name>');

/** Per-asset clean-up. Boxes are fractions of the source image (x0, y0, x1, y1). */
const RULES = {
  // the ivory ledge runs off the right edge: keep the stub under the feet, drop the part right of the tail
  peacock: [{ box: [0.55, 0.425, 1, 0.545], erase: 'fromRight' }],
  // ivory stone + red/green inlay only: any magenta-hued pixel is backdrop seen between the pillars
  chhatri: [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  boota: [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'marigold-strings': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'arch-frame': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'door-leaf-2': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  rangoli: [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  kalash: [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  toran: [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  // a stray second tassel hangs in mid-air under the bracket arm
  'lamp-bracket': [{ box: [0, 0, 1, 1], erase: 'magenta' }, { box: [0.43, 0.765, 0.555, 1], erase: 'all' }],
  couple: [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'couple-havan': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  thali: [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'devta-left': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'devta-right': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  clouds: [{ box: [0, 0, 1, 1], erase: 'magenta' }, { fadeSides: 0.1 }],
  'dhol-shehnai': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'mehndi-hands': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'pheras': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'ganesh-art': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'venue-illustration': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'env-seal': [{ box: [0, 0, 1, 1], erase: 'magenta' }, { box: [0.8, 0, 1, 0.1], erase: 'all' }],
  // the model painted two pond strips: keep the larger lower one
  'lotus-pond': [{ box: [0, 0, 1, 1], erase: 'magenta' }, { box: [0, 0, 1, 0.3], erase: 'all' }],
  gate: [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  cypress: [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  grass: [{ box: [0, 0, 1, 1], erase: 'magenta' }, { fadeSides: 0.12, fadeBottom: 0.2 }],
  'bougainvillea': [{ box: [0, 0, 1, 1], erase: 'magenta' }, { fadeBottom: 0.14 }],
  lamp: [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  diya: [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  birds: [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  // round 9 — the haveli gate
  'haveli-doorway': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'door-toran': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'haveli-threshold': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'samai-pair': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
  'door-kadi': [{ box: [0, 0, 1, 1], erase: 'magenta' }],
};

const img = sharp(src).ensureAlpha();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (x, y) => (y * W + x) * 4;

// background = median of the four corner patches
const samples = [];
for (const [cx, cy] of [[0.02, 0.02], [0.98, 0.02], [0.02, 0.6], [0.98, 0.35]]) {
  for (let dy = -6; dy <= 6; dy += 3) for (let dx = -6; dx <= 6; dx += 3) {
    const i = px(Math.round(cx * W) + dx, Math.round(cy * H) + dy);
    samples.push([data[i], data[i + 1], data[i + 2]]);
  }
}
const med = (k) => samples.map((s) => s[k]).sort((a, b) => a - b)[samples.length >> 1];
// images whose subject reaches the sampled corners: give the true backdrop colour
const BG = { clouds: [252, 1, 252] };
const bg = BG[name] || [med(0), med(1), med(2)];
const dist = (r, g, b) => Math.hypot(r - bg[0], g - bg[1], b - bg[2]);

const T0 = 40; // ≤ this distance: pure background
const T1 = 95; // ≥ this distance: pure subject
const out = Buffer.from(data);
// Only background CONNECTED to the image border is keyed out (flood fill through near-background pixels), so
// pink flowers or a pink ear *inside* the subject stay solid even if their colour is close to the backdrop.
const outside = new Uint8Array(W * H);
{
  const stack = [];
  const near = (x, y) => {
    const i = px(x, y);
    return dist(data[i], data[i + 1], data[i + 2]) < T1;
  };
  const push = (x, y) => {
    const k = y * W + x;
    if (!outside[k] && near(x, y)) {
      outside[k] = 1;
      stack.push(k);
    }
  };
  for (let x = 0; x < W; x++) push(x, 0), push(x, H - 1);
  for (let y = 0; y < H; y++) push(0, y), push(W - 1, y);
  while (stack.length) {
    const k = stack.pop();
    const x = k % W;
    const y = (k / W) | 0;
    if (x > 0) push(x - 1, y);
    if (x < W - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < H - 1) push(x, y + 1);
  }
  // Holes: large ENCLOSED patches of almost exactly the backdrop colour (a pavilion's arch openings, the gap
  // between a tail and a body) are background too. Small or merely pinkish patches (flowers) are kept.
  const HOLE = 26;
  const minArea = W * H * 0.0015;
  const seen = new Uint8Array(W * H);
  for (let s = 0; s < W * H; s++) {
    if (outside[s] || seen[s]) continue;
    const si = s * 4;
    if (dist(data[si], data[si + 1], data[si + 2]) >= HOLE) continue;
    const comp = [s];
    seen[s] = 1;
    let sum = 0;
    for (let c = 0; c < comp.length; c++) {
      const k = comp[c];
      sum += dist(data[k * 4], data[k * 4 + 1], data[k * 4 + 2]);
      const x = k % W;
      const y = (k / W) | 0;
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const nk = ny * W + nx;
        if (seen[nk] || outside[nk]) continue;
        const ni = nk * 4;
        if (dist(data[ni], data[ni + 1], data[ni + 2]) >= T1) continue; // grow through the soft edge too
        seen[nk] = 1;
        comp.push(nk);
      }
    }
    // big enclosed backdrop, or a small sliver that is an exact backdrop match (gaps between pillars)
    if (comp.length >= minArea || (comp.length >= 25 && sum / comp.length < 16)) for (const k of comp) outside[k] = 1;
  }
}
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = px(x, y);
    if (!outside[y * W + x]) {
      out[i + 3] = 255; // enclosed by the subject: never transparent
      continue;
    }
    const d = dist(data[i], data[i + 1], data[i + 2]);
    let a = Math.min(1, Math.max(0, (d - T0) / (T1 - T0)));
    if (a > 0 && a < 1) {
      // de-spill: remove the background's share from the edge colour
      for (let k = 0; k < 3; k++) out[i + k] = Math.max(0, Math.min(255, (data[i + k] - (1 - a) * bg[k]) / a));
    }
    out[i + 3] = Math.round(a * 255);
  }
}

// watermark: the ✦ sparkle sits in the bottom-right corner on the flat background. Erase only small blobs that
// lie wholly inside that corner — art that reaches into the corner (a sill, a bell, grass) touches the corner's
// top/left edge and is kept. (The first version cleared the whole corner and clipped real art — user, 13 Nov.)
{
  const x0 = Math.floor(W * 0.86);
  const y0 = Math.floor(H * 0.88);
  const seen = new Uint8Array(W * H);
  const maxArea = W * H * 0.0012;
  for (let sy = y0; sy < H; sy++) {
    for (let sx = x0; sx < W; sx++) {
      const s = sy * W + sx;
      if (seen[s] || out[s * 4 + 3] < 20) continue;
      const comp = [s];
      seen[s] = 1;
      let touchesEdge = false;
      for (let c = 0; c < comp.length; c++) {
        const k = comp[c];
        const x = k % W;
        const y = (k / W) | 0;
        if (x === x0 || y === y0) touchesEdge = true;
        for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
          if (nx < x0 || ny < y0 || nx >= W || ny >= H) continue;
          const nk = ny * W + nx;
          if (seen[nk] || out[nk * 4 + 3] < 20) continue;
          seen[nk] = 1;
          comp.push(nk);
        }
      }
      if (!touchesEdge && comp.length < maxArea) for (const k of comp) out[k * 4 + 3] = 0;
    }
  }
}

// soft ends: fade alpha over the outer `fadeSides` of the width (for strips that are cropped at both sides)
for (const rule of RULES[name] || []) {
  if (rule.fadeBottom) {
    // the painting's flat base would sit on the ground as a hard line: let it melt away
    const fh = Math.round(H * rule.fadeBottom);
    for (let y = H - fh; y < H; y++) {
      const f = ((H - 1 - y) / fh) ** 1.3;
      for (let x = 0; x < W; x++) out[px(x, y) + 3] = Math.round(out[px(x, y) + 3] * f);
    }
  }
  if (!rule.fadeSides) continue;
  const fw = Math.round(W * rule.fadeSides);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < fw; x++) {
      const f = (x / fw) ** 1.5;
      out[px(x, y) + 3] = Math.round(out[px(x, y) + 3] * f);
      out[px(W - 1 - x, y) + 3] = Math.round(out[px(W - 1 - x, y) + 3] * f);
    }
  }
}

const isFeather = (i) => {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  return (g > r + 12 || b > r + 12) && Math.max(r, g, b) - Math.min(r, g, b) > 40; // saturated green / teal / blue
};
for (const rule of RULES[name] || []) {
  if (!rule.box) continue;
  if (rule.erase === 'fromRight') {
    // walk each row in from the right edge, erasing (stone, its outline, background) until the first feather
    const [x0, y0, , y1] = rule.box;
    for (let y = Math.floor(y0 * H); y < Math.ceil(y1 * H); y++) {
      let run = 0;
      for (let x = W - 1; x >= Math.floor(x0 * W); x--) {
        const i = px(x, y);
        if (out[i + 3] > 0 && isFeather(i)) {
          if (++run >= 3) break; // three feather pixels in a row: we've reached the tail
        } else run = 0;
        out[i + 3] = 0;
      }
    }
    continue;
  }
  const [x0, y0, x1, y1] = rule.box;
  for (let y = Math.floor(y0 * H); y < Math.ceil(y1 * H); y++) {
    for (let x = Math.floor(x0 * W); x < Math.ceil(x1 * W); x++) {
      const i = px(x, y);
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const light = max > 150 && (max - min) < 90 && r >= b; // ivory / cream stone
      const feather = g > r * 0.95 || b > r; // greens, teals, blues of the tail
      const stone = !feather; // cream stone, its tan outline and shadow
      const magenta = b > 80 && g < 0.6 * Math.min(r, b);
      if (rule.erase === 'all' || (rule.erase === 'light' && light) || (rule.erase === 'stone' && stone) || (rule.erase === 'magenta' && magenta)) out[i + 3] = 0;
    }
  }
}

// magenta spill: soft glows (halos, smoke, cloud edges) painted against the pink backdrop pick up a pink-lavender
// cast. Within a band near the cut-out edge, pull magenta-tinted pixels back to neutral/warm (the subject's own
// pinks, deeper inside, are untouched).
const DESPILL = { 'devta-left': 60, 'devta-right': 60, pheras: 70, clouds: 60, 'haveli-doorway': 10, 'samai-pair': 40, 'haveli-threshold': 30, 'door-toran': 12 };
if (DESPILL[name]) {
  const band = DESPILL[name];
  const dist = new Int32Array(W * H).fill(1e9);
  const qx = [];
  for (let k = 0; k < W * H; k++) if (out[k * 4 + 3] < 128) (dist[k] = 0), qx.push(k);
  for (let h = 0; h < qx.length; h++) {
    const k = qx[h];
    const d = dist[k];
    if (d >= band) continue;
    const x = k % W;
    const y = (k / W) | 0;
    for (const nk of [x > 0 ? k - 1 : -1, x < W - 1 ? k + 1 : -1, y > 0 ? k - W : -1, y < H - 1 ? k + W : -1]) {
      if (nk < 0 || dist[nk] <= d + 1) continue;
      dist[nk] = d + 1;
      qx.push(nk);
    }
  }
  for (let k = 0; k < W * H; k++) {
    if (dist[k] > band || out[k * 4 + 3] === 0) continue;
    const i = k * 4;
    const r = out[i], g = out[i + 1], b = out[i + 2];
    const m = Math.min(r, b) - g;
    if (m > 12) {
      const f = 1 - dist[k] / band; // strongest right at the edge
      out[i] = Math.round(r - m * f);
      out[i + 2] = Math.round(b - m * f * 1.1);
      // very light pink glow → let it fade out rather than turn grey
      if (g > 170 && m > 25) out[i + 3] = Math.round(out[i + 3] * (1 - 0.5 * f));
    }
  }
}

// soft left edge for subjects the painting cut off at the frame's left side
const FADE_LEFT = { 'devta-left': 0.08, 'devta-right': 0.14 };
if (FADE_LEFT[name]) {
  const fw = Math.round(W * FADE_LEFT[name]);
  for (let y = 0; y < H; y++) for (let x = 0; x < fw; x++) out[px(x, y) + 3] = Math.round(out[px(x, y) + 3] * (x / fw) ** 1.5);
}

// symmetric subjects cropped on one side: mirror the intact left half onto the right
const MIRROR = { gate: 0.5075 }; // centre of the arch opening, as a fraction of the width
if (MIRROR[name]) {
  const cx = Math.round(MIRROR[name] * W);
  for (let y = 0; y < H; y++) {
    for (let x = cx; x < W; x++) {
      const sx = 2 * cx - x;
      const d = px(x, y);
      if (sx < 0) {
        out[d + 3] = 0;
        continue;
      }
      const s = px(sx, y);
      out[d] = out[s];
      out[d + 1] = out[s + 1];
      out[d + 2] = out[s + 2];
      out[d + 3] = out[s + 3];
    }
  }
}

// edge bleed: invisible (alpha 0) pixels still carry the backdrop's magenta; when the texture is scaled on screen,
// filtering mixes that colour into the edges as a pink rim. Fill them with the colour of the nearest painted pixel
// (a few rings outward), and the rest with a neutral warm tone.
{
  const filled = new Uint8Array(W * H);
  let frontier = [];
  for (let k = 0; k < W * H; k++) {
    if (out[k * 4 + 3] > 8) filled[k] = 1;
  }
  for (let k = 0; k < W * H; k++) {
    if (filled[k]) continue;
    const x = k % W;
    const y = (k / W) | 0;
    if ((x > 0 && filled[k - 1]) || (x < W - 1 && filled[k + 1]) || (y > 0 && filled[k - W]) || (y < H - 1 && filled[k + W])) frontier.push(k);
  }
  for (let ring = 0; ring < 6 && frontier.length; ring++) {
    const next = [];
    const done = [];
    for (const k of frontier) {
      if (filled[k]) continue;
      const x = k % W;
      const y = (k / W) | 0;
      let r = 0, g = 0, b = 0, n = 0;
      for (const nk of [x > 0 ? k - 1 : -1, x < W - 1 ? k + 1 : -1, y > 0 ? k - W : -1, y < H - 1 ? k + W : -1]) {
        if (nk < 0 || !filled[nk]) continue;
        r += out[nk * 4];
        g += out[nk * 4 + 1];
        b += out[nk * 4 + 2];
        n++;
      }
      if (!n) continue;
      out[k * 4] = r / n;
      out[k * 4 + 1] = g / n;
      out[k * 4 + 2] = b / n;
      done.push(k);
      for (const nk of [x > 0 ? k - 1 : -1, x < W - 1 ? k + 1 : -1, y > 0 ? k - W : -1, y < H - 1 ? k + W : -1]) if (nk >= 0 && !filled[nk]) next.push(nk);
    }
    for (const k of done) filled[k] = 1;
    frontier = next;
  }
  for (let k = 0; k < W * H; k++) {
    if (filled[k]) continue;
    out[k * 4] = 236;
    out[k * 4 + 1] = 228;
    out[k * 4 + 2] = 214;
  }
}

// drop isolated specks (alpha islands smaller than a few pixels are noise)
const cut = sharp(out, { raw: { width: W, height: H, channels: 4 } });
const trimmed = await cut.png().toBuffer().then((b) => sharp(b).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true }));
const maxSide = 1600;
await sharp(trimmed.data)
  .resize({ width: maxSide, height: maxSide, fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 88, alphaQuality: 95 })
  .toFile(`public/img/art/${name}.webp`);
const meta = await sharp(`public/img/art/${name}.webp`).metadata();
console.log(`${name}: bg rgb(${bg}) → public/img/art/${name}.webp ${meta.width}×${meta.height} (trim offset ${trimmed.info.trimOffsetLeft},${trimmed.info.trimOffsetTop})`);
