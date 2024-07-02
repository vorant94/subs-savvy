import { expect, test } from '@playwright/test';
import dayjs from 'dayjs';
import type { InsertSubscriptionModel } from '../src/subscriptions/models/subscription.model';
import { SubscriptionsPom } from '../src/subscriptions/pages/subscriptions.pom';

test.skip('should create subscription', async ({ page }) => {
  const subscriptionsPage = new SubscriptionsPom(page);

  const formValue = {
    name: 'Webstorm',
    description: 'JavaScript/TypeScript IDE',
    icon: 'jetbrains',
    price: 10,
    startedAt: dayjs(new Date()).subtract(2, 'month').toDate(),
    endedAt: dayjs(new Date()).add(1, 'year').toDate(),
    cycle: {
      each: 1,
      period: 'monthly',
    },
    tags: [],
  } as const satisfies InsertSubscriptionModel;

  await subscriptionsPage.goto();

  await expect(
    page.getByText('No Subscriptions'),
    `should show no subscriptions placeholder initially`,
  ).toBeVisible();

  await subscriptionsPage.addSubscriptionButton.click();

  await subscriptionsPage.nameInput.fill(formValue.name);
  await subscriptionsPage.descriptionTextarea.fill(formValue.description);
  await subscriptionsPage.iconSelect.fill(formValue.icon);
  await subscriptionsPage.priceInput.fill(formValue.price);
  await subscriptionsPage.startedAtDatePickerInput.fill(formValue.startedAt);
  await subscriptionsPage.endedAtDatePickerInput.fill(formValue.endedAt);
  await subscriptionsPage.eachInput.fill(formValue.cycle.each);
  await subscriptionsPage.periodSelect.fill(formValue.cycle.period);

  await subscriptionsPage.insertSubscriptionButton.click();

  await expect(
    page.getByText('No Subscriptions'),
    `should hide no subscriptions placeholder`,
  ).not.toBeVisible();
});
