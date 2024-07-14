import type { SubscriptionModel } from '../models/subscription.model.ts';

export function calculateSubscriptionPriceForYear(
  _: SubscriptionModel,
  __: Date = new Date(),
): number {
  throw new Error(`Not Implemented`);
}
