// Calligraphic swashes drawn like a broad-nib pen: stroke width depends on the stroke direction
// relative to a fixed nib angle, with tapered entry/exit. Original artwork for the couple's names.
// CLI: node scripts/swash.mjs  → writes src/assets/lettering/{princy,parth,mangal}.svg (lettering + swashes)
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { shapeToSvg } from './lettering.mjs';

const r2 = (n) => Math.round(n * 100) / 100;

function cubic([p0, p1, p2, p3], t) {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
}

/** segments: array of cubic beziers [[x,y],[cx1,cy1],[cx2,cy2],[x,y]] (continuous). */
export function nibStroke(segments, { maxW = 10, minW = 1, nibDeg = 35, samples = 160, taper = 0.16 } = {}) {
  const pts = [];
  const per = Math.max(8, Math.round(samples / segments.length));
  segments.forEach((seg, si) => {
    for (let i = si === 0 ? 0 : 1; i <= per; i++) pts.push(cubic(seg, i / per));
  });
  const nib = (nibDeg * Math.PI) / 180;
  const n = pts.length;
  const left = [], right = [], widths = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const q0 = pts[Math.max(0, i - 1)], q1 = pts[Math.min(n - 1, i + 1)];
    const dx = q1[0] - q0[0], dy = q1[1] - q0[1];
    const len = Math.hypot(dx, dy) || 1;
    const theta = Math.atan2(dy, dx);
    const u = i / (n - 1);
    const env = Math.min(1, u / taper, (1 - u) / taper);
    const ease = env * env * (3 - 2 * env); // smoothstep taper at both ends
    const base = minW + (maxW - minW) * Math.abs(Math.sin(theta - nib));
    const w = minW * 0.4 + (base - minW * 0.4) * ease;
    widths.push(w);
    const nx = -dy / len, ny = dx / len;
    const l = [p[0] + (nx * w) / 2, p[1] + (ny * w) / 2];
    const r = [p[0] - (nx * w) / 2, p[1] - (ny * w) / 2];
    left.push(l);
    right.push(r);
    for (const [x, y] of [l, r]) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
  }
  const ring = [...left, ...right.reverse()];
  const d = 'M' + ring.map(([x, y]) => `${r2(x)} ${r2(y)}`).join('L') + 'Z';
  return { d, widths, bounds: [minX, minY, maxX, maxY] };
}

/** A filled teardrop/dot terminal at (x, y) with radius r. */
export function dot(x, y, r) {
  return { d: `M${r2(x - r)} ${r2(y)}a${r2(r)} ${r2(r)} 0 1 0 ${r2(2 * r)} 0a${r2(r)} ${r2(r)} 0 1 0 ${r2(-2 * r)} 0Z`, bounds: [x - r, y - r, x + r, y + r] };
}

/** Merge a lettering SVG (from shapeToSvg) with swash shapes into one SVG with a viewBox covering both. */
export function composePlate({ lettering, swashes, pad = 6 }) {
  const vb = lettering.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  const label = lettering.match(/aria-label="([^"]*)"/)?.[1] ?? '';
  const inner = lettering.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  let [minX, minY, maxX, maxY] = [vb[0], vb[1], vb[0] + vb[2], vb[1] + vb[3]];
  for (const s of swashes) {
    minX = Math.min(minX, s.bounds[0]); minY = Math.min(minY, s.bounds[1]);
    maxX = Math.max(maxX, s.bounds[2]); maxY = Math.max(maxY, s.bounds[3]);
  }
  const box = [minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2].map(r2).join(' ');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" role="img" aria-label="${label}">` +
    `<g class="name-glyphs">${inner}</g>` +
    `<g class="name-swashes">${swashes.map((s) => `<path class="swash" d="${s.d}"/>`).join('')}</g></svg>`
  );
}

// ---------------------------------------------------------------- the designs
const P = (W, H) => (x, y) => [x * W, y * H];

