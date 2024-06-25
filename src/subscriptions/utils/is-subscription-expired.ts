import dayjs from 'dayjs';
import type { SubscriptionModel } from '../models/subscription.model.ts';

export function isSubscriptionExpired(
  subscription: SubscriptionModel,
): boolean {
  return (
    !!subscription.endedAt && dayjs(subscription.endedAt).isBefore(new Date())
  );
}
