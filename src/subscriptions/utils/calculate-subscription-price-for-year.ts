import dayjs from "dayjs";
import type { SubscriptionModel } from "../models/subscription.model.ts";
import { isSubscriptionExpired } from "./is-subscription-expired.ts";

export function calculateSubscriptionPriceForYear(
	subscription: SubscriptionModel,
	now: Date = new Date(),
): number {
	const startedAtDayJs = dayjs(subscription.startedAt);

	if (startedAtDayJs.isAfter(now, "year")) {
		return 0;
	}

	switch (subscription.cycle.period) {
		case "yearly": {
			if (isSubscriptionExpired(subscription, now, "year")) {
				return 0;
			}

			const differenceInYears = startedAtDayJs
				.set("year", now.getFullYear())
				.diff(subscription.startedAt, "year");
			if (differenceInYears % subscription.cycle.each !== 0) {
				return 0;
			}

			return subscription.price;
		}
		case "monthly": {
			if (startedAtDayJs.isSame(now, "year")) {
				return (
					(subscription.price * (12 - startedAtDayJs.get("month"))) /
					subscription.cycle.each
				);
			}

			if (subscription.endedAt) {
				const endedAtDayJs = dayjs(subscription.endedAt);

				if (endedAtDayJs.isSame(now, "year")) {
					return (
						(subscription.price * endedAtDayJs.get("month")) /
						subscription.cycle.each
					);
				}
			}

			if (isSubscriptionExpired(subscription, now, "year")) {
				return 0;
			}

			return (subscription.price * 12) / subscription.cycle.each;
		}
	}
}
