// Renders each film shot of the cinema world to a still (fallback backgrounds for phones without the
// 3D world, and the instant first paint of the cover). Needs the dev server: npm run dev, then
//   node scripts/stills.mjs [http://localhost:5180]
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] || 'http://localhost:5180';
const SHOTS = [
  ['cover', 0, '&door=0&amb=0'],
  ['hero', 1, '&amb=0.4&shower=0.5'],
];
mkdirSync('public/img/shots', { recursive: true });
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 540, height: 1170 }, deviceScaleFactor: 1 });
for (const [name, t, extra] of SHOTS) {
  await p.goto(`${base}/world.html?t=${t}${extra}`);
  await p.waitForFunction(() => window.__worldReady, null, { timeout: 90000 });
  await p.waitForTimeout(name === 'closing' ? 5200 : 1800);
  const png = await p.screenshot();
  await sharp(png).webp({ quality: 74 }).toFile(`public/img/shots/${name}.webp`);
  if (name === 'cover') await sharp(png).resize(270).webp({ quality: 50 }).toFile(`public/img/shots/cover-lq.webp`);
  console.log('still', name);
}
await b.close();
