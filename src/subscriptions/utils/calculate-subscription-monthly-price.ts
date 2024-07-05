import dayjs from 'dayjs';
import type { SubscriptionModel } from '../models/subscription.model.ts';

export function calculateSubscriptionMonthlyPrice(
  subscription: SubscriptionModel,
  monthDate: Date,
): number {
  switch (subscription.cycle.period) {
    case 'monthly': {
      return calculateMonthlySubscriptionMonthlyPrice(subscription, monthDate);
    }
    case 'yearly': {
      return calculateYearlySubscriptionMonthlyPrice(subscription, monthDate);
    }
    default: {
      throw new Error(
        `Unsupported subscription cycle period ${subscription.cycle.period}`,
      );
    }
  }
}

function calculateMonthlySubscriptionMonthlyPrice(
  { startedAt, endedAt, price, cycle }: SubscriptionModel,
  monthDate: Date,
): number {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const startedAtYear = startedAt.getFullYear();
  const startedAtMonth = startedAt.getMonth();

  if (year < startedAtYear) {
    return 0;
  }

  if (endedAt && year > endedAt.getFullYear()) {
    return 0;
  }

  const differenceInMonths = dayjs(startedAt)
    .set('year', year)
    .set('month', month)
    .diff(startedAt, 'month');
  if (differenceInMonths % cycle.each !== 0) {
    return 0;
  }

  if (endedAt) {
    const endedAtMonth = endedAt.getMonth();
    const endedAtYear = endedAt.getFullYear();

    if (year > startedAtYear) {
      return (month < endedAtMonth && year === endedAtYear) ||
        year < endedAtYear
        ? price
        : 0;
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
}

function calculateYearlySubscriptionMonthlyPrice(
  { startedAt, endedAt, price, cycle }: SubscriptionModel,
  monthDate: Date,
): number {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const startedAtYear = startedAt.getFullYear();
  const startedAtMonth = startedAt.getMonth();

  if (year < startedAtYear) {
    return 0;
  }

  if (endedAt && year >= endedAt.getFullYear()) {
    return 0;
  }

  const differenceInYears = dayjs(startedAt)
    .set('year', year)
    .diff(startedAt, 'year');
  if (differenceInYears % cycle.each !== 0) {
    return 0;
  }

  return month === startedAtMonth ? price : 0;
}
