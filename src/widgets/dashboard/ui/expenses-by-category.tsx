import { Card, Divider, Text } from "@mantine/core";
import { IconCircleFilled } from "@tabler/icons-react";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cell, Label, type LabelProps, Pie, PieChart } from "recharts";
import type { PolarViewBox } from "recharts/types/util/types";
import {
	type SubscriptionsAggregatedByCategory,
	aggregateSubscriptionsByCategory,
	noCategoryPlaceholder,
} from "../../../entities/subscription/lib/aggregate-subscriptions-by-category.ts";
import { calculateSubscriptionPriceForYear } from "../../../entities/subscription/lib/calculate-subscription-price-for-year.ts";
import { useSubscriptions } from "../../../entities/subscription/model/subscriptions.store.tsx";
import { useCurrencyFormatter } from "../../../features/i18n/model/use-currency-formatter.ts";
import { startOfYear } from "../../../shared/lib/start-of-year.ts";
import { cn } from "../../../shared/ui/cn.ts";
import { Icon } from "../../../shared/ui/icon.tsx";

export const ExpensesByCategory = memo(() => {
	const subscriptions = useSubscriptions();
	const aggregatedSubscriptions = useMemo(() => {
		return aggregateSubscriptionsByCategory(subscriptions, (subscription) =>
			calculateSubscriptionPriceForYear(subscription, startOfYear),
		);
	}, [subscriptions]);

	const [activeIndex, setActiveIndex] = useState<number>(-1);
	const updateActiveIndex = useCallback((_: unknown, index: number) => {
		setActiveIndex(index);
	}, []);
	const resetActiveIndex = useCallback(() => {
		setActiveIndex(-1);
	}, []);

	const { t } = useTranslation();

	const currencyFormatter = useCurrencyFormatter();

	return (
		<div className={cn("flex shrink-0 flex-col gap-4")}>
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
						width={180}
						height={180}
					>
						<Pie
							innerRadius={70}
							outerRadius={90}
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
								<Icon
									icon={IconCircleFilled}
									color={category.color}
									size="0.5em"
								/>
								<Text
									size="xs"
									className={cn("flex-1")}
								>
									{category.id === -1
										? t(noCategoryPlaceholder.name)
										: category.name}
								</Text>
								<Text size="xs">{currencyFormatter.format(totalExpenses)}</Text>
							</li>
						))}
					</ul>
				</div>
			</Card>
		</div>
	);
});

// TODO rewrite with foreignObject
const LabelContent = ({
	viewBox,
	aggregatedSubscriptions,
	activeIndex,
}: LabelContentPros) => {
	const { cx, cy } = viewBox as PolarViewBox;

	const totalExpenses = useMemo(
		() =>
			aggregatedSubscriptions.reduce(
				(prev, { totalExpenses }) => prev + totalExpenses,
				0,
			),
		[aggregatedSubscriptions],
	);

	const { t } = useTranslation();

	const currencyFormatter = useCurrencyFormatter();

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
						: (aggregatedSubscriptions[activeIndex]?.category.name ??
							t("total"))}
				</tspan>
			</text>
			<text
				x={cx}
				y={(cy ?? 0) + 10}
				textAnchor="middle"
				dominantBaseline="central"
			>
				<tspan>
					{currencyFormatter.format(
						aggregatedSubscriptions[activeIndex]?.totalExpenses ??
							totalExpenses,
					)}
				</tspan>
			</text>
		</>
	);
};

interface LabelContentPros extends LabelProps {
	activeIndex: number;
	aggregatedSubscriptions: Array<SubscriptionsAggregatedByCategory>;
}
