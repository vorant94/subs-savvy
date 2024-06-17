import {
  monthToMonthName,
  months,
  type MonthName,
} from '@/date/types/month.ts';
import { cn } from '@/ui/utils/cn.ts';
import { Card } from '@mantine/core';
import { memo, useContext, useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts';
import type { SubscriptionModel } from '../models/subscription.model.tsx';
import { SubscriptionsContext } from '../providers/subscriptions.provider.tsx';
import { cyclePeriodToCalculateMonthlyPrice } from '../utils/cycle-period-to-calculate-monthly-price.ts';

export const SubscriptionsByMonthChart = memo(() => {
  const { subscriptions } = useContext(SubscriptionsContext);

  const aggregatedSubscriptions = useMemo(
    () => Object.entries(aggregateSubscriptionsByMonth(subscriptions ?? [])),
    [subscriptions],
  );

  return (
    <Card
      className={cn(`h-full`)}
      shadow="xs"
      padding="xs"
      radius="md"
      withBorder>
      <ResponsiveContainer
        width="100%"
        height="100%">
        <BarChart data={aggregatedSubscriptions}>
          <Bar
            dataKey="1"
            fill="#8884d8"
          />
          <XAxis dataKey="0" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
});

function aggregateSubscriptionsByMonth(
  subscriptions: Array<SubscriptionModel>,
): Record<MonthName, number> {
  const totalPricePerMonth: Record<MonthName, number> = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };

  for (const subscription of subscriptions) {
    for (const month of months) {
      const calculateMonthlyPrice =
        cyclePeriodToCalculateMonthlyPrice[subscription.cycle.period];
      const monthName = monthToMonthName[month];

      totalPricePerMonth[monthName] += calculateMonthlyPrice(
        subscription,
        month,
      );
    }
  }

  return totalPricePerMonth;
}
