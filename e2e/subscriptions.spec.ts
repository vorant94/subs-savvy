import { expect, test } from '@playwright/test';
import dayjs from 'dayjs';
import { monthlySubscription } from '../src/subscriptions/models/subscription.mock';
import type { InsertSubscriptionModel } from '../src/subscriptions/models/subscription.model';
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

    await pom.subscriptionUpsert.nameControl.fill(subscription.name);
    await pom.subscriptionUpsert.descriptionControl.fill(
      subscription.description,
    );
    await pom.subscriptionUpsert.iconControl.fill(subscription.icon);
    await pom.subscriptionUpsert.priceControl.fill(subscription.price);
    await pom.subscriptionUpsert.startedAtControl.fill(subscription.startedAt);
    await pom.subscriptionUpsert.endedAtControl.fill(subscription.endedAt);
    await pom.subscriptionUpsert.eachControl.fill(subscription.cycle.each);
    await pom.subscriptionUpsert.periodControl.fill(subscription.cycle.period);
    // TODO: add filling tag here

    await pom.subscriptionUpsert.insertButton.click();

    await expect(
      pom.noSubscriptionsPlaceholder,
      `should hide no subscriptions placeholder`,
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

    await pom.tagForm.nameControl.fill(tag.name);
    await pom.tagForm.colorControl.fill(tag.color);

    await pom.insertTagButton.click();

    // TODO: move it to SubscriptionsPom
    await expect(
      page.getByRole('paragraph'),
      `should show newly inserted tag name in list in modal`,
    ).toHaveText(tag.name);
  });
});
