import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const opened = (page) => page.addInitScript(() => sessionStorage.setItem('kankotri-opened', '1'));

test('large system text (130%) on a 360 px phone: nothing overflows, names stay inside', async ({ page }, info) => {
  test.skip(info.project.name !== 'm360', 'small phone only');
  await opened(page);
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => (document.documentElement.style.fontSize = '130%'));
  });
  await page.goto('/');
  await page.evaluate(() => document.documentElement.classList.remove('js'));
  const offenders = await page.evaluate(() =>
    [...document.querySelectorAll('main *')]
      .filter((e) => !e.closest('[data-allow-bleed]'))
      .filter((e) => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
      .map((e) => e.tagName + '.' + (e.getAttribute('class') || '')),
  );
  expect(offenders).toEqual([]);
  const names = await page.locator('#hero [data-hero-names]').boundingBox();
  expect(names.x).toBeGreaterThanOrEqual(0);
  expect(names.x + names.width).toBeLessThanOrEqual(360);
});

test('cover is visible within 2.5 s on Fast 4G', async ({ page, browserName }, info) => {
  test.skip(info.project.name !== 'm390' || browserName !== 'chromium', 'CDP throttling, once');
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (9 * 1024 * 1024) / 8, uploadThroughput: (1.5 * 1024 * 1024) / 8 });
  const t0 = Date.now();
  await page.goto('/', { waitUntil: 'commit' });
  await expect(page.getByRole('button', { name: /આમંત્રણ ખોલો/ })).toBeVisible({ timeout: 5000 });
  expect(Date.now() - t0).toBeLessThan(2500);
});

test('no serious or critical accessibility violations on the open invitation', async ({ page }, info) => {
  test.skip(info.project.name !== 'm390', 'once');
  await opened(page);
  await page.goto('/');
  await page.evaluate(() => document.documentElement.classList.remove('js'));
  const results = await new AxeBuilder({ page }).include('main').disableRules(['color-contrast']).analyze();
  const bad = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => `${v.id}: ${v.nodes.length}`);
  expect(bad).toEqual([]);
});

test('body text meets contrast on light sections', async ({ page }, info) => {
  test.skip(info.project.name !== 'm390', 'once');
  await opened(page);
  await page.goto('/');
  await page.evaluate(() => document.documentElement.classList.remove('js'));
  const results = await new AxeBuilder({ page }).include('#invitation').include('#moments').include('#venue').withRules(['color-contrast']).analyze();
  const bad = results.violations.flatMap((v) => v.nodes.map((n) => n.target.join(' ')));
  expect(bad).toEqual([]);
});

test('cover composition holds on every phone size: title high over the doors, the button low and on screen', async ({ page }, info) => {
  test.skip(!['m360', 'm390', 'm430'].includes(info.project.name), 'phones');
  await page.goto('/?tier=2d');
  await page.evaluate(() => document.fonts.ready);
  const fit = await page.evaluate(() => {
    const r = (s) => document.querySelector(s).getBoundingClientRect();
    const cta = r('.cta'), title = r('.cover-title'), date = r('.cover-date');
    return { ctaOnScreen: cta.bottom <= innerHeight && cta.top > innerHeight * 0.6, titleHigh: title.top < innerHeight * 0.3, noOverlap: date.bottom < cta.top };
  });
  expect(fit).toEqual({ ctaOnScreen: true, titleHigh: true, noOverlap: true });
});
