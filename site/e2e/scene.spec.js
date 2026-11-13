import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const tapOpen = (page) => page.getByRole('button', { name: /દ્વાર ખોલો/ }).click();
const cinemaReady = (page) => page.waitForFunction(() => document.documentElement.classList.contains('cinema'), null, { timeout: 30_000 });

// Headless Chrome renders WebGL in software (SwiftShader): frames are slow, so these run one at a time with room.
test.describe('cinema world', () => {
  test.describe.configure({ mode: 'serial', timeout: 120_000 });
  test.beforeEach(({}, info) => {
    test.skip(!['m390', 'desktop'].includes(info.project.name), 'WebGL projects only');
  });

  test('the doors open and the camera flies into the mandap without errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto('/?tier=high&dpr=0.4');
    await cinemaReady(page);
    await tapOpen(page);
    await expect(page.locator('.cover')).toBeHidden({ timeout: 20_000 });
    expect(await page.evaluate(() => window.__fxMode)).toBe('3d');
    await expect.poll(() => page.evaluate(() => window.__world.state.door), { timeout: 20_000 }).toBe(1);
    await page.waitForFunction(() => document.documentElement.classList.contains('opened') && window.__world.state.override == null, null, { timeout: 30_000 });
    expect(errors).toEqual([]);
  });

  test('after the opening the camera holds on the mandap while the page scrolls', async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('kankotri-opened', '1'));
    await page.goto('/?tier=high&dpr=0.4');
    await cinemaReady(page);
    await expect.poll(() => page.evaluate(() => Math.round(window.__world.state.t * 10) / 10), { timeout: 20_000 }).toBe(1);
    const at = () => page.evaluate(() => window.__world.camera.position.toArray());
    const before = await at();
    await page.evaluate(() => document.getElementById('closing').scrollIntoView({ block: 'end' }));
    await page.waitForTimeout(2500);
    const after = await at();
    expect(Math.hypot(...after.map((v, i) => v - before[i]))).toBeLessThan(0.05); // held still (no scroll-driven shots)
  });

  test('WebGL context lost mid-opening: the opening completes and the page falls back to stills', async ({ page }) => {
    await page.goto('/?tier=high&dpr=0.4&forceContextLoss');
    await cinemaReady(page);
    await tapOpen(page);
    await expect(page.locator('.cover')).toBeHidden({ timeout: 20_000 });
    await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('stills')), { timeout: 20_000 }).toBe(true);
  });
});

test('three.js is lazy-loaded (not in the entry bundle)', async ({}, info) => {
  test.skip(info.project.name !== 'm390', 'build check once');
  const dist = path.resolve('dist');
  const html = readFileSync(path.join(dist, 'index.html'), 'utf8');
  const entry = html.match(/src="\/assets\/([^"]+\.js)"/)[1];
  const code = readFileSync(path.join(dist, 'assets', entry), 'utf8');
  expect(code).not.toContain('WebGLRenderer');
  const chunks = readdirSync(path.join(dist, 'assets')).filter((f) => f.endsWith('.js'));
  expect(chunks.some((f) => readFileSync(path.join(dist, 'assets', f), 'utf8').includes('WebGLRenderer'))).toBe(true);
});
