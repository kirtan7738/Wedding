import { test, expect } from '@playwright/test';

const heroVisible = (page) => expect(page.locator('#hero [data-hero-names]')).toBeVisible();
const scrollLocked = (page) => page.evaluate(() => getComputedStyle(document.documentElement).overflow === 'hidden');

test('cover shows the open call-to-action and locks scrolling', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /આમંત્રણ ખોલો/ })).toBeVisible();
  expect(await scrollLocked(page)).toBe(true);
});

test('tapping the seal opens the invitation within 5 s and unlocks scrolling', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /આમંત્રણ ખોલો/ }).click();
  await expect(page.locator('.cover')).toBeHidden({ timeout: 5000 });
  await heroVisible(page);
  expect(await scrollLocked(page)).toBe(false);
});

test('an immediate tap (before the app has finished setting up) still opens', async ({ page }) => {
  await page.goto('/', { waitUntil: 'commit' });
  const cta = page.getByRole('button', { name: /આમંત્રણ ખોલો/ });
  await cta.click({ timeout: 10_000 });
  await page.waitForFunction(() => window.__booted === true);
  if (!(await page.evaluate(() => window.__openCount))) await cta.click(); // tap landed before React was listening
  await expect(page.locator('.cover')).toBeHidden({ timeout: 6000 });
});

test('a fast double tap starts the opening only once', async ({ page }) => {
  await page.goto('/');
  const cta = page.getByRole('button', { name: /આમંત્રણ ખોલો/ });
  await cta.click();
  await page.evaluate(() => document.querySelector('.cta')?.click()); // second tap, atomically (no actionability wait under load)
  await expect(page.locator('.cover')).toBeHidden({ timeout: 5000 });
  expect(await page.evaluate(() => window.__openCount)).toBe(1);
});

test('tapping before heavy assets load still opens instantly on the 2D path, without errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.route(/\/World-[^/]*\.js|\/audio\//, async (route) => {
    await new Promise((r) => setTimeout(r, 10_000));
    await route.continue().catch(() => {});
  });
  await page.goto('/');
  await page.getByRole('button', { name: /આમંત્રણ ખોલો/ }).click();
  await expect(page.locator('.cover')).toBeHidden({ timeout: 5000 });
  await heroVisible(page);
  expect(errors).toEqual([]);
});

test('skip jumps straight to the invitation', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced', 'no skip button in the reduced-motion path');
  await page.goto('/');
  await page.getByRole('button', { name: /આમંત્રણ ખોલો/ }).click();
  await expect(page.getByRole('button', { name: /છોડો/ })).toBeVisible();
  // press it atomically (its fade-in animation can make an actionability wait outlast the opening under CPU load)
  expect(await page.evaluate(() => (document.querySelector('.skip-btn')?.click(), true))).toBe(true);
  await expect(page.locator('.cover')).toBeHidden({ timeout: 800 });
  await heroVisible(page);
});

test('reduced motion: no particle canvases, quick cross-fade', async ({ page }, info) => {
  test.skip(info.project.name !== 'reduced', 'reduced-motion project only');
  await page.goto('/');
  await page.getByRole('button', { name: /આમંત્રણ ખોલો/ }).click();
  await expect(page.locator('.cover')).toBeHidden({ timeout: 1000 });
  expect(await page.locator('canvas[data-fx]').count()).toBe(0);
});

test('returning in the same session (back button) skips the cover', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /આમંત્રણ ખોલો/ }).click();
  await expect(page.locator('.cover')).toBeHidden({ timeout: 5000 });
  await page.reload();
  await expect(page.locator('.cover')).toBeHidden();
  expect(await scrollLocked(page)).toBe(false);
});
