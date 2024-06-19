import type { Month } from '@/date/types/month.ts';
import type { SubscriptionModel } from '../models/subscription.model.ts';
import type { SubscriptionCyclePeriod } from '../types/subscription-cycle-period.ts';

export interface CalculateSubscriptionMonthlyPrice {
  (subscription: SubscriptionModel, month: Month, year?: number): number;
}

export const cyclePeriodToCalculateMonthlyPrice = {
  monthly(
    { startedAt, endedAt, price },
    month,
    year = new Date().getFullYear(),
  ) {
    const startedAtYear = startedAt.getFullYear();
    const startedAtMonth = startedAt.getMonth();

    if (year < startedAtYear) {
      return 0;
    }

    if (endedAt && year > endedAt.getFullYear()) {
      return 0;
    }

    if (endedAt) {
      const endedAtMonth = endedAt.getMonth();
      const endedAtYear = endedAt.getFullYear();

      if (year > startedAtYear) {
        return month < endedAtMonth ? price : 0;
      }

      if (year < endedAtYear) {
        return price;
      }

      return month >= startedAtMonth && month < endedAtMonth ? price : 0;
    } else {
      if (year > startedAtYear) {
        return price;
      }

      return month >= startedAtMonth ? price : 0;
    }
  },
  yearly(
    { startedAt, endedAt, price },
    month,
    year = new Date().getFullYear(),
  ) {
    const startedAtYear = startedAt.getFullYear();
    const startedAtMonth = startedAt.getMonth();

    if (year < startedAtYear) {
      return 0;
    }

    if (endedAt && year >= endedAt.getFullYear()) {
      return 0;
    }

    return month === startedAtMonth ? price : 0;
  },
} as const satisfies Record<
  SubscriptionCyclePeriod,
  CalculateSubscriptionMonthlyPrice
>;
