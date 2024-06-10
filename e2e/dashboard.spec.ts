import { expect, test } from '@playwright/test';

test('should redirect from root to dashboard', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL('/dashboard');
});
