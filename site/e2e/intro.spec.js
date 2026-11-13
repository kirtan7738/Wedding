import { test, expect } from '@playwright/test';

// The envelope intro runs for real here (the other specs skip it via e2e/skip-intro.json).
test.use({ storageState: { cookies: [], origins: [] } });

test('first frame is the envelope; one tap opens the kankotri, zooms in and lands on the gate', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced', 'reduced motion has its own test');
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('/');
  await expect(page.locator('.intro')).toBeVisible();
  await expect(page.locator('.env-seal')).toBeVisible();
  await page.locator('.intro-hit').click();
  // the gatefold opens (left, then right) …
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.querySelector('.kk-flap--l')).transform !== 'none'), { timeout: 8000 }).toBe(true);
  // … and the intro hands over to the gate, whose door button now waits for the guest
  await expect(page.locator('.intro')).toBeHidden({ timeout: 20_000 });
  await expect(page.getByRole('button', { name: /આમંત્રણ ખોલો/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.classList.contains('opened'))).toBe(false);
  expect(errors).toEqual([]);
});

test('reduced motion: the envelope simply fades to the gate', async ({ page }, info) => {
  test.skip(info.project.name !== 'reduced', 'reduced only');
  await page.goto('/');
  await page.locator('.intro-hit').click();
  await expect(page.locator('.intro')).toBeHidden({ timeout: 3000 });
});

test('a returning guest (same session) skips the envelope', async ({ page }, info) => {
  test.skip(info.project.name !== 'm390', 'once');
  await page.addInitScript(() => sessionStorage.setItem('kankotri-opened', '1'));
  await page.goto('/');
  await expect(page.locator('.intro')).toBeHidden();
});
