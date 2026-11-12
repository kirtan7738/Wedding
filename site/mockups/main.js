import '../src/styles/tokens.css';
import '../src/styles/fonts.css';
import wedding from '../src/content/wedding.js';

const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent?.appendChild(n);
  return n;
};

// ---------- deterministic randomness so every reload looks the same ----------
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// ---------- marigold symbol details (bumpy edge + ruffles) ----------
(function buildGenda() {
  const edge = document.getElementById('genda-edge');
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    el('circle', { cx: (Math.cos(a) * 8.3).toFixed(2), cy: (Math.sin(a) * 8.3).toFixed(2), r: 2.4 }, edge);
  }
  const ruf = document.getElementById('genda-ruffle');
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + 0.2;
    el('circle', { cx: (Math.cos(a) * 6.4).toFixed(2), cy: (Math.sin(a) * 6.4).toFixed(2), r: 2.2, fill: 'rgba(120,40,0,.16)' }, ruf);
  }
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    el('circle', { cx: (Math.cos(a) * 4.1).toFixed(2), cy: (Math.sin(a) * 4.1).toFixed(2), r: 2.1, fill: 'rgba(255,255,255,.16)' }, ruf);
  }
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.4;
    el('circle', { cx: (Math.cos(a) * 2.6).toFixed(2), cy: (Math.sin(a) * 2.6).toFixed(2), r: 1.5, fill: 'rgba(120,40,0,.18)' }, ruf);
  }
})();

const flower = (parent, x, y, s, fill, rot = 0) =>
  el('use', { href: '#genda', x: -11, y: -11, width: 22, height: 22, fill, transform: `translate(${x} ${y}) scale(${s}) rotate(${rot})` }, parent);
