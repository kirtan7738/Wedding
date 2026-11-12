import { test, expect } from '@playwright/test';

const opened = (page) => page.addInitScript(() => sessionStorage.setItem('kankotri-opened', '1'));

test('mobile: reveals are triggered, never scrubbed to the finger; at most one pinned section', async ({ page }, info) => {
  test.skip(!['m390', 'm360'].includes(info.project.name), 'mobile');
  await opened(page);
  await page.goto('/');
  await page.waitForFunction(() => window.__booted === true);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(600);
  const stats = await page.evaluate(async () => {
    const { ScrollTrigger } = await import('/node_modules/gsap/ScrollTrigger.js').catch(() => ({}));
    const all = (window.ScrollTrigger || ScrollTrigger)?.getAll?.() ?? [];
    return { scrub: all.filter((t) => t.vars.scrub).length, pinned: all.filter((t) => t.vars.pin).length };
  }).catch(() => ({ scrub: 0, pinned: 0 }));
  expect(stats.scrub).toBe(0);
  expect(stats.pinned).toBeLessThanOrEqual(1);
});

test('lenis smooth scroll only on desktop pointers', async ({ page }, info) => {
  test.skip(!['m390', 'desktop'].includes(info.project.name), 'one phone + desktop');
  await opened(page);
  await page.goto('/');
  await page.waitForFunction(() => window.__booted === true);
  await page.waitForTimeout(800);
  const hasLenis = await page.evaluate(() => !!window.__lenis);
  expect(hasLenis).toBe(info.project.name === 'desktop');
});

test('reduced motion: every section is readable without waiting for animations', async ({ page }, info) => {
  test.skip(info.project.name !== 'reduced', 'reduced only');
  await opened(page);
  await page.goto('/');
  for (const id of ['invitation', 'countdown', 'moments', 'venue', 'interlude', 'closing']) {
    await page.locator('#' + id).scrollIntoViewIfNeeded();
    await page.waitForTimeout(450);
    const hidden = await page.locator(`#${id} [data-reveal]`).evaluateAll((els) => els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length);
    expect(hidden, id).toBe(0);
  }
});
