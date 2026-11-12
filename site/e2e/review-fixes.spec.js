import { test, expect } from '@playwright/test';

// Regression tests for the final whole-branch review findings.
const delayEntry = (page, ms) =>
  page.route(/\/assets\/index-[^/]+\.js$/, async (route) => {
    await new Promise((r) => setTimeout(r, ms));
    await route.continue();
  });

test('#1 a tap on the cover before the app has loaded is remembered and opens the invitation', async ({ page }, info) => {
  test.skip(!['m390', 'reduced'].includes(info.project.name), 'two projects suffice');
  await delayEntry(page, 3000);
  await page.goto('/', { waitUntil: 'commit' });
  await page.getByRole('button', { name: /આમંત્રણ ખોલો/ }).click();
  // no second tap: the remembered tap must open it once the app boots
  await expect(page.locator('.cover')).toBeHidden({ timeout: 12_000 });
  expect(await page.evaluate(() => window.__openCount)).toBe(1);
});

test('#2 a slow (not failed) script keeps the cover and the opening still plays', async ({ page }, info) => {
  test.skip(info.project.name !== 'm390', 'once');
  await delayEntry(page, 5500);
  await page.goto('/', { waitUntil: 'commit' });
  await page.waitForTimeout(4600);
  await expect(page.locator('.cover')).toBeVisible(); // fail-safe must not have fired
  await page.waitForFunction(() => window.__booted === true, null, { timeout: 15_000 });
  await page.getByRole('button', { name: /આમંત્રણ ખોલો/ }).click();
  await expect(page.locator('.cover')).toBeHidden({ timeout: 8000 });
});

test('#5 skip really skips: no celebration burst fires over the invitation', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced', 'no burst in reduced motion');
  await page.goto('/');
  await page.getByRole('button', { name: /આમંત્રણ ખોલો/ }).click();
  await page.waitForTimeout(600);
  await expect(page.getByRole('button', { name: /છોડો/ })).toBeVisible();
  // read the count and press skip atomically inside the page (no race with the burst beat under CPU load)
  const before = await page.evaluate(() => {
    const n = window.__burstCount || 0;
    document.querySelector('.skip-btn').click();
    return n;
  });
  await expect(page.locator('.cover')).toBeHidden({ timeout: 1500 });
  await page.waitForTimeout(1800); // past the burst beat
  expect(await page.evaluate(() => window.__burstCount || 0)).toBe(before); // nothing new fires after skipping
});

test('#6 large system text: the cover copy and the button still fit without overlapping', async ({ page }, info) => {
  test.skip(info.project.name !== 'm360', 'small phone');
  await page.addInitScript(() => document.addEventListener('DOMContentLoaded', () => (document.documentElement.style.fontSize = '130%')));
  await page.goto('/?tier=2d');
  await page.evaluate(() => document.fonts.ready);
  const fit = await page.evaluate(() => {
    const r = (s) => document.querySelector(s).getBoundingClientRect();
    const cta = r('.cta'), title = r('.cover-title'), date = r('.cover-date');
    return { ctaOnScreen: cta.bottom <= innerHeight && cta.top > innerHeight * 0.6, titleHigh: title.top < innerHeight * 0.3, noOverlap: date.bottom < cta.top };
  });
  expect(fit).toEqual({ ctaOnScreen: true, titleHigh: true, noOverlap: true });
});

test('#8 a guest who scrolls past the hero before the reveal ends gets no lingering petals', async ({ page }, info) => {
  test.skip(!['m390', 'desktop'].includes(info.project.name), 'motion projects');
  await page.goto('/');
  await page.getByRole('button', { name: /આમંત્રણ ખોલો/ }).click();
  await page.waitForFunction(() => document.documentElement.classList.contains('opened'), null, { timeout: 8000 });
  await page.evaluate(() => document.getElementById('moments').scrollIntoView()); // scroll away right after unlock
  await page.waitForTimeout(3000); // past the end of the opening timeline
  expect(await page.evaluate(() => window.__ambientOn)).toBe(false);
});
