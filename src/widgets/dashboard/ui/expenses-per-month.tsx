import { ActionIcon, Card, Divider, Text, Title } from "@mantine/core";
import {
	IconChevronLeft,
	IconChevronRight,
	IconCircleFilled,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Bar,
	BarChart,
	Legend,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";
import {
	type SubscriptionsAggregatedByCategory,
	aggregateSubscriptionsByCategory,
	noCategoryPlaceholder,
} from "../../../entities/subscription/lib/aggregate-subscriptions-by-category.ts";
import { calculateSubscriptionPriceForMonth } from "../../../entities/subscription/lib/calculate-subscription-price-for-month.ts";
import { useSubscriptions } from "../../../entities/subscription/model/subscriptions.store.tsx";
import { useCurrencyFormatter } from "../../../features/i18n/model/use-currency-formatter.ts";
import { usePercentageFormatter } from "../../../features/i18n/model/use-percentage-formatter.ts";
import type { CategoryModel } from "../../../shared/api/category.model.ts";
import { startOfMonth } from "../../../shared/lib/dates.ts";
import { cn } from "../../../shared/ui/cn.ts";
import { Icon } from "../../../shared/ui/icon.tsx";
import { useBreakpoint } from "../../../shared/ui/use-breakpoint.tsx";

export const ExpensesPerMonth = memo(() => {
	const [monthDate, setMonthDate] = useState(startOfMonth);
	// TODO translate via dayjs locale once we have more than english
	const monthName = useMemo(() => dayjs(monthDate).format("MMMM"), [monthDate]);
	const goPreviousMonth = useCallback(
		() => setMonthDate(dayjs(monthDate).subtract(1, "month").toDate()),
		[monthDate],
	);
	const goNextMonth = useCallback(
		() => setMonthDate(dayjs(monthDate).add(1, "month").toDate()),
		[monthDate],
	);

	const subscriptions = useSubscriptions();
	const aggregatedByCategory = useMemo(() => {
		return aggregateSubscriptionsByCategory(subscriptions, (subscription) =>
			calculateSubscriptionPriceForMonth(subscription, monthDate),
		);
	}, [subscriptions, monthDate]);
	const aggregatedByCategoryPerMonth = useMemo(() => {
		return aggregatedByCategory.reduce<SubscriptionsAggregatedByCategoryPerMonth>(
			(prev, curr) => {
				prev[curr.category.id] = curr;
				return prev;
			},
			{},
		);
	}, [aggregatedByCategory]);

	const calculateRadius: (index: number) => [number, number, number, number] =
		useCallback(
			(index) => {
				return [
					index === 0 ? 4 : 0,
					index === aggregatedByCategory.length - 1 ? 4 : 0,
					index === aggregatedByCategory.length - 1 ? 4 : 0,
					index === 0 ? 4 : 0,
				];
			},
			[aggregatedByCategory],
		);

	const totalExpenses = useMemo(
		() =>
			aggregatedByCategory.reduce(
				(prev, { totalExpenses }) => prev + totalExpenses,
				0,
			),
		[aggregatedByCategory],
	);
	const subscriptionsAmount = useMemo(() => {
		return aggregatedByCategory.reduce(
			(prev, { subscriptions }) => prev + subscriptions.length,
			0,
		);
	}, [aggregatedByCategory]);

	const { t } = useTranslation();

	const currencyFormatter = useCurrencyFormatter();

	const isMd = useBreakpoint("md");

	return (
		<Card className={cn("flex shrink-0 flex-col gap-4 md:gap-8")}>
			<div className={cn("flex items-center")}>
				<Text
					className={cn("font-medium")}
					size="xs"
					c="dimmed"
				>
					{t("expenses-in")}
				</Text>

				<ActionIcon
					variant="transparent"
					aria-label={t("previous-month")}
					onClick={goPreviousMonth}
				>
					<Icon
						icon={IconChevronLeft}
						size="1.5em"
					/>
				</ActionIcon>
				<Title order={5}>{monthName}</Title>
				<ActionIcon
					variant="transparent"
					aria-label={t("next-month")}
					onClick={goNextMonth}
				>
					<Icon
						icon={IconChevronRight}
						size="1.5em"
					/>
				</ActionIcon>
			</div>

			<div
				className={cn(
					"flex flex-col gap-4 md:flex-row md:items-center md:gap-8",
				)}
			>
				<div className={cn("flex flex-col gap-2 md:gap-4")}>
					<Title order={2}>{currencyFormatter.format(totalExpenses)}</Title>
					<Text
						size="xs"
						c="dimmed"
					>
						{t("subs-amount", {
							amount: subscriptionsAmount,
						})}
					</Text>
				</div>

				<Divider orientation={isMd ? "vertical" : "horizontal"} />

				<ResponsiveContainer
					width={"100%"}
					height={100}
				>
					<BarChart
						layout="vertical"
						data={[aggregatedByCategoryPerMonth]}
					>
						<YAxis
							hide
							type="category"
						/>
						<XAxis
							domain={["dataMin", "dataMax"]}
							hide
							type="number"
						/>
						{aggregatedByCategory.map(({ category }, index) => (
							<Bar
								radius={calculateRadius(index)}
								name={
									category.id === -1
										? t(noCategoryPlaceholder.name)
										: category.name
								}
								key={category.id}
								dataKey={`${category.id}.totalExpenses`}
								stackId={monthName}
								fill={category.color}
							/>
						))}
						<Legend
							iconType="circle"
							align="left"
							content={
								<LegendContent
									aggregatedSubscriptions={aggregatedByCategory}
									totalExpenses={totalExpenses}
								/>
							}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</Card>
	);
});

type SubscriptionsAggregatedByCategoryPerMonth = Record<
	CategoryModel["id"],
	SubscriptionsAggregatedByCategory
>;

const LegendContent = memo(
	({ aggregatedSubscriptions, totalExpenses }: LegendContentPros) => {
		const { t } = useTranslation();

		const percentageFormatter = usePercentageFormatter();

		return (
			<ul className={cn("mt-2 flex items-center gap-6 overflow-auto")}>
				{aggregatedSubscriptions.map((c) => (
					<li
						key={c.category.id}
						className={cn("flex items-center")}
					>
						<Icon
							icon={IconCircleFilled}
							color={c.category.color}
							className={cn("mr-2")}
							size="0.5em"
						/>
						<Text
							size="xs"
							className={cn("whitespace-nowrap")}
						>
							{c.category.id === -1
								? t(noCategoryPlaceholder.name)
								: c.category.name}
						</Text>
						&nbsp;
						<Text
							c="dimmed"
							size="xs"
						>
							•
						</Text>
						&nbsp;
						<Text
							size="xs"
							c="dimmed"
						>
							{percentageFormatter.format(c.totalExpenses / totalExpenses)}
						</Text>
					</li>
				))}
			</ul>
		);
	},
);

interface LegendContentPros {
	aggregatedSubscriptions: Array<SubscriptionsAggregatedByCategory>;
	totalExpenses: number;
}
