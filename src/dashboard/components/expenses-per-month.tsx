import { Card, Title } from "@mantine/core";
import dayjs from "dayjs";
import { memo, useMemo } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
} from "recharts";
import type { MonthName } from "../../date/types/month-name.ts";
import { monthToMonthName, months } from "../../date/types/month.ts";
import { roundToDecimal } from "../../math/utils/round-to-decimal.ts";
import { useSubscriptions } from "../../subscriptions/hooks/use-subscriptions.tsx";
import type { SubscriptionModel } from "../../subscriptions/models/subscription.model.ts";
import { calculateSubscriptionPriceForMonth } from "../../subscriptions/utils/calculate-subscription-price-for-month.ts";
import { compareSubscriptionsDesc } from "../../subscriptions/utils/compare-subscriptions.ts";
import { cn } from "../../ui/utils/cn.ts";
import { startOfYear } from "../globals/start-of-year.ts";
import {
	ChartTooltipContent,
	type ChartTooltipContentPayload,
} from "./chart-tooltip-content.tsx";

export const ExpensesPerMonth = memo(() => {
	const { subscriptions } = useSubscriptions();

	const aggregatedSubscriptions = useMemo(
		() => aggregateSubscriptionsByMonth(subscriptions),
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
				Expenses per Month
			</Title>

			<ResponsiveContainer
				width="100%"
				height="100%"
			>
				<BarChart data={aggregatedSubscriptions}>
					<CartesianGrid strokeDasharray="3 3" />
					<Bar
						name="Expences per Month"
						dataKey="totalExpenses"
						fill="#8884d8"
					/>
					<XAxis dataKey="month" />
					<Tooltip content={<ChartTooltipContent />} />
				</BarChart>
			</ResponsiveContainer>
		</Card>
	);
});

interface SubscriptionsAggregatedByMonth extends ChartTooltipContentPayload {
	month: MonthName;
}

function aggregateSubscriptionsByMonth(
	subscriptions: ReadonlyArray<SubscriptionModel>,
): Array<SubscriptionsAggregatedByMonth> {
	const subscriptionsByMonth: Array<SubscriptionsAggregatedByMonth> = [];

	for (const subscription of subscriptions) {
		for (const month of months) {
			const priceThisMonth = calculateSubscriptionPriceForMonth(
				subscription,
				dayjs(startOfYear).set("month", month).toDate(),
			);
			if (priceThisMonth === 0) {
				continue;
			}

			const subByMonth = subscriptionsByMonth[month];
			if (!subByMonth) {
				subscriptionsByMonth.push({
					totalExpenses: priceThisMonth,
					month: monthToMonthName[month],
					subscriptions: [
						{ ...subscription, price: roundToDecimal(priceThisMonth) },
					],
				});
				continue;
			}

			subByMonth.totalExpenses += priceThisMonth;
			subByMonth.subscriptions.push({
				...subscription,
				price: roundToDecimal(priceThisMonth),
			});
		}
	}

	for (const subsByMonth of subscriptionsByMonth) {
		subsByMonth.subscriptions.sort(compareSubscriptionsDesc);
		subsByMonth.totalExpenses = roundToDecimal(subsByMonth.totalExpenses);
	}

	return subscriptionsByMonth;
}
