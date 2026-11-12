import { test, expect } from '@playwright/test';

const opacity = (page, sel) => page.locator(sel).evaluate((el) => getComputedStyle(el.querySelector('[data-reveal]') || el).opacity);

test.describe('content is readable without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('sections and events are in the prerendered HTML', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#invitation')).toBeVisible();
    await expect(page.locator('#moments')).toBeVisible();
    await expect(page.getByText('હસ્ત મેળાપ').first()).toBeVisible();
    expect(await opacity(page, '#moments')).toBe('1');
  });
});

test('fail-safe shows content if the app bundle never boots', async ({ page }) => {
  await page.route('**/assets/*.js', (route) => route.abort());
  await page.goto('/');
  await page.waitForTimeout(4500);
  expect(await page.evaluate(() => document.documentElement.classList.contains('js'))).toBe(false);
  expect(await opacity(page, '#moments')).toBe('1');
});

test('sections reveal once when scrolled into view and never re-hide', async ({ page }, info) => {
  test.skip(info.project.name === 'desktop', 'mobile behaviour');
  await page.addInitScript(() => sessionStorage.setItem('kankotri-opened', '1')); // already opened: no cover
  await page.goto('/');
  await page.waitForFunction(() => window.__booted === true);
  expect(await opacity(page, '#moments')).toBe('0');
  await page.locator('#moments').scrollIntoViewIfNeeded();
  await expect.poll(() => opacity(page, '#moments'), { timeout: 4000 }).toBe('1');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.locator('#moments').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  expect(await opacity(page, '#moments')).toBe('1');
});

test('desktop: the film fills the window and the words stay in a centred column', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop only');
  await page.goto('/?tier=2d');
  const box = await page.locator('#invitation .silk-panel').boundingBox();
  const vw = page.viewportSize().width;
  expect(box.width).toBeLessThanOrEqual(560);
  expect(Math.abs(box.x + box.width / 2 - vw / 2)).toBeLessThanOrEqual(2);
});
