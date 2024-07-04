import { expect, type Page, test } from '@playwright/test';
import type { db } from '../src/db/globals/db';
import { SubscriptionsPom } from '../src/subscriptions/pages/subscriptions.pom';
import { tag } from '../src/tags/models/tag.mock';
import type { InsertTagModel, TagModel } from '../src/tags/models/tag.model';

test.describe('tags', () => {
  test('should find tags', async ({ page }) => {
    const pom = new SubscriptionsPom(page);
    const tags = [tag];

    await pom.goto();
    await populateDb(page, tags);

    await pom.manageTagsButton.click();

    for (const tag of tags) {
      await expect(pom.tag(tag)).toBeVisible();
    }
  });

  test('should insert tag', async ({ page }) => {
    const pom = new SubscriptionsPom(page);
    const tagToCreate = {
      ...tag,
    } as const satisfies InsertTagModel;

    await pom.goto();

    await pom.manageTagsButton.click();
    await pom.addTagButton.click();
    await pom.fillTagForm(tagToCreate);
    await pom.insertTagButton.click();

    await expect(pom.tag(tagToCreate)).toBeVisible();
  });

  test('should update tag', async ({ page }) => {
    const pom = new SubscriptionsPom(page);
    const tagToUpdate = {
      ...tag,
    } as const satisfies InsertTagModel;
    const updatedTag = {
      ...tagToUpdate,
      name: 'Housing',
    } as const satisfies InsertTagModel;

    await pom.goto();
    await populateDb(page, [tagToUpdate]);

    await pom.manageTagsButton.click();
    await pom.editTagButton(tagToUpdate).click();
    await pom.fillTagForm(updatedTag);
    await pom.updateTagButton.click();

    await expect(pom.tag(tagToUpdate)).not.toBeVisible();
    await expect(pom.tag(updatedTag)).toBeVisible();
  });

  test('should delete tag', async ({ page }) => {
    const pom = new SubscriptionsPom(page);
    const tagToDelete = {
      ...tag,
    } as const satisfies TagModel;

    await pom.goto();
    await populateDb(page, [tagToDelete]);

    await pom.manageTagsButton.click();
    await pom.deleteTagButton(tagToDelete).click();

    await expect(pom.tag(tagToDelete)).not.toBeVisible();
  });
});

async function populateDb(page: Page, tags: Array<TagModel>): Promise<void> {
  await page.evaluate(async (tags) => {
    await window.Dexie.transaction('rw', window.Dexie.tags, async () => {
      await Promise.all(tags.map((tag) => window.Dexie.tags.put(tag)));
    });
  }, tags);
}

// TODO find a place to define global types for test files
declare global {
  interface Window {
    Dexie: typeof db;
  }
}
