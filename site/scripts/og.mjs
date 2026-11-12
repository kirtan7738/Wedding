// Render og.html (dev-only page) to public/og.png (1200×630) with the project's own fonts/art.
// CLI: node scripts/og.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = await createServer({ root, server: { port: 5199, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5199/og.html');
  await page.waitForFunction(() => window.__ogReady === true, null, { timeout: 30000 });
  await page.waitForTimeout(300);
  const png = await page.screenshot({ type: 'png' });
  await sharp(png).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(root, 'public', 'og.png'));
  console.log('og: public/og.png');
} finally {
  await browser.close();
  await server.close();
}
