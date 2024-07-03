import { expect, type Page, test } from '@playwright/test';
import dayjs from 'dayjs';
import type { db } from '../src/db/globals/db';
import { monthlySubscription } from '../src/subscriptions/models/subscription.mock';
import type {
  InsertSubscriptionModel,
  SubscriptionModel,
} from '../src/subscriptions/models/subscription.model';
import { SubscriptionsPom } from '../src/subscriptions/pages/subscriptions.pom';
import { tag as tagMock } from '../src/tags/models/tag.mock';
import type { InsertTagModel } from '../src/tags/models/tag.model';

test.describe('subscriptions', () => {
  test('should create subscription', async ({ page }) => {
    const pom = new SubscriptionsPom(page);

    const subscription = {
      ...monthlySubscription,
      description: 'Basic Plan',
      endedAt: dayjs(monthlySubscription.startedAt).add(1, 'year').toDate(),
      tags: [],
    } as const satisfies InsertSubscriptionModel;

    await pom.goto();

    await expect(
      pom.noSubscriptionsPlaceholder,
      `should show no subscriptions placeholder initially`,
    ).toBeVisible();

    await pom.addSubscriptionButton.click();

    await pom.fillSubscriptionUpsert(subscription);

    await pom.subscriptionUpsert.insertButton.click();

    await expect(
      pom.noSubscriptionsPlaceholder,
      `should hide no subscriptions placeholder`,
    ).not.toBeVisible();

    // TODO: add check for subscription card is shown
  });

  test('should delete subscription', async ({ page }) => {
    const pom = new SubscriptionsPom(page);

    await pom.goto();

    await populateDb(page, [monthlySubscription]);

    await expect(
      pom.noSubscriptionsPlaceholder,
      `should hide no subscriptions placeholder after db was populated`,
    ).not.toBeVisible();

    await pom.subscriptionListItem(monthlySubscription).click();

    await pom.subscriptionUpsert.deleteButton.click();

    await expect(
      pom.noSubscriptionsPlaceholder,
      `should show no subscriptions placeholder after subscription was deleted`,
    ).toBeVisible();
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
