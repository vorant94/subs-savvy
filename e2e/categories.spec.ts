import { expect, test, type Page } from '@playwright/test';
import { categoryMock } from '../src/categories/models/category.mock.ts';
import type {
  CategoryModel,
  InsertCategoryModel,
} from '../src/categories/models/category.model.ts';
import { SubscriptionsPom } from '../src/subscriptions/pages/subscriptions.pom.ts';

test.describe('categories', () => {
  test('should find categories', async ({ page }) => {
    const pom = new SubscriptionsPom(page);
    const categories = [categoryMock];

    await pom.goto();
    await populateDb(page, categories);

    await pom.manageCategoriesButton.click();

    for (const category of categories) {
      await expect(pom.category(category)).toBeVisible();
    }
  });

  test('should insert category', async ({ page }) => {
    const pom = new SubscriptionsPom(page);
    const categoryToCreate = {
      ...categoryMock,
    } as const satisfies InsertCategoryModel;

    await pom.goto();

    await pom.manageCategoriesButton.click();
    await pom.addCategoryButton.click();
    await pom.fillCategoryForm(categoryToCreate);
    await pom.insertCategoryButton.click();

    await expect(pom.category(categoryToCreate)).toBeVisible();
  });

  test('should update category', async ({ page }) => {
    const pom = new SubscriptionsPom(page);
    const categoryToUpdate = {
      ...categoryMock,
    } as const satisfies InsertCategoryModel;
    const updatedCategory = {
      ...categoryToUpdate,
      name: 'Housing',
    } as const satisfies InsertCategoryModel;

    await pom.goto();
    await populateDb(page, [categoryToUpdate]);

    await pom.manageCategoriesButton.click();
    await pom.editCategoryButton(categoryToUpdate).click();
    await pom.fillCategoryForm(updatedCategory);
    await pom.updateCategoryButton.click();

    await expect(pom.category(categoryToUpdate)).not.toBeVisible();
    await expect(pom.category(updatedCategory)).toBeVisible();
  });

  test('should delete category', async ({ page }) => {
    const pom = new SubscriptionsPom(page);
    const categoryToDelete = {
      ...categoryMock,
    } as const satisfies CategoryModel;

    await pom.goto();
    await populateDb(page, [categoryToDelete]);

    await pom.manageCategoriesButton.click();
    await pom.deleteCategoryButton(categoryToDelete).click();

    await expect(pom.category(categoryToDelete)).not.toBeVisible();
  });
});

async function populateDb(
  page: Page,
  categories: Array<CategoryModel>,
): Promise<void> {
  await page.evaluate(async (categories) => {
    await window.Dexie.transaction('rw', window.Dexie.categories, async () => {
      await Promise.all(
        categories.map((category) => window.Dexie.categories.put(category)),
      );
    });
  }, categories);
}
