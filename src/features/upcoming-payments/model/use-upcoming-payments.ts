import dayjs from "dayjs";
import { useMemo } from "react";
import {
	type SubscriptionWithNextPaymentAt,
	getSubscriptionNextPaymentAt,
} from "../../../entities/subscription/lib/get-subscription-next-payment-at.ts";
import type { SubscriptionModel } from "../../../shared/api/subscription.model.ts";
import { useBreakpoint } from "../../../shared/ui/use-breakpoint.tsx";

export function useUpcomingPayments(
	subscriptions: ReadonlyArray<SubscriptionModel>,
): Array<SubscriptionWithNextPaymentAt> {
	const isLg = useBreakpoint("lg");
	const isXl = useBreakpoint("xl");

	const filteredAndSorted = useMemo(
		() =>
			subscriptions
				.map((subscription) => ({
					...subscription,
					nextPaymentAt: getSubscriptionNextPaymentAt(subscription),
				}))
				.filter(
					(subscription): subscription is SubscriptionWithNextPaymentAt =>
						!!subscription.nextPaymentAt,
				)
				.toSorted((a, b) =>
					dayjs(a.nextPaymentAt).isBefore(b.nextPaymentAt) ? -1 : 1,
				),
		[subscriptions],
	);

	return useMemo(
		() => filteredAndSorted.slice(0, isXl ? 4 : isLg ? 3 : 2),
		[filteredAndSorted, isXl, isLg],
	);
}
