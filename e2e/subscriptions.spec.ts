import { expect, test } from '@playwright/test';
import dayjs from 'dayjs';
import type { InsertSubscriptionModel } from '../src/subscriptions/models/subscription.model';

test('should create subscription', async ({ page }) => {
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
  await page.getByLabel('icon').selectOption(formValue.icon);
  await page.getByLabel('price').fill(`${formValue.price}`);
  await page.getByLabel('started at').fill(formValue.startedAt);
  await page.getByLabel('ended at').fill(formValue.endedAt);
  await page.getByLabel('each').fill(`${formValue.cycle.each}`);
  await page.getByLabel('period').selectOption(formValue.cycle.period);

  await page.getByRole('button', { name: 'insert' }).click();

  await expect(
    page.getByText('No Subscriptions'),
    `should hide no subscriptions placeholder after subscription was inserted`,
  ).not.toBeVisible();
  await expect(
    page.getByRole('button', { name: 'update' }),
    'should switch to update mode',
  ).toBeVisible();

  await expect(
    page.getByText(formValue.name),
    `should show newly inserted subscription name`,
  ).toBeVisible();
  await expect(
    page.getByText(formValue.description),
    `should show newly inserted subscription description`,
  ).toBeVisible();
  await expect(
    page.getByText(formValue.price),
    `should show newly inserted subscription price`,
  ).toBeVisible();
});
