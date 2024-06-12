import {
  monthToMonthName,
  months,
  type Month,
  type MonthName,
} from '@/date/types/month.ts';
import { differenceInCalendarYears } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';
import { memo, useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts';
import type { SubscriptionModel } from '../models/subscription.model.tsx';
import { findSubscriptions } from '../models/subscription.table.ts';

export const SubscriptionGraph = memo(() => {
  const subscriptions = useLiveQuery(() => findSubscriptions());

  const aggregatedSubscriptions = useMemo(
    () => Object.entries(aggregateSubscriptionsByMonth(subscriptions ?? [])),
    [subscriptions],
  );

  return (
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
  );
});

/**
 * @internal
 */
export function aggregateSubscriptionsByMonth(
  subscriptions: Array<SubscriptionModel>,
): Record<MonthName, number> {
  const now = Date.now();
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

  return subscriptions.reduce((prev, curr) => {
    let startMonth: Month = 0;
    if (
      curr.startedAt &&
      differenceInCalendarYears(now, curr.startedAt) === 0
    ) {
      startMonth = curr.startedAt.getMonth() as Month;
    } else if (
      curr.startedAt &&
      differenceInCalendarYears(now, curr.startedAt) < 0
    ) {
      return prev;
    }

    let endMonth: Month = months[months.length - 1]!;
    if (curr.endedAt && differenceInCalendarYears(now, curr.endedAt) === 0) {
      endMonth = curr.endedAt.getMonth() as Month;
    } else if (
      curr.endedAt &&
      differenceInCalendarYears(now, curr.endedAt) > 0
    ) {
      return prev;
    }

    for (let month = startMonth; month <= endMonth; month++) {
      prev[monthToMonthName[month]] =
        Math.round((prev[monthToMonthName[month]] + curr.price) * 100) / 100;
    }

    return prev;
  }, totalPricePerMonth);
}
