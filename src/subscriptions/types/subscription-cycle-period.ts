import type { ComboboxData } from '@mantine/core';

export const subscriptionCyclePeriods = ['monthly', 'yearly'] as const;
export type SubscriptionCyclePeriod = (typeof subscriptionCyclePeriods)[number];

// TODO add weekly
export const subscriptionCyclePeriodToLabel = {
  monthly: 'Month',
  yearly: 'Year',
} as const satisfies Record<SubscriptionCyclePeriod, string>;

export const subscriptionCyclePeriodsComboboxData: ComboboxData =
  subscriptionCyclePeriods.map((cyclePeriod) => ({
    value: cyclePeriod,
    label: subscriptionCyclePeriodToLabel[cyclePeriod],
  }));
