import { test, expect } from '@playwright/test';

// The envelope intro runs for real here (the other specs skip it via e2e/skip-intro.json).
test.use({ storageState: { cookies: [], origins: [] } });

test('first frame is the envelope; one tap opens the kankotri, zooms in and lands on the gate', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced', 'reduced motion has its own test');
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('/');
  // the very first screen asks for the language; ગુજરાતી lifts it away to the envelope
  await expect(page.locator('.lang-gate')).toBeVisible();
  await page.locator('.lang-gate [data-lang="gu"]').click();
  await expect(page.locator('.lang-gate')).toBeHidden({ timeout: 5000 });
  await expect(page.locator('.intro')).toBeVisible();
  await expect(page.locator('.pitara-latch')).toBeVisible();
  await page.locator('.intro-hit').click();
  // the gatefold opens (left, then right) …
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.querySelector('.kk-flap--l')).transform !== 'none'), { timeout: 8000 }).toBe(true);
  // … the intro hands over to the gate, whose doors then knock and open on their own (no second tap)
  await expect(page.locator('.intro')).toBeHidden({ timeout: 20_000 });
  await expect(page.locator('.cover')).toBeHidden({ timeout: 15_000 });
  expect(await page.evaluate(() => document.documentElement.classList.contains('opened'))).toBe(true);
  expect(errors).toEqual([]);
});

test('reduced motion: the envelope simply fades to the gate', async ({ page }, info) => {
  test.skip(info.project.name !== 'reduced', 'reduced only');
  await page.goto('/');
  await page.locator('.lang-gate [data-lang="gu"]').click();
  await expect(page.locator('.lang-gate')).toBeHidden({ timeout: 3000 });
  await page.locator('.intro-hit').click();
  await expect(page.locator('.intro')).toBeHidden({ timeout: 3000 });
});

test('a returning guest (same session) skips the envelope', async ({ page }, info) => {
  test.skip(info.project.name !== 'm390', 'once');
  await page.addInitScript(() => sessionStorage.setItem('kankotri-opened', '1'));
  await page.goto('/');
  await expect(page.locator('.intro')).toBeHidden();
});

test('language: English is chosen on the first screen, remembered, and can be switched back after the doors', async ({ page }, info) => {
  test.skip(info.project.name !== 'm390', 'once');
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('/');
  await page.locator('.lang-gate [data-lang="en"]').click();
  await expect(page.locator('.lang-gate')).toBeHidden({ timeout: 5000 });
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.intro-hit')).toHaveAttribute('aria-label', /Open the kankotri/);
  expect(await page.evaluate(() => localStorage.getItem('kankotri-lang'))).toBe('en');
  // a returning guest: no language screen, English straight away
  await page.reload();
  await expect(page.locator('.lang-gate')).toBeHidden();
  await expect(page.locator('#invitation .section-title')).toContainText('Our Invitation');
  // after the doors, the pill switches to Gujarati in place
  await page.evaluate(() => sessionStorage.setItem('kankotri-opened', '1'));
  await page.reload();
  await page.locator('.lang-toggle').click();
  await expect(page.locator('#invitation .section-title')).toContainText('હરખનું તેડું');
  await expect(page.locator('html')).toHaveAttribute('lang', 'gu');
  expect(errors).toEqual([]);
});
