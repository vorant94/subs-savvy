import dayjs from 'dayjs';
import type { SubscriptionModel } from './subscription.model.tsx';

export const monthlySubscription = {
  id: 1,
  name: 'Netflix',
  price: 13.33,
  startedAt: dayjs(new Date()).set('month', 2).toDate(),
  icon: 'netflix',
  cycle: {
    each: 1,
    period: 'monthly',
  },
  tags: [],
} as const satisfies SubscriptionModel;

export const yearlySubscription = {
  id: 1,
  name: 'Netflix',
  price: 13.33,
  startedAt: dayjs(new Date()).set('month', 2).toDate(),
  icon: 'netflix',
  cycle: {
    each: 1,
    period: 'yearly',
  },
  tags: [],
} as const satisfies SubscriptionModel;
