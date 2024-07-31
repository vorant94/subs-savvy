import type { CategoryModel } from "../../categories/models/category.model.ts";
import { roundToDecimal } from "../../math/utils/round-to-decimal.ts";
import type { SubscriptionModel } from "../../subscriptions/models/subscription.model.ts";
import { compareSubscriptionsDesc } from "../../subscriptions/utils/compare-subscriptions.ts";

export function aggregateSubscriptionsByCategory(
	subscriptions: ReadonlyArray<SubscriptionModel>,
	calculateSubscriptionPrice: (subscription: SubscriptionModel) => number,
): Array<SubscriptionsAggregatedByCategory> {
	const subscriptionsByCategory: Array<SubscriptionsAggregatedByCategory> = [];

	for (const subscription of subscriptions) {
		const priceThisYear = calculateSubscriptionPrice(subscription);
		if (priceThisYear === 0) {
			continue;
		}

		const subByCategory = subscriptionsByCategory.find((agg) =>
			subscription?.category
				? agg.category.id === subscription.category.id
				: agg.category.id === noCategoryPlaceholder.id,
		);
		if (!subByCategory) {
			subscriptionsByCategory.push({
				category: subscription.category ?? noCategoryPlaceholder,
				totalExpenses: priceThisYear,
				subscriptions: [
					{ ...subscription, price: roundToDecimal(priceThisYear) },
				],
			});
			continue;
		}

		subByCategory.totalExpenses += priceThisYear;
		subByCategory.subscriptions.push({
			...subscription,
			price: roundToDecimal(priceThisYear),
		});
	}

	for (const subsByCategory of subscriptionsByCategory) {
		subsByCategory.subscriptions.sort(compareSubscriptionsDesc);
		subsByCategory.totalExpenses = roundToDecimal(subsByCategory.totalExpenses);
	}

	return subscriptionsByCategory.toSorted((a, b) =>
		a.totalExpenses < b.totalExpenses ? 1 : -1,
	);
}

export interface SubscriptionsAggregatedByCategory {
	totalExpenses: number;
	subscriptions: Array<SubscriptionModel>;
	category: CategoryModel;
}

export const noCategoryPlaceholder = {
	id: -1,
	name: "no-category",
	color: "#777777",
} as const satisfies CategoryModel;
