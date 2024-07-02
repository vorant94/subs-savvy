import { expect, test } from '@playwright/test';
import dayjs from 'dayjs';
import { monthlySubscription } from '../src/subscriptions/models/subscription.mock';
import type { InsertSubscriptionModel } from '../src/subscriptions/models/subscription.model';
import { SubscriptionsPom } from '../src/subscriptions/pages/subscriptions.pom';

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

  await pom.nameInput.fill(subscription.name);
  await pom.descriptionTextarea.fill(subscription.description);
  await pom.iconSelect.fill(subscription.icon);
  await pom.priceInput.fill(subscription.price);
  await pom.startedAtDatePickerInput.fill(subscription.startedAt);
  await pom.endedAtDatePickerInput.fill(subscription.endedAt);
  await pom.eachInput.fill(subscription.cycle.each);
  await pom.periodSelect.fill(subscription.cycle.period);
  // TODO: add filling tag here

  await pom.insertSubscriptionButton.click();

  await expect(
    pom.noSubscriptionsPlaceholder,
    `should hide no subscriptions placeholder`,
  ).not.toBeVisible();
});
