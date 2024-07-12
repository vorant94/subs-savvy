import { expect, test, type Page } from '@playwright/test';
import dayjs from 'dayjs';
import {
  monthlySubscription,
  subscriptions as subscriptionsMock,
} from '../src/subscriptions/models/subscription.mock';
import type {
  InsertSubscriptionModel,
  SubscriptionModel,
  UpdateSubscriptionModel,
} from '../src/subscriptions/models/subscription.model.ts';
import { SubscriptionsPom } from '../src/subscriptions/pages/subscriptions.pom.ts';

test.describe('subscriptions', () => {
  test('should find subscriptions', async ({ page }) => {
    const pom = new SubscriptionsPom(page);
    const subscriptions = [...subscriptionsMock];

    await pom.goto();
    await populateDb(page, subscriptions);

    for (const subscription of subscriptions) {
      await expect(pom.subscriptionListItem(subscription)).toBeVisible();
    }
  });

  test('should insert subscription', async ({ page }) => {
    const pom = new SubscriptionsPom(page);
    const subscriptionToCreate = {
      ...monthlySubscription,
      description: 'Basic Plan',
      endedAt: dayjs(monthlySubscription.startedAt).add(1, 'year').toDate(),
    } as const satisfies InsertSubscriptionModel;

    await pom.goto();

    await pom.addSubscriptionButton.click();
    await pom.fillSubscriptionUpsert(subscriptionToCreate);
    await pom.subscriptionUpsert.insertButton.click();

    await expect(pom.subscriptionListItem(subscriptionToCreate)).toBeVisible();
  });

  test('should update subscription', async ({ page }) => {
    const pom = new SubscriptionsPom(page);
    const subscriptionToUpdate = {
      ...monthlySubscription,
    } as const satisfies SubscriptionModel;
    const updatedSubscription = {
      ...monthlySubscription,
      name: 'YouTube',
    } as const satisfies UpdateSubscriptionModel;

    await pom.goto();
    await populateDb(page, [subscriptionToUpdate]);

    await pom.subscriptionListItem(subscriptionToUpdate).click();
    await pom.fillSubscriptionUpsert(updatedSubscription);
    await pom.subscriptionUpsert.updateButton.click();

    await expect(
      pom.subscriptionListItem(subscriptionToUpdate),
    ).not.toBeVisible();
    await expect(pom.subscriptionListItem(updatedSubscription)).toBeVisible();
  });

  test('should delete subscription', async ({ page }) => {
    const pom = new SubscriptionsPom(page);
    const subscriptionToDelete = {
      ...monthlySubscription,
    } as const satisfies SubscriptionModel;

    await pom.goto();
    await populateDb(page, [subscriptionToDelete]);

    await pom.subscriptionListItem(subscriptionToDelete).click();
    await pom.subscriptionUpsert.deleteButton.click();

    await expect(
      pom.subscriptionListItem(subscriptionToDelete),
    ).not.toBeVisible();
  });
});

async function populateDb(
  page: Page,
  subscriptions: ReadonlyArray<SubscriptionModel>,
): Promise<void> {
  await page.evaluate(async (subscriptions) => {
    await window.Dexie.transaction(
      'rw',
      window.Dexie.subscriptions,
      window.Dexie.categories,
      async () => {
        const subscriptionPuts: Array<Promise<unknown>> = [];
        const categoryPuts: Array<Promise<unknown>> = [];

        for (const { category, ...subscription } of subscriptions) {
          subscriptionPuts.push(
            window.Dexie.subscriptions.put({
              ...subscription,
              categoryId: category?.id,
            }),
          );

          if (category) {
            categoryPuts.push(window.Dexie.categories.put(category));
          }
        }

        await Promise.all([...subscriptionPuts, ...categoryPuts]);
      },
    );
  }, subscriptions);
}
