import { Avatar, Card, Indicator, Text, Title } from "@mantine/core";
import { IconCircleFilled } from "@tabler/icons-react";
import { memo, useCallback, useMemo } from "react";
import { isSubscriptionExpired } from "../../../entities/subscription/lib/is-subscription-expired.ts";
import { subscriptionIconToSvg } from "../../../shared/api/subscription-icon-to-svg.tsx";
import type { SubscriptionModel } from "../../../shared/api/subscription.model.ts";
import { cn } from "../../../shared/ui/cn.ts";
import { Icon } from "../../../shared/ui/icon.tsx";

export const SubscriptionListItem = memo(
	({ subscription, onClick }: SubscriptionListItemProps) => {
		const isExpired = useMemo(
			() => isSubscriptionExpired(subscription),
			[subscription],
		);

		const fireClickEvent = useCallback(
			() => onClick(subscription),
			[subscription, onClick],
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
				onClick={fireClickEvent}
			>
				<div className={cn("flex items-center gap-2")}>
					<Avatar
						radius={0}
						variant="transparent"
					>
						{subscriptionIconToSvg[subscription.icon]}
					</Avatar>

					<div className={cn("flex-1 overflow-hidden")}>
						<div className={cn("flex items-center gap-1")}>
							<Title
								order={5}
								className={cn("!mb-0 truncate uppercase")}
							>
								{subscription.name}
							</Title>

							{subscription.category && (
								<Icon
									icon={IconCircleFilled}
									color={subscription.category.color}
								/>
							)}
						</div>

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
	onClick: (subscription: SubscriptionModel) => void;
}
