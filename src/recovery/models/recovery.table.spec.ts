import { afterEach, describe, expect, it } from "vitest";
import { categoryMock } from "../../categories/models/category.mock.ts";
import type { CategoryModel } from "../../categories/models/category.model.ts";
import { db } from "../../db/globals/db.ts";
import type { RawSubscriptionModel } from "../../db/models/raw-subscription.model.ts";
import { cleanUpDb } from "../../db/utils/clean-up-db.ts";
import {
	monthlySubscription,
	yearlySubscription,
} from "../../subscriptions/models/subscription.mock.ts";
import type { SubscriptionModel } from "../../subscriptions/models/subscription.model.ts";
import { upsertCategoriesAndSubscriptions } from "./recovery.table.ts";

describe("recovery.table", () => {
	afterEach(async () => await cleanUpDb());

	it("should upsert categories and subscriptions", async () => {
		const categories = [categoryMock] satisfies Array<CategoryModel>;
		const subscriptions = [
			monthlySubscription,
			yearlySubscription,
		] satisfies Array<SubscriptionModel>;

		await upsertCategoriesAndSubscriptions(categories, subscriptions);

		const rawSubscriptions = subscriptions.map(
			({ category, ...subscription }) => ({
				...subscription,
				categoryId: category?.id ?? null,
			}),
		) satisfies Array<RawSubscriptionModel>;

		expect(await db.categories.toArray()).toEqual(categories);
		expect(await db.subscriptions.toArray()).toEqual(rawSubscriptions);
	});
});
