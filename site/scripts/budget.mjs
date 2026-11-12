// Fails (exit 1) if the shipped bundle breaks the performance budget (spec §7.3, ledger ruling: entry ≤ 170 KB gz).
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const gz = (f) => gzipSync(readFileSync(f)).length;
const kb = (n) => (n / 1024).toFixed(1);

const html = readFileSync(path.join(dist, 'index.html'), 'utf8');
const entry = path.join(dist, html.match(/src="(\/assets\/[^"]+\.js)"/)[1]);
const cssFiles = [...html.matchAll(/href="(\/assets\/[^"]+\.css)"/g)].map((m) => path.join(dist, m[1]));
const fonts = readdirSync(path.join(dist, 'assets')).filter((f) => /gujarati-(400|600)-normal|rasa-gujarati-700/.test(f) && f.endsWith('.woff2'));

const rows = [
  ['index.html (gz)', gz(path.join(dist, 'index.html'))],
  ['entry JS (gz)', gz(entry)],
  ...cssFiles.map((f) => [`CSS ${path.basename(f)} (gz)`, gz(f)]),
  ...fonts.map((f) => [`font ${f}`, statSync(path.join(dist, 'assets', f)).size]),
  ['cover still (lq + full)', statSync(path.join(dist, 'img', 'shots', 'cover-lq.webp')).size + statSync(path.join(dist, 'img', 'shots', 'cover.webp')).size],
];
const preTap = rows.reduce((s, [, n]) => s + n, 0);
const audio = existsSync(path.join(dist, 'audio')) ? readdirSync(path.join(dist, 'audio')).map((f) => statSync(path.join(dist, 'audio', f)).size) : [];

console.table(Object.fromEntries(rows.map(([k, v]) => [k, `${kb(v)} KB`])));
console.log(`pre-tap total: ${kb(preTap)} KB`);

const fails = [];
if (gz(entry) > 170 * 1024) fails.push(`entry JS ${kb(gz(entry))} KB gz > 170 KB`);
if (preTap > 1024 * 1024) fails.push(`pre-tap ${kb(preTap)} KB > 1024 KB`);
for (const a of audio) if (a > 1.5 * 1024 * 1024) fails.push(`audio file ${kb(a)} KB > 1536 KB`);
if (fails.length) {
  console.error('BUDGET FAILED:\n- ' + fails.join('\n- '));
  process.exit(1);
}
console.log('budget OK');
