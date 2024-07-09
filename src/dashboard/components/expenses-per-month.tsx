import type { MonthName } from '@/date/types/month-name.ts';
import { monthToMonthName, months } from '@/date/types/month.ts';
import { roundToDecimal } from '@/math/utils/round-to-decimal.ts';
import { useSubscriptions } from '@/subscriptions/hooks/use-subscriptions.tsx';
import type { SubscriptionModel } from '@/subscriptions/models/subscription.model.ts';
import { calculateSubscriptionPriceForMonth } from '@/subscriptions/utils/calculate-subscription-price-for-month.ts';
import { compareSubscriptionsDesc } from '@/subscriptions/utils/compare-subscriptions.ts';
import { cn } from '@/ui/utils/cn.ts';
import { Card, Divider, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { Fragment, memo, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import type { TooltipProps } from 'recharts/types/component/Tooltip';

export const ExpensesPerMonth = memo(() => {
  const { subscriptions } = useSubscriptions();

  const aggregatedSubscriptions = useMemo(
    () => aggregateSubscriptionsByMonth(subscriptions),
    [subscriptions],
  );

  return (
    <Card
      className={cn(`flex h-full flex-col gap-2`)}
      shadow="xs"
      padding="xs"
      radius="md"
      withBorder>
      <Title
        className={cn(`self-center`)}
        order={5}>
        Expenses per Month
      </Title>

      <ResponsiveContainer
        width="100%"
        height="100%">
        <BarChart data={aggregatedSubscriptions}>
          <CartesianGrid strokeDasharray="3 3" />
          <Bar
            name="Expences per Month"
            dataKey="totalExpenses"
            fill="#8884d8"
          />
          <XAxis dataKey="month" />
          <Tooltip content={<TooltipContent />} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
});

interface SubscriptionsAggregatedByMonth {
  month: MonthName;
  totalExpenses: number;
  subscriptions: Array<SubscriptionModel>;
}

const subscriptionsByMonthInitial: Array<SubscriptionsAggregatedByMonth> =
  months.map((month) => ({
    totalExpenses: 0,
    month: monthToMonthName[month],
    subscriptions: [],
  }));
const startOfYear = dayjs(new Date()).startOf('year').toDate();

function aggregateSubscriptionsByMonth(
  subscriptions: Array<SubscriptionModel>,
): Array<SubscriptionsAggregatedByMonth> {
  const subscriptionsByMonth = structuredClone(subscriptionsByMonthInitial);

  for (const subscription of subscriptions) {
    for (const month of months) {
      const priceThisMonth = calculateSubscriptionPriceForMonth(
        subscription,
        dayjs(startOfYear).set('month', month).toDate(),
      );
      if (priceThisMonth === 0) {
        continue;
      }

      subscriptionsByMonth[month]!.totalExpenses += priceThisMonth;
      subscriptionsByMonth[month]!.subscriptions.push(subscription);
    }
  }

  for (const subsByMonth of subscriptionsByMonth) {
    subsByMonth.subscriptions.sort(compareSubscriptionsDesc);
    subsByMonth.totalExpenses = roundToDecimal(subsByMonth.totalExpenses);
  }

  return subscriptionsByMonth;
}

const TooltipContent = memo(({ payload }: TooltipProps<number, string>) => {
  const value = payload?.[0]?.value;
  const subscriptions = (
    payload?.[0]?.payload as SubscriptionsAggregatedByMonth
  )?.subscriptions;

  if ((!value && value !== 0) || !subscriptions) {
    return <></>;
  }

  return (
    <Card
      shadow="xs"
      padding="xs"
      radius="md"
      withBorder
      className={cn(`flex flex-col gap-2`)}>
      <div className={cn(`grid grid-cols-2 gap-1`)}>
        <Text size="sm">Total:</Text>
        <Text
          className={cn(`justify-self-end`)}
          size="sm">
          {value}
        </Text>
      </div>
      <Divider />
      <div className={cn(`grid grid-cols-2 gap-1`)}>
        {subscriptions.map((subscription) => (
          <Fragment key={subscription.id}>
            <Text
              size="xs"
              c="dimmed">
              {subscription.name}
            </Text>
            <Text
              className={cn(`justify-self-end`)}
              size="xs"
              c="dimmed">
              {subscription.price}
            </Text>
          </Fragment>
        ))}
      </div>
    </Card>
  );
});
