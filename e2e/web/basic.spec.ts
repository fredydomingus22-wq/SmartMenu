import { test, expect } from '@playwright/test';

test('web dashboard homepage has title', async ({ page }) => {
  await page.goto('/');
  // Basic sanity check, adjust based on actual login redirect or content
  await expect(page).toHaveTitle(/SmartMenu/);
});
