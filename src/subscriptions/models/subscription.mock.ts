import type { SubscriptionModel } from './subscription.model.ts';

export const subscriptionsMock = [
  {
    id: '1',
    name: 'Netflix',
    price: 13.33,
    icon: 'netflix',
  },
  {
    id: '2',
    name: 'WebStorm',
    price: 5.0,
    icon: 'intellij',
    description: 'intellij',
  },
  {
    id: '3',
    name: 'GitHub',
    price: 13.33,
    icon: 'github',
  },
  {
    id: '4',
    name: 'YouTube',
    price: 5.0,
    icon: 'google',
  },
] as const satisfies SubscriptionModel[];
