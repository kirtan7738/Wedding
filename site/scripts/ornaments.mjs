// Generates the static ornament SVGs (deterministic) into src/assets/ornaments/.
// Shared symbols/gradients live in defs.svg (rendered once by <SvgDefs/>); ornaments reference them with <use>.
// Colours: gradients (stop-color) for flowers/brass; everything else via CSS classes (spec §6 tokens).
// CLI: node scripts/ornaments.mjs
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'ornaments');
const f2 = (n) => Number(n.toFixed(2));

let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const reseed = (s) => { seed = s; };

const svg = (viewBox, body, cls = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" class="orn ${cls}" aria-hidden="true" focusable="false" overflow="visible">${body}</svg>`;

// ------------------------------------------------------------------ defs
function ring(n, radius, r, fillAttr, phase = 0) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + phase;
    s += `<circle cx="${f2(Math.cos(a) * radius)}" cy="${f2(Math.sin(a) * radius)}" r="${r}"${fillAttr}/>`;
  }
  return s;
}

const DEFS = `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<radialGradient id="g-orange" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#FFE29A"/><stop offset=".35" stop-color="#FFB21E"/><stop offset=".75" stop-color="#F27A0C"/><stop offset="1" stop-color="#C9520A"/></radialGradient>
<radialGradient id="g-yellow" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#FFF6B8"/><stop offset=".4" stop-color="#FFD84A"/><stop offset=".8" stop-color="#F6B40E"/><stop offset="1" stop-color="#D99206"/></radialGradient>
<radialGradient id="g-red" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#FF9C8A"/><stop offset=".45" stop-color="#E23B2E"/><stop offset="1" stop-color="#8F1414"/></radialGradient>
<radialGradient id="g-white" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#FBF5E6"/><stop offset="1" stop-color="#E4D6B4"/></radialGradient>
<linearGradient id="g-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FB548"/><stop offset=".55" stop-color="#3E7D2B"/><stop offset="1" stop-color="#245A1E"/></linearGradient>
<linearGradient id="g-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF0B3"/><stop offset=".35" stop-color="#E2B54C"/><stop offset=".7" stop-color="#A9781F"/><stop offset="1" stop-color="#6E4B12"/></linearGradient>
<linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3DA9A"/><stop offset=".5" stop-color="#C9A04F"/><stop offset="1" stop-color="#8F6A22"/></linearGradient>
<radialGradient id="g-seal" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#E8574C"/><stop offset=".45" stop-color="#C8352D"/><stop offset="1" stop-color="#6C1410"/></radialGradient>
<radialGradient id="g-seal-gold" cx="38%" cy="32%" r="72%"><stop offset="0" stop-color="#FFF3C8"/><stop offset=".35" stop-color="#E8C36A"/><stop offset=".75" stop-color="#B98A2E"/><stop offset="1" stop-color="#7C5617"/></radialGradient><linearGradient id="g-foil" x1="0" y1="0" x2="1" y2=".25"><stop offset="0" stop-color="#A8751F"/><stop offset=".22" stop-color="#F6DC8F"/><stop offset=".42" stop-color="#C4912F"/><stop offset=".52" stop-color="#FFF4CF"/><stop offset=".62" stop-color="#C4912F"/><stop offset=".8" stop-color="#F1D37F"/><stop offset="1" stop-color="#A8751F"/></linearGradient><linearGradient id="g-shimmer" gradientUnits="objectBoundingBox" x1="-1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#E9C46A"/><stop offset=".42" stop-color="#E9C46A"/><stop offset=".5" stop-color="#FFF8DC"/><stop offset=".58" stop-color="#E9C46A"/><stop offset="1" stop-color="#E9C46A"/></linearGradient><radialGradient id="g-flame" cx="50%" cy="70%" r="60%"><stop offset="0" stop-color="#FFFBE0"/><stop offset=".35" stop-color="#FFD54A"/><stop offset=".75" stop-color="#FF8A1F"/><stop offset="1" stop-color="#E2510A" stop-opacity="0"/></radialGradient>
<radialGradient id="g-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFD27A" stop-opacity=".55"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>
<linearGradient id="g-clay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9B867"/><stop offset=".5" stop-color="#B9772E"/><stop offset="1" stop-color="#7A4515"/></linearGradient>
<symbol id="genda" viewBox="-11 -11 22 22" overflow="visible">${ring(16, 8.3, 2.4, '')}<circle r="8.6"/>${ring(14, 6.4, 2.2, ' fill="rgba(120,40,0,.16)"', 0.2)}${ring(9, 4.1, 2.1, ' fill="rgba(255,255,255,.16)"')}${ring(7, 2.6, 1.5, ' fill="rgba(120,40,0,.18)"', 0.4)}<circle r="2.3" fill="rgba(110,35,0,.32)"/><circle r="1.1" cx="-.6" cy="-.6" fill="rgba(255,255,255,.35)"/></symbol>
<symbol id="leaf" viewBox="0 0 12 34" overflow="visible"><path d="M6 0C11 7 11.5 22 6 34C.5 22 1 7 6 0Z" fill="url(#g-leaf)"/><path d="M6 2L6 32" stroke="rgba(255,255,255,.35)" stroke-width=".7" fill="none"/></symbol>
<symbol id="bell" viewBox="-7 0 14 18" overflow="visible"><path d="M-1 0h2v2.2C4.2 3 5.3 7.2 5.3 11.2L6.6 13.6H-6.6L-5.3 11.2C-5.3 7.2-4.2 3-1 2.2Z" fill="url(#g-brass)"/><circle cy="15.4" r="1.6" fill="url(#g-brass)"/></symbol>
<symbol id="diya" viewBox="-30 -46 60 62" overflow="visible"><circle cy="-22" r="26" fill="url(#g-glow)" class="diya-glow"/><path class="flame" d="M0-40C7-28 8-18 0-9C-8-18-7-28 0-40Z" fill="url(#g-flame)"/><path d="M0-26C2.5-21 2.6-16 0-12C-2.6-16-2.5-21 0-26Z" fill="rgba(255,253,240,.9)"/><path d="M-26-8Q0-2 26-8Q22 10 0 12Q-22 10-26-8Z" fill="url(#g-clay)"/><path d="M-26-8Q0-2 26-8" stroke="rgba(246,213,142,1)" stroke-width="1.2" fill="none"/><path d="M-14 3Q0 7 14 3" stroke="rgba(122,69,21,1)" stroke-width=".8" fill="none" stroke-dasharray="1.5 2"/><path d="M22-9Q31-12 30-16" stroke="url(#g-clay)" stroke-width="3" fill="none" stroke-linecap="round"/></symbol>
<pattern id="damask-gold" width="64" height="64" patternUnits="userSpaceOnUse"><g fill="none" stroke="rgba(163,122,44,1)" stroke-width="1.1"><circle cx="32" cy="32" r="10"/><circle cx="32" cy="32" r="3" fill="rgba(163,122,44,1)"/><path d="M32 14c6 6 6 30 0 36c-6-6-6-30 0-36z"/><path d="M14 32c6-6 30-6 36 0c-6 6-30 6-36 0z"/><circle r="6"/><circle cx="64" r="6"/><circle cy="64" r="6"/><circle cx="64" cy="64" r="6"/><path d="M0 32h6M58 32h6M32 0v6M32 58v6"/></g></pattern>
<filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="rgba(0,0,0,1)" flood-opacity=".28"/></filter>
</defs></svg>`;

