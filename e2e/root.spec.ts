import { expect, test } from '@playwright/test';
import type { db } from '../src/db/globals/db';
import { rootRoute } from '../src/ui/types/root-route';

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

// TODO find a place to define global types for test files
declare global {
  interface Window {
    Dexie: typeof db;
  }
}
