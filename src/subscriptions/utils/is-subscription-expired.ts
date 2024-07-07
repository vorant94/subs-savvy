import dayjs from 'dayjs';
import type { SubscriptionModel } from '../models/subscription.model.ts';

export function isSubscriptionExpired(
  subscription: SubscriptionModel,
  compareTo = new Date(),
): boolean {
  if (!subscription.endedAt) {
    return false;
  }

  if (dayjs(subscription.endedAt).isSame(compareTo, 'day')) {
    return false;
  }

  return dayjs(subscription.endedAt).isBefore(compareTo);
}
