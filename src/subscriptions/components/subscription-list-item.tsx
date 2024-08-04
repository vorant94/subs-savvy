import { Avatar, Card, Indicator, Text, Title } from "@mantine/core";
import { memo, useCallback, useMemo } from "react";
import { cn } from "../../ui/utils/cn.ts";
import type { SubscriptionModel } from "../models/subscription.model.ts";
import { useUpsertSubscriptionActions } from "../stores/upsert-subscription.store.tsx";
import { subscriptionIconToSvg } from "../types/subscription-icon-to-svg.tsx";
import { isSubscriptionExpired } from "../utils/is-subscription-expired.ts";

export const SubscriptionListItem = memo(
	({ subscription }: SubscriptionListItemProps) => {
		const { open } = useUpsertSubscriptionActions();

		const openSubscriptionUpdate = useCallback(
			() => open(subscription),
			[open, subscription],
		);

		const isExpired = useMemo(
			() => isSubscriptionExpired(subscription),
			[subscription],
		);

		const Component = (
			<Card
				shadow="xs"
				padding="xs"
				radius="md"
				withBorder
				aria-label={subscription.name}
				component="button"
				className={cn("block min-h-16 text-left")}
				onClick={openSubscriptionUpdate}
			>
				<div className={cn("flex items-center gap-2")}>
					<Avatar
						radius={0}
						variant="transparent"
					>
						{subscriptionIconToSvg[subscription.icon]}
					</Avatar>

					<div className={cn("flex-1 overflow-hidden")}>
						<Title
							order={5}
							className={cn("!mb-0 truncate uppercase")}
						>
							{subscription.name}
						</Title>

						{subscription.description ? (
							<Text
								size="sm"
								className={cn("block truncate")}
							>
								{subscription.description}
							</Text>
						) : null}
					</div>

					<Title
						order={4}
						className={cn("!mb-0")}
					>
						{subscription.price}
					</Title>
				</div>
			</Card>
		);

		return isExpired ? (
			<Indicator
				className={cn("flex flex-col opacity-60")}
				color="gray"
				size="xs"
				position="bottom-center"
				label="Expired"
			>
				{Component}
			</Indicator>
		) : (
			Component
		);
	},
);

export interface SubscriptionListItemProps {
	subscription: SubscriptionModel;
}
