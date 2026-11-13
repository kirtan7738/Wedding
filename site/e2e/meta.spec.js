import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import jsQR from 'jsqr';

const SITE = process.env.VITE_SITE_URL || 'https://princy-parth.netlify.app';

test.beforeEach(({}, info) => test.skip(info.project.name !== 'm390', 'static checks once'));

test('WhatsApp/Open Graph meta are Gujarati, absolute and complete', async ({ page }) => {
  await page.goto('/');
  const meta = (p) => page.locator(`meta[property="${p}"]`).getAttribute('content');
  expect(await meta('og:title')).toBe('પ્રિન્સી ❀ પાર્થ — શુભ લગ્ન');
  expect(await meta('og:description')).toBe('રવિવાર, ૧૩/૧૨/૨૦૨૬ · અતિથી પાર્ટી પ્લોટ, પેટલાદ');
  expect(await meta('og:image')).toBe(`${SITE}/og.png`);
  expect(await meta('og:url')).toBe(`${SITE}/`);
  expect(await meta('og:type')).toBe('website');
  expect(await page.locator('meta[name="twitter:card"]').getAttribute('content')).toBe('summary_large_image');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
});

test('preview image is 1200×630 and under 300 KB', async () => {
  const file = path.resolve('public/og.png');
  const meta = await sharp(file).metadata();
  expect([meta.width, meta.height]).toEqual([1200, 630]);
  expect(readFileSync(file).length).toBeLessThan(300 * 1024);
});

test('QR code scans to the site URL', async () => {
  const { data, info } = await sharp(path.resolve('public/qr.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const code = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  expect(code?.data).toBe(`${SITE}/`);
});
