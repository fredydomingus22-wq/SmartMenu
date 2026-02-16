import { test, expect } from '@playwright/test';

test('consumer menu page loads', async ({ page }) => {
  // Replace with a valid tenant ID for testing
  await page.goto('/menu/central');
  // Basic check for menu grid or branding
  await expect(page.locator('body')).toBeVisible();
});