// ------------------------------------------------------------------ helpers
const flower = (x, y, s, fill) =>
  `<use href="#genda" x="-11" y="-11" width="22" height="22" fill="${fill}" transform="translate(${f2(x)} ${f2(y)}) scale(${s}) rotate(${f2(rnd() * 90)})"/>`;
const leaf = (x, y, s, rot) =>
  `<use href="#leaf" x="-6" y="0" width="12" height="34" transform="translate(${f2(x)} ${f2(y)}) rotate(${rot}) scale(${s})"/>`;
const bell = (x, y, s = 1) =>
  `<g class="bell" style="transform-origin:${f2(x)}px ${f2(y)}px"><use href="#bell" x="-7" y="0" width="14" height="18" transform="translate(${f2(x)} ${f2(y)}) scale(${s})"/></g>`;

const PALETTE = ['url(#g-orange)', 'url(#g-yellow)', 'url(#g-red)'];

function toran({ bottom = false, short = false } = {}) {
  reseed(bottom ? 11 : short ? 13 : 7);
  const W = 390;
  let s = `<path class="orn-rope" d="M-4 7Q${W / 2} 13 ${W + 4} 7"/>`;
  const step = bottom ? 39 : 32.5;
  const points = [];
  for (let x = 0; x <= W + 1; x += step) points.push(x);
  if (!bottom) points.forEach((x, i) => { s += leaf(x + step / 2, 6, 0.95, i % 2 ? 9 : -9) + leaf(x + step / 4, 6, 0.7, 18); });
  for (let i = 0; i < points.length - 1; i++) {
    const x0 = points[i], x1 = points[i + 1], dip = bottom ? 16 : 22;
    for (let t = 0.12; t < 0.95; t += 0.14) {
      s += flower(x0 + (x1 - x0) * t, 9 + 4 * dip * t * (1 - t), bottom ? 0.48 : 0.55, PALETTE[(i + Math.round(t * 10)) % PALETTE.length]);
    }
  }
  if (!bottom) {
    const lengths = short ? [2, 4, 2, 5, 2, 4, 2] : [5, 9, 6, 12, 6, 9, 5];
    points.forEach((x, i) => {
      const n = lengths[i % lengths.length];
      let y = 12;
      let strand = '';
      for (let k = 0; k < n; k++) {
        strand += flower(x, y, 0.72, PALETTE[(i + k) % PALETTE.length]);
        if (k % 4 === 3) strand += leaf(x - 4, y, 0.42, -40) + leaf(x + 4, y, 0.42, 40);
        y += 11.5;
      }
      s += `<g class="strand" style="transform-origin:${f2(x)}px 8px">${strand}${bell(x, y - 3, 0.9)}</g>`;
    });
  }
  if (bottom) return svg('0 0 390 90', `<g transform="translate(0 90) scale(1 -1)">${s}</g>`, 'orn-toran-bottom');
  return short ? svg('0 0 390 92', s, 'orn-toran orn-toran--short') : svg('0 0 390 190', s, 'orn-toran');
}

