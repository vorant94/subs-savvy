import { setMonth } from 'date-fns';
import type { SubscriptionModel } from './subscription.model.tsx';

export const minimalSubscription = {
  id: 1,
  name: 'Netflix',
  price: 13.33,
  icon: 'netflix',
} as const satisfies SubscriptionModel;

export const subscriptionWithDescription = {
  id: 2,
  name: 'WebStorm',
  price: 5.0,
  icon: 'jetbrains',
  description: 'Jetbrains',
} as const satisfies SubscriptionModel;

export const subscriptionWithStartedAt = {
  id: 3,
  name: 'GitHub',
  price: 13.33,
  icon: 'github',
  startedAt: setMonth(new Date(), 2),
} as const satisfies SubscriptionModel;

export const subscriptionWithEndedAt = {
  id: 4,
  name: 'YouTube',
  price: 5.0,
  icon: 'youtube',
  endedAt: setMonth(new Date(), 9),
} as const satisfies SubscriptionModel;

export const maximalSubscription = {
  id: 5,
  name: 'Telegram',
  price: 18.33,
  icon: 'telegram',
  description: 'premium',
  startedAt: setMonth(new Date(), 2),
  endedAt: setMonth(new Date(), 9),
} as const satisfies SubscriptionModel;