const leaf = (parent, x, y, s, rot) =>
  el('use', { href: '#leaf', x: -6, y: 0, width: 12, height: 34, transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, parent);
const bell = (parent, x, y, s = 1) =>
  el('use', { href: '#bell', x: -7, y: 0, width: 14, height: 18, transform: `translate(${x} ${y}) scale(${s})` }, parent);

// ---------- toran: rope, leaf fringe, swags, hanging strands with bells ----------
function buildToran(svg, palette, { bottom = false } = {}) {
  svg.innerHTML = '';
  const g = el('g', bottom ? { transform: 'translate(0 90) scale(1 -1)' } : {}, svg);
  const W = 390;
  el('path', { d: `M-4 7 Q${W / 2} 13 ${W + 4} 7`, stroke: 'url(#g-brass)', 'stroke-width': 2.2, fill: 'none' }, g);
  const points = [];
  const step = bottom ? 39 : 32.5;
  for (let x = 0; x <= W + 1; x += step) points.push(x);

  // mango-leaf fringe
  if (!bottom) points.forEach((x, i) => { leaf(g, x + step / 2, 6, 0.95, i % 2 ? 9 : -9); leaf(g, x + step / 4, 6, 0.7, 18); });

  // swags of small flowers between hanging points
  for (let i = 0; i < points.length - 1; i++) {
    const x0 = points[i], x1 = points[i + 1], dip = bottom ? 16 : 22;
    for (let t = 0.12; t < 0.95; t += 0.14) {
      const x = x0 + (x1 - x0) * t;
      const y = 9 + 4 * dip * t * (1 - t);
      flower(g, x, y, bottom ? 0.48 : 0.55, palette[(i + Math.round(t * 10)) % palette.length], rnd() * 90);
    }
  }
  if (bottom) return;

  // hanging strands, short–long rhythm, bells at the tips
  const lengths = [5, 9, 6, 12, 6, 9, 5];
  points.forEach((x, i) => {
    const n = lengths[i % lengths.length];
    let y = 12;
    for (let k = 0; k < n; k++) {
      flower(g, x, y, 0.72, palette[(i + k) % palette.length], rnd() * 90);
      if (k % 4 === 3) { leaf(g, x - 4, y, 0.42, -40); leaf(g, x + 4, y, 0.42, 40); }
      y += 11.5;
    }
    bell(g, x, y - 3, 0.9);
  });
}

// ---------- side ladi (vertical strands) ----------
function buildSide(svg, palette) {
  svg.innerHTML = '';
  let y = 4, k = 0;
  while (y < 610) {
    flower(svg, 20 + Math.sin(k * 0.9) * 1.5, y, 0.82, palette[k % palette.length], rnd() * 90);
    if (k % 5 === 4) { leaf(svg, 12, y, 0.5, -55); leaf(svg, 28, y, 0.5, 55); }
    y += 12.5; k++;
  }
  bell(svg, 20, y - 4, 1);
}

// ---------- wax seal edge ----------
function sealPath() {
  let d = '';
  for (let i = 0; i <= 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const r = 46 + Math.sin(a * 9) * 1.6 + Math.sin(a * 23) * 0.9 + (rnd() - 0.5) * 1.4;
    d += `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`;
  }
  return d + 'Z';
}

const THEMES = [
  { key: 'a', label: 'A · Sage Royal — deep green, kumkum seal, marigold toran', palette: ['url(#g-orange)', 'url(#g-yellow)', 'url(#g-orange)', 'url(#g-red)'] },
  { key: 'b', label: 'B · Kankotri Paper — like your printed card, richer', palette: ['url(#g-orange)', 'url(#g-yellow)', 'url(#g-red)'] },
  { key: 'c', label: 'C · Royal Maroon — heritage maroon + gold', palette: ['url(#g-orange)', 'url(#g-yellow)', 'url(#g-white)'] },
  { key: 'd', label: 'D · Marigold Utsav — orange festival, garlands everywhere', palette: ['url(#g-yellow)', 'url(#g-red)', 'url(#g-white)', 'url(#g-yellow)'] },
];

const tpl = document.getElementById('cover-tpl');
const phones = document.getElementById('phones');
for (const t of THEMES) {
  const node = tpl.content.firstElementChild.cloneNode(true);
  node.classList.add(`theme-${t.key}`);
  node.querySelector('.phone-label').textContent = t.label;
  buildToran(node.querySelector('.toran'), t.palette);
  buildToran(node.querySelector('.toran-bottom'), t.palette, { bottom: true });
  buildSide(node.querySelector('.garland-left'), t.palette);
  buildSide(node.querySelector('.garland-right'), t.palette.slice().reverse());
  node.querySelector('.seal-edge').setAttribute('d', sealPath());
  if (t.key === 'b') {
    // Light paper needs an explicitly gold pattern (pattern content can't inherit the cover's colour).
    node.querySelector('.damask').setAttribute('fill', 'url(#damask-gold)');
    node.querySelector('.env-damask').setAttribute('fill', 'url(#damask-gold)');
  }
  node.querySelector('.seal-mono').textContent = wedding.couple.monogram;
  phones.appendChild(node);
}

// ---------- lettering board ----------
const svgs = import.meta.glob('./lettering/*.svg', { query: '?raw', import: 'default', eager: true });
const get = (name, font) => svgs[`./lettering/${name}-${font}.svg`];
const FONTS = [
  ['mogra', '1 · Mogra — festive calligraphic'],
  ['farsan', '2 · Farsan — hand-drawn, warm'],
  ['rasa', '3 · Rasa Bold — classic serif'],
  ['kumarone', '4 · Kumar One — bold display'],
  ['shrikhand', '5 · Shrikhand — rich & curvy'],
];
const cards = document.getElementById('letter-cards');
for (const [font, label] of FONTS) {
  const card = document.createElement('figure');
  card.className = 'letter-card';
  card.innerHTML = `
    <figcaption class="latin">${label}</figcaption>
    <div class="hero-mock">
      <p class="hero-invocation">${wedding.invocation}</p>
      <div class="arch"><img src="./photo.jpg" alt="" /></div>
      <div class="lt mangal">${get('mangal', font)}</div>
      <div class="lt name">${get('princy', font)}</div>
      <div class="amp">❀</div>
      <div class="lt name">${get('parth', font)}</div>
      <p class="hero-date">${wedding.dateText}</p>
      <p class="hero-samvat">${wedding.samvatText}</p>
    </div>`;
  cards.appendChild(card);
}

// ---------- body text samples ----------
const lines = wedding.invitation.lines.slice(0, 6).map((l) => l.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'));
document.getElementById('body-samples').innerHTML = [
  ['body-hind', 'Hind Vadodara — clean, very readable'],
  ['body-noto', 'Noto Serif Gujarati — traditional serif'],
]
  .map(([cls, label]) => `<figure class="body-card ${cls}"><figcaption class="latin">${label}</figcaption>${lines.map((l) => `<p>${l}</p>`).join('')}</figure>`)
  .join('');