function princySwashes(W, H) {
  const p = P(W, H);
  const pen = { maxW: H * 0.06, minW: H * 0.009 };
  const under = nibStroke(
    [
      [p(-0.04, 0.62), p(-0.13, 1.0), p(0.06, 1.16), p(0.2, 1.03)],
      [p(0.2, 1.03), p(0.29, 0.94), p(0.25, 0.8), p(0.18, 0.86)],
      [p(0.18, 0.86), p(0.11, 0.93), p(0.22, 1.16), p(0.46, 1.12)],
      [p(0.46, 1.12), p(0.7, 1.08), p(0.94, 1.06), p(1.08, 0.88)],
      [p(1.08, 0.88), p(1.14, 0.79), p(1.11, 0.7), p(1.05, 0.74)],
    ],
    pen,
  );
  const flick = nibStroke([[p(0.84, 0.02), p(0.92, -0.1), p(1.02, -0.06), p(1.06, 0.05)]], { maxW: H * 0.035, minW: H * 0.006 });
  return [under, flick, dot(...p(1.035, 0.645), H * 0.022)];
}

function parthSwashes(W, H) {
  const p = P(W, H);
  const pen = { maxW: H * 0.06, minW: H * 0.009 };
  const under = nibStroke(
    [
      [p(-0.14, 0.9), p(0.02, 1.16), p(0.52, 1.18), p(0.84, 1.03)],
      [p(0.84, 1.03), p(1.02, 0.95), p(1.03, 0.78), p(0.93, 0.8)],
      [p(0.93, 0.8), p(0.83, 0.83), p(0.9, 1.04), p(1.16, 1.0)],
      [p(1.16, 1.0), p(1.24, 0.98), p(1.27, 0.92), p(1.24, 0.88)],
    ],
    pen,
  );
  return [under, dot(...p(-0.155, 0.86), H * 0.022)];
}

function mangalSwashes(W, H) {
  const p = P(W, H);
  const pen = { maxW: H * 0.05, minW: H * 0.008 };
  const left = nibStroke([[p(-0.03, 0.62), p(-0.1, 0.62), p(-0.13, 0.38), p(-0.07, 0.4)], [p(-0.07, 0.4), p(-0.03, 0.42), p(-0.06, 0.58), p(-0.17, 0.6)]], pen);
  const right = nibStroke([[p(1.03, 0.62), p(1.1, 0.62), p(1.13, 0.38), p(1.07, 0.4)], [p(1.07, 0.4), p(1.03, 0.42), p(1.06, 0.58), p(1.17, 0.6)]], pen);
  return [left, right, dot(...p(-0.19, 0.6), H * 0.025), dot(...p(1.19, 0.6), H * 0.025)];
}

// ---------------------------------------------------------------- custom calligraphy (flourishes grown out of letters)
// Anchored to real glyph boxes from shapeToSvg, so strokes start exactly at a letter's foot/hook.

function princyCalligraphy(W, H, boxes) {
  const [iMatra, , , , iiMatra] = boxes; // િ stem (left) … ી stem + hook (right)
  const s = H / 190;
  const pen = { maxW: 11 * s, minW: 1.6 * s, nibDeg: 32 };
  const foot = [iMatra.x0 + 12 * s, iMatra.y1 - 3 * s];
  const hook = [iiMatra.x0 + 16 * s, iiMatra.y0 + 6 * s];
  const iiFoot = [iiMatra.x1 - 10 * s, iiMatra.y1 - 2 * s];
  // ી hook extended into a canopy arching back over the whole name, ending in a curl + dot.
  const canopy = nibStroke(
    [
      [hook, [hook[0] - 40 * s, hook[1] - 34 * s], [W * 0.42, -26 * s], [W * 0.16, -6 * s]],
      [[W * 0.16, -6 * s], [W * 0.07, 2 * s], [W * 0.06, 22 * s], [W * 0.12, 20 * s]],
    ],
    { ...pen, maxW: 8 * s },
  );
  // િ foot continues into a loop and a long underline that rises to meet the ી foot, then curls.
  const underline = nibStroke(
    [
      [foot, [foot[0] - 14 * s, foot[1] + 22 * s], [foot[0] - 52 * s, foot[1] + 26 * s], [foot[0] - 50 * s, foot[1] + 4 * s]],
      [[foot[0] - 50 * s, foot[1] + 4 * s], [foot[0] - 48 * s, foot[1] - 20 * s], [foot[0] - 8 * s, foot[1] - 6 * s], [foot[0] + 18 * s, foot[1] + 28 * s]],
      [[foot[0] + 18 * s, foot[1] + 28 * s], [W * 0.35, H + 42 * s], [W * 0.78, H + 38 * s], [iiFoot[0] + 30 * s, iiFoot[1] + 6 * s]],
      [[iiFoot[0] + 30 * s, iiFoot[1] + 6 * s], [iiFoot[0] + 52 * s, iiFoot[1] - 8 * s], [iiFoot[0] + 52 * s, iiFoot[1] - 36 * s], [iiFoot[0] + 38 * s, iiFoot[1] - 34 * s]],
    ],
    pen,
  );
  return [canopy, underline, dot(W * 0.125, 30 * s, 4.2 * s), dot(iiFoot[0] + 33 * s, iiFoot[1] - 42 * s, 3.6 * s)];
}

