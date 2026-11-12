import { test, expect } from '@playwright/test';

test('page renders Gujarati title and has no horizontal overflow', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/પ્રિન્સી/);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  const fam = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(fam).toContain('Hind Vadodara');
});
