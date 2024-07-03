import { tag } from '@/tags/models/tag.mock.ts';
import dayjs from 'dayjs';
import type { SubscriptionModel } from './subscription.model.ts';

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
  tags: [tag],
} as const satisfies SubscriptionModel;

export const yearlySubscription = {
  id: 2,
  name: 'Telegram',
  price: 13.33,
  startedAt: dayjs(new Date()).set('month', 2).toDate(),
  icon: 'telegram',
  cycle: {
    each: 1,
    period: 'yearly',
  },
  tags: [],
} as const satisfies SubscriptionModel;

export const twoMonthlySubscription = {
  id: 3,
  name: 'Arnona',
  price: 826,
  startedAt: dayjs(new Date()).set('month', 2).toDate(),
  icon: 'house',
  cycle: {
    each: 2,
    period: 'monthly',
  },
  tags: [tag],
} as const satisfies SubscriptionModel;

export const twoYearlySubscription = {
  id: 4,
  name: 'Non-Arnona',
  price: 300,
  startedAt: dayjs(new Date()).set('month', 2).toDate(),
  icon: 'house',
  cycle: {
    each: 2,
    period: 'yearly',
  },
  tags: [],
} as const satisfies SubscriptionModel;

export const subscriptions = [monthlySubscription, yearlySubscription] as const;
