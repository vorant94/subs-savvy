import { expect, test } from '@playwright/test';
import { route } from '../src/router/types/route';

test.describe('dashboard', () => {
  test('should redirect from root to dashboard', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(`/${route.dashboard}`);
  });
});
