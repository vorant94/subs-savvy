import { memo } from "react";
import type { SubscriptionModel } from "../../../shared/api/subscription.model.ts";
import type { PropsWithFcChildren } from "../../../shared/lib/props-with-fc-children.ts";
import { cn } from "../../../shared/ui/cn.ts";

export const SubscriptionGrid = memo(
	({
		subscriptions,
		noSubscriptionsPlaceholder,
		children,
	}: PropsWithFcChildren<
		SubscriptionGridProps,
		SubscriptionGridChildrenProps
	>) => {
		return (
			<div
				className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4")}
			>
				{subscriptions.length > 0 ? (
					subscriptions.map((subscription) => children?.({ subscription }))
				) : (
					<div>{noSubscriptionsPlaceholder}</div>
				)}
			</div>
		);
	},
);

export interface SubscriptionGridProps {
	subscriptions: Array<SubscriptionModel>;
	noSubscriptionsPlaceholder: string;
}

export interface SubscriptionGridChildrenProps {
	subscription: SubscriptionModel;
}