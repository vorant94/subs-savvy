import {
	faChevronLeft,
	faChevronRight,
	faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Card, Divider, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, Legend, XAxis, YAxis } from "recharts";
import type { CategoryModel } from "../../categories/models/category.model.ts";
import { startOfMonth } from "../../date/globals/start-of-month.ts";
import { useCurrencyFormatter } from "../../i18n/hooks/use-currency-formatter.ts";
import { usePercentageFormatter } from "../../i18n/hooks/use-percentage-formatter.ts";
import { useSubscriptions } from "../../subscriptions/hooks/use-subscriptions.tsx";
import { calculateSubscriptionPriceForMonth } from "../../subscriptions/utils/calculate-subscription-price-for-month.ts";
import { cn } from "../../ui/utils/cn.ts";
import {
	type SubscriptionsAggregatedByCategory,
	aggregateSubscriptionsByCategory,
	noCategoryPlaceholder,
} from "../utils/aggregate-subscriptions-by-category.ts";

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

	const { subscriptions } = useSubscriptions();
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

	return (
		<Card
			className={cn("flex shrink-0 flex-col gap-6")}
			padding="lg"
			radius="md"
		>
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
					<FontAwesomeIcon icon={faChevronLeft} />
				</ActionIcon>
				<Title order={5}>{monthName}</Title>
				<ActionIcon
					variant="transparent"
					aria-label={t("next-month")}
					onClick={goNextMonth}
				>
					<FontAwesomeIcon icon={faChevronRight} />
				</ActionIcon>
			</div>

			<div className={cn("flex items-center gap-8")}>
				<div className={cn("flex flex-col gap-4")}>
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

				<Divider orientation="vertical" />

				<BarChart
					layout="vertical"
					width={700}
					height={100}
					data={[aggregatedByCategoryPerMonth]}
				>
					<YAxis
						hide
						type="category"
					/>
					<XAxis
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
			<ul className={cn("mt-2 flex items-center gap-6")}>
				{aggregatedSubscriptions.map((c) => (
					<li
						key={c.category.id}
						className={cn("flex items-center")}
					>
						<FontAwesomeIcon
							size="xs"
							color={c.category.color}
							icon={faCircle}
							className={cn("mr-2")}
						/>
						<Text size="xs">
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
