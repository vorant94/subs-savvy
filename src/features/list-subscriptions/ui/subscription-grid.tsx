import { memo } from "react";
import type { SubscriptionModel } from "../../../shared/api/subscription.model.ts";
import { cn } from "../../../shared/ui/cn.ts";
import { SubscriptionGridItem } from "./subscription-grid-item.tsx";

export const SubscriptionGrid = memo(
	({
		subscriptions,
		noSubscriptionsPlaceholder,
		onItemClick,
	}: SubscriptionGridProps) => {
		return (
			<div
				className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4")}
			>
				{subscriptions.length > 0 ? (
					subscriptions.map((subscription) => (
						<SubscriptionGridItem
							key={subscription.id}
							subscription={subscription}
							onClick={onItemClick}
						/>
					))
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
	onItemClick: (subscription: SubscriptionModel) => void;
}
