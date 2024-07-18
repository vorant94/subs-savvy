import { type Page, expect, test } from "@playwright/test";
import { categoryMock } from "../src/categories/models/category.mock.ts";
import type {
	CategoryModel,
	InsertCategoryModel,
} from "../src/categories/models/category.model.ts";
import { SubscriptionsPom } from "../src/subscriptions/pages/subscriptions.pom.ts";

test.describe("categories", () => {
	test("should find categories", async ({ page }) => {
		const pom = new SubscriptionsPom(page);
		const categories = [categoryMock];

		await pom.goto();
		await populateDb(page, categories);

		await pom.categorySelect.manageButton.click();

		for (const category of categories) {
			await expect(pom.categorySelect.category(category)).toBeVisible();
		}
	});

	test("should insert category", async ({ page }) => {
		const pom = new SubscriptionsPom(page);
		const categoryToCreate = {
			...categoryMock,
		} as const satisfies InsertCategoryModel;

		await pom.goto();

		await pom.categorySelect.manageButton.click();
		await pom.categorySelect.addButton.click();
		await pom.categorySelect.form.fill(categoryToCreate);
		await pom.categorySelect.insertButton.click();

		await expect(pom.categorySelect.category(categoryToCreate)).toBeVisible();
	});

	test("should update category", async ({ page }) => {
		const pom = new SubscriptionsPom(page);
		const categoryToUpdate = {
			...categoryMock,
		} as const satisfies InsertCategoryModel;
		const updatedCategory = {
			...categoryToUpdate,
			name: "Housing",
		} as const satisfies InsertCategoryModel;

		await pom.goto();
		await populateDb(page, [categoryToUpdate]);

		await pom.categorySelect.manageButton.click();
		await pom.categorySelect.editButton(categoryToUpdate).click();
		await pom.categorySelect.form.fill(updatedCategory);
		await pom.categorySelect.updateButton.click();

		await expect(
			pom.categorySelect.category(categoryToUpdate),
		).not.toBeVisible();
		await expect(pom.categorySelect.category(updatedCategory)).toBeVisible();
	});

	test("should delete category", async ({ page }) => {
		const pom = new SubscriptionsPom(page);
		const categoryToDelete = {
			...categoryMock,
		} as const satisfies CategoryModel;

		await pom.goto();
		await populateDb(page, [categoryToDelete]);

		await pom.categorySelect.manageButton.click();
		await pom.categorySelect.deleteButton(categoryToDelete).click();

		await expect(
			pom.categorySelect.category(categoryToDelete),
		).not.toBeVisible();
	});
});

async function populateDb(
	page: Page,
	categories: Array<CategoryModel>,
): Promise<void> {
	await page.evaluate(async (categories) => {
		await window.db.transaction("rw", window.db.categories, async () => {
			await Promise.all(
				categories.map((category) => window.db.categories.put(category)),
			);
		});
	}, categories);
}
