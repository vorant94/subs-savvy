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
import { SubscriptionGrid } from "../../../features/list-subscriptions/ui/subscription-grid.tsx";
import { useUpsertSubscriptionActions } from "../../../features/upsert-subscription/model/upsert-subscription.store.tsx";
import type { SubscriptionModel } from "../../../shared/api/subscription.model.ts";
import { cn } from "../../../shared/ui/cn.ts";

export const UpcomingPayments: FC<UpcomingPaymentsProps> = memo(
	({ className }) => {
		const subscriptions = useSubscriptions();

		const subscriptionsWithNextPaymentAt = useMemo(
			() =>
				filterSubscriptionsWithNextPaymentAt(subscriptions)
					.toSorted((a, b) =>
						dayjs(a.nextPaymentAt).diff(b.nextPaymentAt, "days"),
					)
					.slice(0, 4),
			[subscriptions],
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
					subscriptions={subscriptionsWithNextPaymentAt}
					onItemClick={openSubscriptionUpdate}
					noSubscriptionsPlaceholder={"No Upcoming Subscriptions"}
					hideDescription={true}
				/>
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
