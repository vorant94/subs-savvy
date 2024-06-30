import type { MonthName } from '@/date/types/month-name.ts';
import { monthToMonthName, months } from '@/date/types/month.ts';
import { cn } from '@/ui/utils/cn.ts';
import { Card, Divider, Text, Title } from '@mantine/core';
import { Fragment, memo, useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import type { TooltipProps } from 'recharts/types/component/Tooltip';
import { useSubscriptions } from '../hooks/use-subscriptions.tsx';
import type { SubscriptionModel } from '../models/subscription.model.ts';
import { cyclePeriodToCalculateMonthlyPrice } from '../utils/cycle-period-to-calculate-monthly-price.ts';

// TODO color bars based on subscription tag color
//  if sub has one tag - take it's color
//  if sub has no tags - use "default"
//  if sub has multiple - use "rainbow"
//  if sub has two tags and one of them is selected - use color of the second one
export const SubscriptionsByMonthChart = memo(() => {
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

function aggregateSubscriptionsByMonth(
  subscriptions: Array<SubscriptionModel>,
): Array<SubscriptionsAggregatedByMonth> {
  const subscriptionsByMonth: Array<SubscriptionsAggregatedByMonth> =
    months.map((month) => ({
      totalExpenses: 0,
      month: monthToMonthName[month],
      subscriptions: [],
    }));

  for (const subscription of subscriptions) {
    for (const month of months) {
      const calculateMonthlyPrice =
        cyclePeriodToCalculateMonthlyPrice[subscription.cycle.period];

      const priceThisMonth = calculateMonthlyPrice(subscription, month);
      if (priceThisMonth === 0) {
        continue;
      }

      subscriptionsByMonth[month]!.totalExpenses += priceThisMonth;
      subscriptionsByMonth[month]!.subscriptions.push(subscription);
    }
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
