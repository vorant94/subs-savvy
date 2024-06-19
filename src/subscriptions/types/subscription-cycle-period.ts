export const subscriptionCyclePeriods = ['monthly', 'yearly'] as const;
export type SubscriptionCyclePeriod = (typeof subscriptionCyclePeriods)[number];

export const subscriptionCyclePeriodToLabel = {
  monthly: 'Month',
  yearly: 'Year',
} as const satisfies Record<SubscriptionCyclePeriod, string>;
