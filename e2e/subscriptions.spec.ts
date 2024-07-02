import { expect, test } from '@playwright/test';
import dayjs from 'dayjs';
import { monthlySubscription } from '../src/subscriptions/models/subscription.mock';
import type { InsertSubscriptionModel } from '../src/subscriptions/models/subscription.model';
import { SubscriptionsPom } from '../src/subscriptions/pages/subscriptions.pom';

test('should create subscription', async ({ page }) => {
  const subscriptionsPage = new SubscriptionsPom(page);

  const subscription = {
    ...monthlySubscription,
    description: 'Basic Plan',
    endedAt: dayjs(monthlySubscription.startedAt).add(1, 'year').toDate(),
    tags: [],
  } as const satisfies InsertSubscriptionModel;

  await subscriptionsPage.goto();

  await expect(
    subscriptionsPage.noSubscriptionsPlaceholder,
    `should show no subscriptions placeholder initially`,
  ).toBeVisible();

  await subscriptionsPage.addSubscriptionButton.click();

  await subscriptionsPage.nameInput.fill(subscription.name);
  await subscriptionsPage.descriptionTextarea.fill(subscription.description);
  await subscriptionsPage.iconSelect.fill(subscription.icon);
  await subscriptionsPage.priceInput.fill(subscription.price);
  await subscriptionsPage.startedAtDatePickerInput.fill(subscription.startedAt);
  await subscriptionsPage.endedAtDatePickerInput.fill(subscription.endedAt);
  await subscriptionsPage.eachInput.fill(subscription.cycle.each);
  await subscriptionsPage.periodSelect.fill(subscription.cycle.period);
  // TODO: add filling tag here

  await subscriptionsPage.insertSubscriptionButton.click();

  await expect(
    subscriptionsPage.noSubscriptionsPlaceholder,
    `should hide no subscriptions placeholder`,
  ).not.toBeVisible();
});
