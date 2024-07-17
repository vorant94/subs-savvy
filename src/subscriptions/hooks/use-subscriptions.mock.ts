import type { UseSubscriptions } from './use-subscriptions.tsx';

export const useSubscriptionsMock = {
  subscriptions: [],
  categories: [],
  selectedCategory: null,
  selectCategory() {},
} as const satisfies UseSubscriptions;
