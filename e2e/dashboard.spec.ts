import { expect, test } from '@playwright/test';
import { route } from '../src/router/types/route';

test('should redirect from root to dashboard', async ({ page }) => {
  await page.goto(route.root);
  await expect(page).toHaveURL(route.dashboard);
});
