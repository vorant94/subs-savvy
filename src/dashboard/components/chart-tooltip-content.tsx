import { Card, Divider, Text } from "@mantine/core";
import { Fragment, memo } from "react";
import type { TooltipProps } from "recharts";
import type { SubscriptionModel } from "../../subscriptions/models/subscription.model.ts";
import { cn } from "../../ui/utils/cn.ts";

export const ChartTooltipContent = memo(
	({ payload }: TooltipProps<number, string>) => {
		const value = payload?.[0]?.value;
		const subscriptions = (payload?.[0]?.payload as ChartTooltipContentPayload)
			?.subscriptions;

		if ((!value && value !== 0) || !subscriptions) {
			return <></>;
		}

		return (
			<Card
				shadow="xs"
				padding="xs"
				radius="md"
				withBorder
				className={cn("flex flex-col gap-2")}
			>
				<div className={cn("grid grid-cols-2 gap-1")}>
					<Text size="sm">Total:</Text>
					<Text
						className={cn("justify-self-end")}
						size="sm"
					>
						{value}
					</Text>
				</div>
				<Divider />
				<div className={cn("grid grid-cols-2 gap-1")}>
					{subscriptions.map((subscription) => (
						<Fragment key={subscription.id}>
							<Text
								size="xs"
								c="dimmed"
							>
								{subscription.name}
							</Text>
							<Text
								className={cn("justify-self-end")}
								size="xs"
								c="dimmed"
							>
								{subscription.price}
							</Text>
						</Fragment>
					))}
				</div>
			</Card>
		);
	},
);

export interface ChartTooltipContentPayload {
	totalExpenses: number;
	subscriptions: Array<SubscriptionModel>;
}
