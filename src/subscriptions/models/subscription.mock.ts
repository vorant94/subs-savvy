import { setMonth } from 'date-fns';
import type { SubscriptionModel } from './subscription.model.tsx';

export const monthlySubscription = {
  id: 1,
  name: 'Netflix',
  price: 13.33,
  startedAt: setMonth(new Date(), 2),
  icon: 'netflix',
  cycle: {
    each: 1,
    period: 'monthly',
  },
} as const satisfies SubscriptionModel;

export const yearlySubscription = {
  id: 1,
  name: 'Netflix',
  price: 13.33,
  startedAt: setMonth(new Date(), 2),
  icon: 'netflix',
  cycle: {
    each: 1,
    period: 'yearly',
  },
} as const satisfies SubscriptionModel;