function parthCalligraphy(W, H, boxes) {
  const [pa, , tha, reph] = boxes; // પ, ા, થ, reph (curl above થ)
  const s = H / 187;
  const pen = { maxW: 11 * s, minW: 1.6 * s, nibDeg: 32 };
  const rephStart = [reph.x0 + 6 * s, reph.y1 - 10 * s];
  // reph extended leftward into a canopy over પા, ending in a curl.
  const canopy = nibStroke(
    [
      [rephStart, [reph.x0 - 30 * s, reph.y0 - 6 * s], [W * 0.3, -14 * s], [W * 0.1, 18 * s]],
      [[W * 0.1, 18 * s], [W * 0.04, 30 * s], [W * 0.08, 48 * s], [W * 0.14, 40 * s]],
    ],
    { ...pen, maxW: 8 * s },
  );
  // પ entry stroke flowing in from the left.
  const paFoot = [pa.x0 + 8 * s, pa.y1 - 6 * s];
  const entry = nibStroke([[[paFoot[0] - 46 * s, paFoot[1] - 38 * s], [paFoot[0] - 40 * s, paFoot[1] + 6 * s], [paFoot[0] - 18 * s, paFoot[1] + 14 * s], paFoot]], pen);
  // થ exit tail: out of the foot, under the name, curling up at the end.
  const thaFoot = [tha.x1 - 8 * s, tha.y1 - 4 * s];
  const tail = nibStroke(
    [
      [thaFoot, [thaFoot[0] + 26 * s, thaFoot[1] + 18 * s], [thaFoot[0] + 30 * s, thaFoot[1] + 44 * s], [W * 0.62, H + 26 * s]],
      [[W * 0.62, H + 26 * s], [W * 0.3, H + 22 * s], [W * 0.02, H + 12 * s], [-14 * s, H - 6 * s]],
      [[-14 * s, H - 6 * s], [-26 * s, H - 18 * s], [-22 * s, H - 34 * s], [-8 * s, H - 30 * s]],
    ],
    pen,
  );
  return [canopy, entry, tail, dot(W * 0.15, 46 * s, 4 * s), dot(-4 * s, H - 36 * s, 3.4 * s)];
}

const vbSize = (svg) => svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);

export async function buildPlates({ fontPath, variations, slant = 0, headingFont, headingVariations, outDir, style = 'swash' }) {
  const calli = style === 'calligraphy';
  const make = async (text, font, vars, sl, design, file, tracking = 0) => {
    const { svg, glyphBoxes } = await shapeToSvg({ fontPath: font, text, variations: vars, slant: sl, tracking });
    const [W, H] = vbSize(svg);
    const plate = composePlate({ lettering: svg, swashes: design(W, H, glyphBoxes) });
    await writeFile(path.join(outDir, file), plate);
    return file;
  };
  return Promise.all([
    make('પ્રિન્સી', fontPath, variations, slant, calli ? princyCalligraphy : princySwashes, 'princy.svg', calli ? -30 : 0),
    make('પાર્થ', fontPath, variations, slant, calli ? parthCalligraphy : parthSwashes, 'parth.svg', calli ? -30 : 0),
    make('મંગલ પરિણય', headingFont, headingVariations, 0, mangalSwashes, 'mangal.svg'),
  ]);
}

if (process.argv[1]?.endsWith('swash.mjs')) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => (x.startsWith('--') ? [...a, [x.slice(2), arr[i + 1]]] : a), []));
  const out = args.out || path.join(root, 'src', 'assets', 'lettering');
  const files = await buildPlates({
    fontPath: path.join(root, 'fonts-src', args.font || 'Rasa[wght].ttf'),
    variations: args.wght ? `wght=${args.wght}` : 'wght=600',
    slant: Number(args.slant ?? 12),
    headingFont: path.join(root, 'fonts-src', args.heading || 'NotoSerifGujarati[wght].ttf'),
    headingVariations: 'wght=600',
    outDir: out,
    style: args.style || 'swash',
  });
  console.log('swash plates:', files.join(', '), '→', out);
}
