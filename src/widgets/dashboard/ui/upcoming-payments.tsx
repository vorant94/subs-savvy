import { Text } from "@mantine/core";
import dayjs from "dayjs";
import {
	type FC,
	type HTMLAttributes,
	memo,
	useCallback,
	useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { getSubscriptionNextPaymentAt } from "../../../entities/subscription/lib/get-subscription-next-payment-at.ts";
import { useSubscriptions } from "../../../entities/subscription/model/subscriptions.store.tsx";
import { SubscriptionGridItem } from "../../../features/list-subscriptions/ui/subscription-grid-item.tsx";
import { SubscriptionGrid } from "../../../features/list-subscriptions/ui/subscription-grid.tsx";
import { useUpsertSubscriptionActions } from "../../../features/upsert-subscription/model/upsert-subscription.store.tsx";
import type { SubscriptionModel } from "../../../shared/api/subscription.model.ts";
import { cn } from "../../../shared/ui/cn.ts";
import { useBreakpoint } from "../../../shared/ui/use-breakpoint.tsx";

export const UpcomingPayments: FC<UpcomingPaymentsProps> = memo(
	({ className }) => {
		const subscriptions = useSubscriptions();

		const sortedSubsWithNextPaymentAt = useMemo(
			() =>
				filterSubscriptionsWithNextPaymentAt(subscriptions).toSorted((a, b) =>
					dayjs(a.nextPaymentAt).diff(b.nextPaymentAt, "days"),
				),
			[subscriptions],
		);

		const isLg = useBreakpoint("lg");
		const isXl = useBreakpoint("xl");

		const subsToShow = useMemo(
			() => sortedSubsWithNextPaymentAt.slice(0, isXl ? 4 : isLg ? 3 : 2),
			[sortedSubsWithNextPaymentAt, isXl, isLg],
		);

		const { open } = useUpsertSubscriptionActions();

		const openSubscriptionUpdate = useCallback(
			(subscription: SubscriptionModel) => open(subscription),
			[open],
		);

		const { t } = useTranslation();

		return (
			<div className={cn("flex flex-col gap-4", className)}>
				<Text
					className={cn("font-medium")}
					size="sm"
					c="dimmed"
				>
					{t("upcoming-payments")}
				</Text>

				<SubscriptionGrid
					subscriptions={subsToShow}
					noSubscriptionsPlaceholder={"No Upcoming Subscriptions"}
				>
					{({ subscription }) => (
						<SubscriptionGridItem
							key={subscription.id}
							subscription={subscription}
							onClick={openSubscriptionUpdate}
							hideDescription={true}
						/>
					)}
				</SubscriptionGrid>
			</div>
		);
	},
);

export interface UpcomingPaymentsProps
	extends Pick<HTMLAttributes<HTMLDivElement>, "className"> {}

interface SubscriptionWithNextPaymentAt extends SubscriptionModel {
	nextPaymentAt: Date;
}

function filterSubscriptionsWithNextPaymentAt(
	subscriptions: ReadonlyArray<SubscriptionModel>,
): ReadonlyArray<SubscriptionWithNextPaymentAt> {
	return subscriptions
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
		);
}
