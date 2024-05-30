import { monthNames, months, type Month } from '@/date/month.ts';
import { cn } from '@/ui/utils/cn.ts';
import { type ChartData } from 'chart.js';
import { differenceInCalendarYears } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo, type FC } from 'react';
import { Bar } from 'react-chartjs-2';
import type { SubscriptionModel } from '../models/subscription.model.ts';
import { findSubscriptions } from '../models/subscription.table.ts';

export const SubscriptionGraph: FC = () => {
  const subscriptions = useLiveQuery(() => findSubscriptions());

  const aggregatedSubscriptions = useMemo(
    () => aggregateSubscriptionsByMonth(subscriptions ?? []),
    [subscriptions],
  );

  const data: ChartData<'bar'> = useMemo(
    () => ({
      labels: [...monthNames],
      datasets: [
        {
          label: 'Total Price Per Month',
          data: Object.values(aggregatedSubscriptions),
        },
      ],
    }),
    [aggregatedSubscriptions],
  );

  return (
    <div className={cn(`relative flex items-center`)}>
      <Bar
        data={data}
        className={cn(`max-w-full`)}
      />
    </div>
  );
};

function aggregateSubscriptionsByMonth(
  subscriptions: Array<SubscriptionModel>,
): Record<Month, number> {
  const now = Date.now();
  const totalPricePerMonth: Record<Month, number> = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
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
      prev[month] += curr.price;
    }

    return prev;
  }, totalPricePerMonth);
}
