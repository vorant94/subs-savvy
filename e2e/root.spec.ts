import { rootRoute } from '@/ui/types/root-route.ts';
import { expect, test } from '@playwright/test';

test.describe('root', () => {
  test('should redirect from root url to dashboard', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(`/${rootRoute.dashboard}`);
  });

  test('should have Dexie be defined on window', async ({ page }) => {
    await page.goto('/');

    const isDexie = await page.evaluate(() => !!window.Dexie);

    expect(isDexie).toBeTruthy();
  });
});
