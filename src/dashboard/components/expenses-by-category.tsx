import { Card, Title } from "@mantine/core";
import { memo, useMemo } from "react";
import {
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import type { CategoryModel } from "../../categories/models/category.model.ts";
import { startOfYear } from "../../date/globals/start-of-year.ts";
import { roundToDecimal } from "../../math/utils/round-to-decimal.ts";
import { useSubscriptions } from "../../subscriptions/hooks/use-subscriptions.tsx";
import type { SubscriptionModel } from "../../subscriptions/models/subscription.model.ts";
import { calculateSubscriptionPriceForYear } from "../../subscriptions/utils/calculate-subscription-price-for-year.ts";
import { compareSubscriptionsDesc } from "../../subscriptions/utils/compare-subscriptions.ts";
import { cn } from "../../ui/utils/cn.ts";
import {
	ChartTooltipContent,
	type ChartTooltipContentPayload,
} from "./chart-tooltip-content.tsx";

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
				className={cn("flex flex-1 basis-0 flex-col overflow-y-auto")}
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
					<Tooltip content={<ChartTooltipContent />} />
				</PieChart>
			</ResponsiveContainer>
		</Card>
	);
});

interface SubscriptionsAggregatedByCategory extends ChartTooltipContentPayload {
	category: CategoryModel;
}

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

	return subscriptionsByCategory;
}
