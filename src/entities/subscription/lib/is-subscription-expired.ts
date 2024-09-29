import dayjs, { type ManipulateType } from "dayjs";
import type { SubscriptionModel } from "../../../shared/api/subscription.model.ts";

export function isSubscriptionExpired(
	subscription: SubscriptionModel,
	now = new Date(),
	comparePeriod: ManipulateType = "day",
): boolean {
	if (!subscription.endedAt) {
		return false;
	}

	const endedAtDayJs = dayjs(subscription.endedAt);
	if (endedAtDayJs.isSame(now, comparePeriod)) {
		return true;
	}

	return endedAtDayJs.isBefore(now, comparePeriod);
}
