import { Text } from "@mantine/core";
import { type FC, type HTMLAttributes, memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { SubscriptionGridItem } from "../../../features/list-subscriptions/ui/subscription-grid-item.tsx";
import { SubscriptionGrid } from "../../../features/list-subscriptions/ui/subscription-grid.tsx";
import { useUpsertSubscriptionActions } from "../../../features/upsert-subscription/model/upsert-subscription.store.tsx";
import type { SubscriptionModel } from "../../../shared/api/subscription.model.ts";
import { cn } from "../../../shared/ui/cn.ts";
import { useUpcomingPayments } from "../model/use-upcoming-payments.ts";

export const UpcomingPayments: FC<UpcomingPaymentsProps> = memo(
	({ className }) => {
		const { t } = useTranslation();

		const upcomingPayments = useUpcomingPayments();

		const { open } = useUpsertSubscriptionActions();

		const openSubscriptionUpdate = useCallback(
			(subscription: SubscriptionModel) => open(subscription),
			[open],
		);

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
					subscriptions={upcomingPayments}
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
