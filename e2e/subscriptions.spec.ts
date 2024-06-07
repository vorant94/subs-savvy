import { expect, test } from '@playwright/test';
import { route } from '../src/router/types/route';
import {
  addSubscriptionButton,
  noSubscriptionsPlaceholder,
  subscriptionUpsertForm,
} from '../src/subscriptions/globals/subscription.test-id';

test('should create subscription', async ({ page }) => {
  await page.goto(route.subscriptions);

  await expect(
    page.getByTestId(noSubscriptionsPlaceholder),
    `should have no subscriptions initially`,
  ).toBeVisible();

  await page.getByTestId(addSubscriptionButton).click();

  await expect(
    page.getByTestId(subscriptionUpsertForm),
    `should show subscription upsert form`,
  ).toBeVisible();
});
