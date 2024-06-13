import { expect, test } from '@playwright/test';
import type { RawFormValue } from '../src/form/types/raw-form-value';
import type { InsertTagModel } from '../src/tags/models/tag.model';

test('should create tag', async ({ page }) => {
  const formValue = {
    name: 'entertainment',
    color: '#b3b3b3',
  } as const satisfies RawFormValue<InsertTagModel>;

  await page.goto('/');
  await page.getByRole('link', { name: 'subscriptions' }).click();

  await expect(
    page.getByText('no tags to show'),
    `should show no tags placeholder initially`,
  ).toBeVisible();

  await page.getByRole('button', { name: 'manage' }).click();
  await page.getByRole('button', { name: 'add tag' }).click();

  await page.getByLabel('name').fill(formValue.name);
  await page.getByLabel('color').fill(formValue.color);

  await page.getByRole('button', { name: 'insert' }).click();

  await expect(
    page.getByText('no tags to show'),
    `should hide no tags placeholder after tag was inserted`,
  ).not.toBeVisible();

  const tagEls = await page.getByText(formValue.name).all();
  expect(
    tagEls.length,
    `should show newly inserted tag name in header and in modal`,
  ).toBe(2);
});