function garlandSide() {
  reseed(23);
  let s = '', y = 4, k = 0;
  while (y < 610) {
    s += flower(20 + Math.sin(k * 0.9) * 1.5, y, 0.82, PALETTE[k % PALETTE.length]);
    if (k % 5 === 4) s += leaf(12, y, 0.5, -55) + leaf(28, y, 0.5, 55);
    y += 12.5; k++;
  }
  s += bell(20, y - 4, 1);
  return svg('0 0 40 620', s, 'orn-garland-side');
}

function seal() {
  reseed(31);
  let d = '';
  for (let i = 0; i <= 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const r = 46 + Math.sin(a * 9) * 1.6 + Math.sin(a * 23) * 0.9 + (rnd() - 0.5) * 1.4;
    d += `${i ? 'L' : 'M'}${f2(Math.cos(a) * r)} ${f2(Math.sin(a) * r)}`;
  }
  // Crack: three jagged lines from the centre, hidden until the opening timeline reveals them.
  const crack = [0.3, 2.4, 4.3]
    .map((a0) => {
      let p = 'M0 0', r = 0, a = a0;
      while (r < 46) { r += 7 + rnd() * 6; a += (rnd() - 0.5) * 0.5; p += `L${f2(Math.cos(a) * r)} ${f2(Math.sin(a) * r)}`; }
      return p;
    })
    .join('');
  return svg(
    '-60 -60 120 120',
    `<g id="seal-body"><path class="seal-edge" d="${d}Z" fill="url(#g-seal-gold)" filter="url(#soft-shadow)"/><circle class="seal-ring" r="38"/><circle class="seal-ring seal-ring--thin" r="33"/></g>` +
      `<g id="seal-monogram"><text class="seal-mono" x="0" y="9" text-anchor="middle">પ ✤ પ</text></g>` +
      `<g id="seal-crack" opacity="0"><path class="seal-crack" d="${crack}"/></g>`,
    'orn-seal',
  );
}

