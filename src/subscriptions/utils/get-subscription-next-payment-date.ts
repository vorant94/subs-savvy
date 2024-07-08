import dayjs from 'dayjs';
import type { SubscriptionModel } from '../models/subscription.model.ts';
import { subscriptionCyclePeriodToManipulateUnit } from '../types/subscription-cycle-period.ts';
import { isSubscriptionExpired } from './is-subscription-expired.ts';

export function getSubscriptionNextPaymentDate(
  subscription: SubscriptionModel,
  now: Date = new Date(),
): Date | null {
  const startedAtDayJs = dayjs(subscription.startedAt);
  const manipulateUnit =
    subscriptionCyclePeriodToManipulateUnit[subscription.cycle.period];

  if (isSubscriptionExpired(subscription, now)) {
    return null;
  }

  const nextPaymentDate = dayjs(now).add(1, manipulateUnit).toDate();
  if (isSubscriptionExpired(subscription, nextPaymentDate)) {
    return null;
  }

  const differenceInPeriods = startedAtDayJs
    .set('year', now.getFullYear())
    .set('month', now.getMonth())
    .diff(subscription.startedAt, manipulateUnit);

  return startedAtDayJs
    .add(Math.floor(differenceInPeriods) + 1, manipulateUnit)
    .toDate();
}
