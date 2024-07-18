import type { ComboboxData } from "@mantine/core";
import type { ManipulateType } from "dayjs";

export const subscriptionCyclePeriods = ["monthly", "yearly"] as const;
export type SubscriptionCyclePeriod = (typeof subscriptionCyclePeriods)[number];

// TODO add weekly
export const subscriptionCyclePeriodToLabel = {
	monthly: "Month",
	yearly: "Year",
} as const satisfies Record<SubscriptionCyclePeriod, string>;

export const subscriptionCyclePeriodsComboboxData: ComboboxData =
	subscriptionCyclePeriods.map((cyclePeriod) => ({
		value: cyclePeriod,
		label: subscriptionCyclePeriodToLabel[cyclePeriod],
	}));

export const subscriptionCyclePeriodToManipulateUnit = {
	monthly: "month",
	yearly: "year",
} satisfies Record<SubscriptionCyclePeriod, ManipulateType>;
