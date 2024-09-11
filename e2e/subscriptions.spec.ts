import { type Page, expect, test } from "@playwright/test";
import dayjs from "dayjs";
import type { CategoryModel } from "../src/categories/models/category.model.ts";
import { categoryStub } from "../src/categories/models/category.stub.ts";
import type {
	InsertSubscriptionModel,
	SubscriptionModel,
	UpdateSubscriptionModel,
} from "../src/subscriptions/models/subscription.model.ts";
import {
	monthlySubscription,
	yearlySubscription,
} from "../src/subscriptions/models/subscription.stub.ts";
import { SubscriptionsPom } from "../src/subscriptions/pages/subscriptions.pom.ts";

test.describe("subscriptions", () => {
	test("should find subscriptions", async ({ page }) => {
		const pom = new SubscriptionsPom(page);
		const subscriptions = [
			monthlySubscription,
			yearlySubscription,
		] satisfies ReadonlyArray<SubscriptionModel>;

		await pom.goto();
		await populateDb(page, subscriptions);

		for (const subscription of subscriptions) {
			await expect(pom.subscriptionListItem(subscription)).toBeVisible();
		}
	});

	test("should filter subscriptions on name prefix", async ({ page }) => {
		const pom = new SubscriptionsPom(page);
		const subscriptions = [
			monthlySubscription,
			yearlySubscription,
		] satisfies ReadonlyArray<SubscriptionModel>;

		await pom.goto();
		await populateDb(page, subscriptions);

		await pom.namePrefixControl.fill("te");

		await expect(
			pom.subscriptionListItem(monthlySubscription),
		).not.toBeVisible();
		await expect(pom.subscriptionListItem(yearlySubscription)).toBeVisible();

		await pom.clearNamePrefixButton.click();
		for (const subscription of subscriptions) {
			await expect(pom.subscriptionListItem(subscription)).toBeVisible();
		}
	});

	test("should insert subscription", async ({ page }) => {
		const pom = new SubscriptionsPom(page);
		const subscriptionToCreate = {
			...monthlySubscription,
			description: "Basic Plan",
			endedAt: dayjs(monthlySubscription.startedAt).add(1, "year").toDate(),
		} as const satisfies InsertSubscriptionModel;

		await pom.goto();
		await populateDb(page, [], [categoryStub]);

		await pom.addSubscriptionButton.click();
		await pom.subscriptionUpsert.fill(subscriptionToCreate);
		await pom.subscriptionUpsert.insertButton.click();

		await expect(pom.subscriptionListItem(subscriptionToCreate)).toBeVisible();
	});

	test("should update subscription", async ({ page }) => {
		const pom = new SubscriptionsPom(page);
		const subscriptionToUpdate = {
			...monthlySubscription,
		} as const satisfies SubscriptionModel;
		const updatedSubscription = {
			...monthlySubscription,
			name: "YouTube",
		} as const satisfies UpdateSubscriptionModel;

		await pom.goto();
		await populateDb(page, [subscriptionToUpdate]);

		await pom.subscriptionListItem(subscriptionToUpdate).click();
		await pom.subscriptionUpsert.fill(updatedSubscription);
		await pom.subscriptionUpsert.updateButton.click();

		await expect(
			pom.subscriptionListItem(subscriptionToUpdate),
		).not.toBeVisible();
		await expect(pom.subscriptionListItem(updatedSubscription)).toBeVisible();
	});

	test("should delete subscription", async ({ page }) => {
		const pom = new SubscriptionsPom(page);
		const subscriptionToDelete = {
			...monthlySubscription,
		} as const satisfies SubscriptionModel;

		await pom.goto();
		await populateDb(page, [subscriptionToDelete]);

		await pom.subscriptionListItem(subscriptionToDelete).click();
		await pom.subscriptionUpsert.deleteButton.click();

		await expect(
			pom.subscriptionListItem(subscriptionToDelete),
		).not.toBeVisible();
	});
});

async function populateDb(
	page: Page,
	subscriptions: ReadonlyArray<SubscriptionModel> = [],
	categories: ReadonlyArray<CategoryModel> = [],
): Promise<void> {
	await page.evaluate(
		async ([subscriptions, categories]) => {
			await window.db.transaction(
				"rw",
				window.db.subscriptions,
				window.db.categories,
				async () => {
					const subscriptionPuts: Array<Promise<unknown>> = [];
					const categoryPuts: Array<Promise<unknown>> = [];

					for (const { category, ...subscription } of subscriptions) {
						subscriptionPuts.push(
							window.db.subscriptions.put({
								...subscription,
								categoryId: category?.id,
							}),
						);

						if (category) {
							categoryPuts.push(window.db.categories.put(category));
						}
					}

					for (const category of categories) {
						categoryPuts.push(window.db.categories.put(category));
					}

					await Promise.all([...subscriptionPuts, ...categoryPuts]);
				},
			);
		},
		[subscriptions, categories] as const,
	);
}
