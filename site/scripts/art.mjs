// Renders the hand-painted miniature cut-outs (src/cinema/art.js) to public/img/art/*.webp with alpha.
// Needs the dev server:  npm run dev   then   node scripts/art.mjs [http://localhost:5180]
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] || 'http://localhost:5180';
mkdirSync('public/img/art', { recursive: true });
const b = await chromium.launch();
const p = await b.newPage();
p.on('pageerror', (e) => console.error('page error', e.message));
await p.goto(`${base}/art.html`);
await p.waitForFunction(() => window.__artReady, null, { timeout: 60000 });
const art = await p.evaluate(() => window.__art);
for (const [name, url] of Object.entries(art)) {
  const buf = Buffer.from(url.split(',')[1], 'base64');
  const out = `public/img/art/${name}.webp`;
  await sharp(buf).webp({ quality: 86, alphaQuality: 90 }).toFile(out);
  console.log('art', name);
}
await p.screenshot({ path: process.argv[3] || 'art-sheet.png', fullPage: true });
await b.close();
