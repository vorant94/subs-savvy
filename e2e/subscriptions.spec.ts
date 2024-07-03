import { expect, type Page, test } from '@playwright/test';
import dayjs from 'dayjs';
import type { db } from '../src/db/globals/db';
import {
  monthlySubscription,
  subscriptions as subscriptionsMock,
} from '../src/subscriptions/models/subscription.mock';
import type {
  InsertSubscriptionModel,
  SubscriptionModel,
  UpdateSubscriptionModel,
} from '../src/subscriptions/models/subscription.model';
import { SubscriptionsPom } from '../src/subscriptions/pages/subscriptions.pom';
import { tag as tagMock } from '../src/tags/models/tag.mock';
import type { InsertTagModel } from '../src/tags/models/tag.model';

test.describe('subscriptions', () => {
  test('should show no subscriptions placeholder if there are no subscriptions', async ({
    page,
  }) => {
    const pom = new SubscriptionsPom(page);

    await pom.goto();

    await expect(pom.noSubscriptionsPlaceholder).toBeVisible();
  });

  test('should show subscriptions list items instead of placeholder if there are subscriptions', async ({
    page,
  }) => {
    const pom = new SubscriptionsPom(page);
    const subscriptions = [...subscriptionsMock];

    await pom.goto();
    await populateDb(page, subscriptions);

    await expect(pom.noSubscriptionsPlaceholder).not.toBeVisible();
    for (const subscription of subscriptions) {
      await expect(pom.subscriptionListItem(subscription)).toBeVisible();
    }
  });

  test('should create subscription', async ({ page }) => {
    const pom = new SubscriptionsPom(page);
    const subscriptionToCreate = {
      ...monthlySubscription,
      description: 'Basic Plan',
      endedAt: dayjs(monthlySubscription.startedAt).add(1, 'year').toDate(),
      tags: [],
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

  test('should create tag', async ({ page }) => {
    const pom = new SubscriptionsPom(page);
    const tag = {
      ...tagMock,
    } as const satisfies InsertTagModel;

    await pom.goto();

    await pom.manageTagsButton.click();
    await pom.addTagButton.click();
    await pom.fillTagForm(tag);
    await pom.insertTagButton.click();

    // TODO: move it to SubscriptionsPom
    await expect(
      page.getByRole('paragraph'),
      `should show newly inserted tag name in list in modal`,
    ).toHaveText(tag.name);
  });
});

async function populateDb(
  page: Page,
  subscriptions: Array<SubscriptionModel>,
): Promise<void> {
  await page.evaluate(async (subscriptions) => {
    await window.Dexie.transaction(
      'rw',
      window.Dexie.subscriptionsTags,
      window.Dexie.subscriptions,
      window.Dexie.tags,
      async () => {
        for (const { tags, ...subscription } of subscriptions) {
          const tagPuts = tags.map((tag) => window.Dexie.tags.put(tag));
          const tagLinkPuts = tags.map((tag) =>
            window.Dexie.subscriptionsTags.put({
              tagId: tag.id,
              subscriptionId: subscription.id,
            }),
          );

          await Promise.all([
            ...tagPuts,
            window.Dexie.subscriptions.put(subscription),
            ...tagLinkPuts,
          ]);
        }
      },
    );
  }, subscriptions);
}

// TODO find a place to define global types for test files
declare global {
  interface Window {
    Dexie: typeof db;
  }
}
