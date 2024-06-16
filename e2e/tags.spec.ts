import { expect, test } from '@playwright/test';
import type { InsertTagModel } from '../src/tags/models/tag.model';

test('should create tag', async ({ page }) => {
  const formValue = {
    name: 'entertainment',
    color: '#b3b3b3',
  } as const satisfies InsertTagModel;

  await page.goto('/');
  await page.getByRole('link', { name: 'subscriptions' }).click();

  await page.getByRole('button', { name: 'manage' }).click();
  await page.getByRole('button', { name: 'add tag' }).click();

  await page.getByLabel('name').fill(formValue.name);
  await page.getByLabel('color').fill(formValue.color);

  await page.getByRole('button', { name: 'insert' }).click();

  const tagNameEls = await page.getByText(formValue.name).all();
  expect(
    tagNameEls.length,
    `should show newly inserted tag name in compobox in header and in list in modal`,
  ).toBe(2);
});
