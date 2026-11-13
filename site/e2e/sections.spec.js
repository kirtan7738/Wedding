import { test, expect } from '@playwright/test';
import wedding from '../src/content/wedding.js';

const ORDER = ['hero', 'invitation', 'countdown', 'moments', 'venue', 'interlude', 'closing'];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.documentElement.classList.remove('js')); // reveal everything for layout checks
});

test('sections are present in spec order', async ({ page }) => {
  const ids = await page.$$eval('main > section[id]', (els) => els.map((e) => e.id));
  expect(ids).toEqual(ORDER);
});

test('moments shows exactly the two events with their times', async ({ page }) => {
  const cards = page.locator('#moments [data-event]');
  await expect(cards).toHaveCount(2);
  await expect(cards.nth(0)).toContainText('હસ્ત મેળાપ');
  await expect(cards.nth(0)).toContainText('સાંજે ૬:૦૦ કલાકે');
  await expect(cards.nth(1)).toContainText('ભોજન સમારંભ');
  await expect(cards.nth(1)).toContainText('સાંજે ૬:૩૦ કલાકે');
});

test('invitation names both families', async ({ page }) => {
  const inv = page.locator('#invitation');
  await expect(inv).toContainText('ચિ. પ્રિન્સી');
  await expect(inv).toContainText('ચિ. પાર્થકુમાર');
  await expect(inv).toContainText('મિસ્ત્રી પરિવાર · સોની પરિવાર');
});

test('no couple photos anywhere; directions and share are wired', async ({ page }) => {
  await expect(page.locator('main img[src*="/img/couple-"], main source[srcset*="/img/couple-"]')).toHaveCount(0); // the old photos (painted art is fine)
  await expect(page.locator('#venue a[data-directions]')).toHaveAttribute('href', wedding.venue.mapsUrl);
  const wa = await page.locator('a[data-share="whatsapp"]').getAttribute('href');
  expect(wa.startsWith('https://wa.me/?text=')).toBe(true);
});

test('nothing overflows the viewport horizontally', async ({ page }) => {
  const offenders = await page.evaluate(() =>
    [...document.querySelectorAll('main *')]
      .filter((e) => !e.closest('[data-allow-bleed]'))
      .filter((e) => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
      .map((e) => e.tagName + '.' + e.className),
  );
  expect(offenders).toEqual([]);
});

test('every button and link is at least 48×48', async ({ page }) => {
  const small = await page.evaluate(() =>
    [...document.querySelectorAll('main a, main button')]
      .map((e) => ({ e, r: e.getBoundingClientRect() }))
      .filter(({ r }) => r.width > 0 && (r.width < 48 || r.height < 48))
      .map(({ e, r }) => `${e.textContent.trim().slice(0, 20)} ${Math.round(r.width)}×${Math.round(r.height)}`),
  );
  expect(small).toEqual([]);
});

test('Gujarati text is never letter-spaced', async ({ page }) => {
  const spaced = await page.evaluate(() =>
    [...document.querySelectorAll('main *')]
      .filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && /[઀-૿]/.test(n.textContent)))
      .filter((e) => !['normal', '0px'].includes(getComputedStyle(e).letterSpacing))
      .map((e) => e.textContent.slice(0, 20)),
  );
  expect(spaced).toEqual([]);
});
