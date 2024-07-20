import { Card, Title } from "@mantine/core";
import dayjs from "dayjs";
import { memo, useMemo } from "react";
import {
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
} from "recharts";
import type { CategoryModel } from "../../categories/models/category.model.ts";
import { roundToDecimal } from "../../math/utils/round-to-decimal.ts";
import { useSubscriptions } from "../../subscriptions/hooks/use-subscriptions.tsx";
import type { SubscriptionModel } from "../../subscriptions/models/subscription.model.ts";
import { calculateSubscriptionPriceForYear } from "../../subscriptions/utils/calculate-subscription-price-for-year.ts";
import { compareSubscriptionsDesc } from "../../subscriptions/utils/compare-subscriptions.ts";
import { cn } from "../../ui/utils/cn.ts";

export const ExpensesByCategory = memo(() => {
	const { subscriptions } = useSubscriptions();

	const aggregatedSubscriptions = useMemo(
		() => aggregateSubscriptionsByCategory(subscriptions),
		[subscriptions],
	);

	return (
		<Card
			className={cn("flex h-full flex-col gap-2")}
			shadow="xs"
			padding="xs"
			radius="md"
			withBorder
		>
			<Title
				className={cn("self-center")}
				order={5}
			>
				Expenses by Category
			</Title>

			<ResponsiveContainer
				width="100%"
				height="100%"
			>
				<PieChart>
					<CartesianGrid strokeDasharray="3 3" />

					<Pie
						data={aggregatedSubscriptions}
						dataKey="totalExpenses"
						label
					>
						{aggregatedSubscriptions.map((subByCategory) => (
							<Cell
								key={subByCategory.category.id}
								fill={subByCategory.category.color}
							/>
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</Card>
	);
});

interface SubscriptionsAggregatedByCategory {
	category: CategoryModel;
	totalExpenses: number;
	subscriptions: Array<SubscriptionModel>;
}

const startOfYear = dayjs(new Date()).startOf("year").toDate();
const noCategoryPlaceholder = {
	id: -1,
	name: "No Category",
	color: "#777777",
} satisfies CategoryModel;

function aggregateSubscriptionsByCategory(
	subscriptions: ReadonlyArray<SubscriptionModel>,
): Array<SubscriptionsAggregatedByCategory> {
	const subscriptionsByCategory: Array<SubscriptionsAggregatedByCategory> = [];

	for (const subscription of subscriptions) {
		const priceThisYear = calculateSubscriptionPriceForYear(
			subscription,
			startOfYear,
		);
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
				subscriptions: [subscription],
			});
			continue;
		}

		subByCategory.totalExpenses += priceThisYear;
		subByCategory.subscriptions.push(subscription);
	}

	for (const subsByCategory of subscriptionsByCategory) {
		subsByCategory.subscriptions.sort(compareSubscriptionsDesc);
		subsByCategory.totalExpenses = roundToDecimal(subsByCategory.totalExpenses);
	}

	return subscriptionsByCategory;
}