const arch = () =>
  svg(
    '0 0 260 330',
    `<path class="orn-line" d="M8 326V128A122 122 0 0 1 252 128V326Z"/>` +
      `<path class="orn-line orn-line--thin" d="M16 318V130A114 114 0 0 1 244 130V318Z"/>` +
      `<path class="orn-gold-fill" d="M130 0l5 9-5 9-5-9z"/><circle class="orn-gold-fill" cx="130" cy="24" r="2.2"/>` +
      `<path class="orn-line orn-line--thin" d="M60 34Q130 -4 200 34"/>`,
    'orn-arch',
  );

const divider = () =>
  svg(
    '0 0 240 24',
    `<path class="orn-line" d="M4 12H96M144 12H236"/><path class="orn-gold-fill" d="M120 2l10 10-10 10-10-10z"/>` +
      `<path class="orn-line orn-line--thin" d="M120 6l6 6-6 6-6-6z"/><circle class="orn-gold-fill" cx="102" cy="12" r="2"/><circle class="orn-gold-fill" cx="138" cy="12" r="2"/>` +
      `<path class="orn-line orn-line--thin" d="M60 12q8-8 16 0t16 0M148 12q8-8 16 0t16 0"/>`,
    'orn-divider',
  );

// Hast melap: two interlocking rings crowned by a marigold, with leaves — union motif.
const union = () => {
  reseed(41);
  return svg(
    '0 0 120 96',
    `<circle class="orn-line orn-line--bold" cx="48" cy="58" r="24"/><circle class="orn-line orn-line--bold" cx="72" cy="58" r="24"/>` +
      leaf(44, 18, 0.7, -60) + leaf(76, 18, 0.7, 60) + flower(60, 24, 0.9, 'url(#g-orange)') + flower(48, 30, 0.5, 'url(#g-yellow)') + flower(72, 30, 0.5, 'url(#g-red)'),
    'orn-union',
  );
};

// Bhojan: a thali with bowls and a small diya.
const thali = () =>
  svg(
    '0 0 120 96',
    `<ellipse class="orn-line orn-line--bold" cx="60" cy="62" rx="50" ry="22"/><ellipse class="orn-line orn-line--thin" cx="60" cy="62" rx="42" ry="17"/>` +
      `<ellipse class="orn-gold-fill orn-soft" cx="40" cy="58" rx="9" ry="4"/><ellipse class="orn-gold-fill orn-soft" cx="60" cy="54" rx="9" ry="4"/><ellipse class="orn-gold-fill orn-soft" cx="80" cy="58" rx="9" ry="4"/>` +
      `<use href="#diya" x="-30" y="-46" width="60" height="62" transform="translate(60 70) scale(.42)"/>`,
    'orn-thali',
  );

const diyas = () =>
  svg(
    '0 0 390 80',
    `<path class="orn-line orn-line--thin" d="M40 66Q195 82 350 66"/>` +
      `<use href="#diya" x="-30" y="-46" width="60" height="62" transform="translate(110 62) scale(.8)"/>` +
      `<use href="#diya" x="-30" y="-46" width="60" height="62" transform="translate(195 60)"/>` +
      `<use href="#diya" x="-30" y="-46" width="60" height="62" transform="translate(280 62) scale(.8)"/>`,
    'orn-diyas',
  );

