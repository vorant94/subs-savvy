import { expect, test } from '@playwright/test';
import dayjs from 'dayjs';
import type { InsertSubscriptionModel } from '../src/subscriptions/models/subscription.model';

test.skip('should create subscription', async ({ page }) => {
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

  await page.goto('/');
  await page.getByRole('link', { name: 'subscriptions' }).click();

  await expect(
    page.getByText('No Subscriptions'),
    `should show no subscriptions placeholder initially`,
  ).toBeVisible();

  await page.getByRole('button', { name: 'add sub' }).click();

  await page.getByLabel('name').fill(formValue.name);
  await page.getByLabel('description').fill(formValue.description);

  await page.getByLabel('icon').nth(0).click();
  await page
    .getByLabel('icon')
    .nth(1)
    .getByRole('option', { name: formValue.icon })
    .click();

  await page.getByLabel('price').fill(`${formValue.price}`);

  // TODO continue after mantine datepicker accessibility is resolved
});
