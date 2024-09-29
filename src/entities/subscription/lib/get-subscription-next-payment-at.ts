import dayjs from "dayjs";
import { subscriptionCyclePeriodToManipulateUnit } from "../../../shared/api/subscription-cycle-period.model.ts";
import type { SubscriptionModel } from "../../../shared/api/subscription.model.ts";
import { isSubscriptionExpired } from "./is-subscription-expired.ts";

export function getSubscriptionNextPaymentAt(
	subscription: SubscriptionModel,
	now: Date = new Date(),
): Date | null {
	const startedAtDayJs = dayjs(subscription.startedAt);
	const manipulateUnit =
		subscriptionCyclePeriodToManipulateUnit[subscription.cycle.period];

	if (isSubscriptionExpired(subscription, now)) {
		return null;
	}

	const nextPaymentDate = dayjs(now).add(1, manipulateUnit).toDate();
	if (isSubscriptionExpired(subscription, nextPaymentDate)) {
		return null;
	}

	if (startedAtDayJs.isAfter(now)) {
		return subscription.startedAt;
	}

	const differenceInPeriods = startedAtDayJs
		.set("year", now.getFullYear())
		.set("month", now.getMonth())
		.diff(subscription.startedAt, manipulateUnit);

	return startedAtDayJs
		.add(Math.floor(differenceInPeriods) + 1, manipulateUnit)
		.toDate();
}
