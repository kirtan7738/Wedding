import { test, expect } from '@playwright/test';

const tapOpen = (page) => page.getByRole('button', { name: /આમંત્રણ ખોલો/ }).click();

const namesDone = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('#hero [data-name]')].every((n) => {
      const cs = getComputedStyle(n);
      return cs.opacity === '1' && cs.visibility === 'visible' && (cs.clipPath === 'none' || cs.clipPath === '') && !cs.filter.includes('blur');
    }),
  );

test('names are revealed during the opening and end fully visible', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced', 'motion path');
  await page.goto('/');
  await tapOpen(page);
  // mid-reveal the names are partly wiped in (clip-path in use) — poll instead of one fragile instant
  await expect
    .poll(() => page.evaluate(() => [...document.querySelectorAll('#hero [data-name]')].some((n) => getComputedStyle(n).clipPath.startsWith('inset'))), {
      timeout: 8000,
      intervals: [100],
    })
    .toBe(true);
  await expect.poll(() => namesDone(page), { timeout: 12000 }).toBe(true);
});

test('ambient petals stop when the hero is scrolled away and return with it', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced', 'no ambient petals in reduced motion');
  await page.goto('/');
  await tapOpen(page);
  await expect.poll(() => page.evaluate(() => window.__ambientOn), { timeout: 7000 }).toBe(true);
  await page.locator('#countdown').scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.__ambientOn)).toBe(false);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => window.__ambientOn)).toBe(true);
});

test('reduced motion: names are fully visible right away, never wiped in', async ({ page }, info) => {
  test.skip(info.project.name !== 'reduced', 'reduced project only');
  await page.goto('/');
  await tapOpen(page);
  await page.waitForTimeout(900);
  expect(await namesDone(page)).toBe(true);
});
