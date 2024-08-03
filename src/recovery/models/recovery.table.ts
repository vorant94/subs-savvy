import type { CategoryModel } from "../../categories/models/category.model.ts";
import { CategoryNotFound } from "../../categories/models/category.table.ts";
import { db } from "../../db/globals/db.ts";
import type { SubscriptionModel } from "../../subscriptions/models/subscription.model.ts";

export function upsertCategoriesAndSubscriptions(
	categories: Array<CategoryModel>,
	subscriptions: Array<SubscriptionModel>,
): Promise<void> {
	return db.transaction("rw", db.subscriptions, db.categories, async () => {
		const categoryPuts = categories.map((category) =>
			db.categories.put(category),
		);

		const categoryIds = new Set(categories.map(({ id }) => id));
		const subscriptionPuts = subscriptions.map(
			({ category, ...subscription }) => {
				if (category && !categoryIds.has(category.id)) {
					throw new CategoryNotFound(category.id);
				}

				return db.subscriptions.put({
					...subscription,
					categoryId: category?.id ?? null,
				});
			},
		);

		await Promise.all([...categoryPuts, ...subscriptionPuts]);
	});
}
