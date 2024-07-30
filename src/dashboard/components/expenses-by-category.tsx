import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Divider, Text } from "@mantine/core";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cell, Label, type LabelProps, Pie, PieChart } from "recharts";
import type { PolarViewBox } from "recharts/types/util/types";
import type { CategoryModel } from "../../categories/models/category.model.ts";
import { startOfYear } from "../../date/globals/start-of-year.ts";
import { roundToDecimal } from "../../math/utils/round-to-decimal.ts";
import { useSubscriptions } from "../../subscriptions/hooks/use-subscriptions.tsx";
import type { SubscriptionModel } from "../../subscriptions/models/subscription.model.ts";
import { calculateSubscriptionPriceForYear } from "../../subscriptions/utils/calculate-subscription-price-for-year.ts";
import { compareSubscriptionsDesc } from "../../subscriptions/utils/compare-subscriptions.ts";
import { cn } from "../../ui/utils/cn.ts";
import type { ChartTooltipContentPayload } from "./chart-tooltip-content.tsx";

export const ExpensesByCategory = memo(() => {
	const { subscriptions } = useSubscriptions();
	const aggregatedSubscriptions = useMemo(
		() => aggregateSubscriptionsByCategory(subscriptions),
		[subscriptions],
	);

	const [activeIndex, setActiveIndex] = useState<number>(-1);
	const updateActiveIndex = useCallback((_: unknown, index: number) => {
		setActiveIndex(index);
	}, []);
	const resetActiveIndex = useCallback(() => {
		setActiveIndex(-1);
	}, []);

	const { t } = useTranslation();

	return (
		<div className={cn("flex flex-col gap-4")}>
			<Text
				className={cn("font-medium")}
				size="sm"
				c="dimmed"
			>
				{t("expenses-by-category")}
			</Text>

			<Card
				padding="lg"
				radius="md"
			>
				<div className={cn("flex h-[177px] flex-row items-center gap-8")}>
					<PieChart
						width={177}
						height={177}
					>
						<Pie
							innerRadius={66}
							outerRadius={88}
							data={aggregatedSubscriptions}
							dataKey="totalExpenses"
							onMouseEnter={updateActiveIndex}
							onMouseLeave={resetActiveIndex}
							activeIndex={activeIndex}
						>
							{aggregatedSubscriptions.map((subByCategory) => (
								<Cell
									key={subByCategory.category.id}
									fill={subByCategory.category.color}
								/>
							))}
							<Label
								content={(props) => (
									<LabelContent
										aggregatedSubscriptions={aggregatedSubscriptions}
										activeIndex={activeIndex}
										{...props}
									/>
								)}
							/>
						</Pie>
					</PieChart>

					<Divider orientation="vertical" />

					<ul className={cn("flex max-h-full flex-col gap-4 overflow-y-auto")}>
						{aggregatedSubscriptions.map(({ category, totalExpenses }) => (
							<li
								className={cn("flex items-center gap-2")}
								key={category.id}
							>
								<FontAwesomeIcon
									size="xs"
									color={category.color}
									icon={faCircle}
								/>
								<Text
									size="xs"
									className={cn("flex-1")}
								>
									{category.id === -1
										? t(noCategoryPlaceholder.name)
										: category.name}
								</Text>
								<Text size="xs">{totalExpenses}</Text>
							</li>
						))}
					</ul>
				</div>
			</Card>
		</div>
	);
});

interface SubscriptionsAggregatedByCategory extends ChartTooltipContentPayload {
	category: CategoryModel;
}

const noCategoryPlaceholder = {
	id: -1,
	name: "no-category",
	color: "#777777",
} as const satisfies CategoryModel;

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

const LabelContent = ({
	viewBox,
	aggregatedSubscriptions,
	activeIndex,
}: LabelContentPros) => {
	const { cx, cy } = viewBox as PolarViewBox;

	const total = useMemo(
		() =>
			aggregatedSubscriptions.reduce(
				(prev, curr) => prev + curr.totalExpenses,
				0,
			),
		[aggregatedSubscriptions],
	);

	const { t } = useTranslation();

	return (
		<>
			<text
				x={cx}
				y={(cy ?? 0) - 10}
				textAnchor="middle"
				dominantBaseline="central"
			>
				<tspan alignmentBaseline="middle">
					{aggregatedSubscriptions[activeIndex]?.category.id === -1
						? t(noCategoryPlaceholder.name)
						: aggregatedSubscriptions[activeIndex]?.category.name ?? t("total")}
				</tspan>
			</text>
			<text
				x={cx}
				y={(cy ?? 0) + 10}
				textAnchor="middle"
				dominantBaseline="central"
			>
				<tspan>
					{aggregatedSubscriptions[activeIndex]?.totalExpenses ?? total}
				</tspan>
			</text>
		</>
	);
};

interface LabelContentPros extends LabelProps {
	activeIndex: number;
	aggregatedSubscriptions: Array<SubscriptionsAggregatedByCategory>;
}
