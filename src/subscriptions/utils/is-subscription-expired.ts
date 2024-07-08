import dayjs, { type ManipulateType } from 'dayjs';
import type { SubscriptionModel } from '../models/subscription.model.ts';

export function isSubscriptionExpired(
  subscription: SubscriptionModel,
  now = new Date(),
  comparePeriod: ManipulateType = 'day',
): boolean {
  if (!subscription.endedAt) {
    return false;
  }

  const endedAtDayJS = dayjs(subscription.endedAt);
  if (endedAtDayJS.isSame(now, comparePeriod)) {
    return true;
  }

  return endedAtDayJS.isBefore(now, comparePeriod);
}
