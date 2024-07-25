import { Card, Text } from "@mantine/core";
import { memo } from "react";
import { subscriptionIconToSvg } from "../../subscriptions/types/subscription-icon-to-svg.tsx";
import {
	subscriptionIconToLabel,
	subscriptionIcons,
} from "../../subscriptions/types/subscription-icon.ts";
import { cn } from "../../ui/utils/cn.ts";

export const IconListPage = memo(() => {
	return (
		<div className={cn("flex flex-wrap gap-2")}>
			{subscriptionIcons.map((icon) => (
				<Card
					withBorder
					key={icon}
					className={cn("flex min-h-0 w-24 flex-col items-center gap-2")}
				>
					<span className={cn("w-8")}>{subscriptionIconToSvg[icon]}</span>
					<Text
						size="sm"
						className={cn("text-center")}
					>
						{subscriptionIconToLabel[icon]}
					</Text>
				</Card>
			))}
		</div>
	);
});