// Gold mandala: layered lotus-petal rings, dotted rings, a 16-point star — slow rotation behind the arch.
function mandala() {
  const ringPetals = (n, r0, r1, w, cls) => {
    let out = '';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 360;
      out += `<path class="${cls}" transform="rotate(${f2(a)})" d="M0 ${-r0}C${w} ${-(r0 + r1) / 2} ${w * 0.6} ${-r1 + 6} 0 ${-r1}C${-w * 0.6} ${-r1 + 6} ${-w} ${-(r0 + r1) / 2} 0 ${-r0}Z"/>`;
    }
    return out;
  };
  const dots = (n, r, size) => {
    let out = '';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      out += `<circle class="m-dot" cx="${f2(Math.cos(a) * r)}" cy="${f2(Math.sin(a) * r)}" r="${size}"/>`;
    }
    return out;
  };
  let star = '';
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2, b = a + Math.PI / 16;
    star += `${i ? 'L' : 'M'}${f2(Math.cos(a) * 46)} ${f2(Math.sin(a) * 46)}L${f2(Math.cos(b) * 30)} ${f2(Math.sin(b) * 30)}`;
  }
  return svg(
    '-200 -200 400 400',
    `<g class="mandala">` +
      `<circle class="m-ring" r="196"/><circle class="m-ring m-thin" r="186"/>` +
      ringPetals(32, 150, 184, 9, 'm-petal m-petal--outer') +
      dots(64, 144, 1.8) +
      `<circle class="m-ring m-thin" r="138"/>` +
      ringPetals(24, 96, 134, 12, 'm-petal') +
      ringPetals(24, 100, 126, 5, 'm-petal m-petal--inner') +
      `<circle class="m-ring" r="92"/>` +
      dots(32, 84, 2.2) +
      ringPetals(16, 50, 78, 11, 'm-petal m-petal--lotus') +
      `<path class="m-star" d="${star}Z"/><circle class="m-ring" r="24"/><circle class="m-core" r="9"/>` +
      `</g>`,
    'orn-mandala',
  );
}

// Temple-arcade edge: a row of cusped arches used to shape the top edge of a section (fill = currentColor).
function edgeArches() {
  const W = 390, n = 9, w = W / n, H = 34;
  let d = `M0 ${H}`;
  for (let i = 0; i < n; i++) {
    const x0 = i * w, x1 = x0 + w, xm = x0 + w / 2;
    // cusped (multifoil) arch: two small lobes + pointed crown
    d += `L${f2(x0)} 22Q${f2(x0 + w * 0.08)} 12 ${f2(x0 + w * 0.22)} 14Q${f2(x0 + w * 0.3)} 4 ${f2(xm)} 1Q${f2(x1 - w * 0.3)} 4 ${f2(x1 - w * 0.22)} 14Q${f2(x1 - w * 0.08)} 12 ${f2(x1)} 22`;
  }
  d += `L${W} ${H}Z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="orn orn-edge" aria-hidden="true" focusable="false"><path fill="currentColor" d="${d}"/><path class="edge-line" fill="none" d="${d.replace(/L0 [\d.]+|L390 [\d.]+Z/g, '').replace(/^M0 [\d.]+/, 'M0 22')}"/></svg>`;
}

await mkdir(OUT, { recursive: true });
const files = {
  'defs.svg': DEFS,
  'toran.svg': toran(),
  'toran-bottom.svg': toran({ bottom: true }),
  'toran-short.svg': toran({ short: true }),
  'garland-side.svg': garlandSide(),
  'seal.svg': seal(),
  'arch.svg': arch(),
  'divider.svg': divider(),
  'union.svg': union(),
  'thali.svg': thali(),
  'diyas.svg': diyas(),
  'mandala.svg': mandala(),
  'edge-arches.svg': edgeArches(),
};
for (const [name, content] of Object.entries(files)) await writeFile(path.join(OUT, name), content);
console.log('ornaments:', Object.keys(files).join(', '));
