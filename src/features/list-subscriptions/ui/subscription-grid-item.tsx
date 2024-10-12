import { Avatar, Card, Indicator, Text, Title } from "@mantine/core";
import { IconCircleFilled } from "@tabler/icons-react";
import dayjs from "dayjs";
import { type FC, memo, useCallback, useMemo } from "react";
import { getSubscriptionNextPaymentAt } from "../../../entities/subscription/lib/get-subscription-next-payment-at.ts";
import { isSubscriptionExpired } from "../../../entities/subscription/lib/is-subscription-expired.ts";
import { subscriptionIconToSvg } from "../../../shared/api/subscription-icon-to-svg.tsx";
import type { SubscriptionModel } from "../../../shared/api/subscription.model.ts";
import { startOfToday } from "../../../shared/lib/dates.ts";
import { cn } from "../../../shared/ui/cn.ts";
import { Icon } from "../../../shared/ui/icon.tsx";
import { useCurrencyFormatter } from "../../i18n/model/use-currency-formatter.ts";
import { useRelativeTimeFormatter } from "../../i18n/model/use-relative-time-formatter.ts";

export const SubscriptionGridItem = memo(
	({
		subscription,
		onClick,
		hideDescription,
		hideNextPaymentAt,
	}: SubscriptionGridItemProps) => {
		const isExpired = useMemo(
			() => isSubscriptionExpired(subscription),
			[subscription],
		);

		const fireClickEvent = useCallback(
			() => onClick(subscription),
			[subscription, onClick],
		);

		const nextPaymentAt = useMemo(
			() => getSubscriptionNextPaymentAt(subscription),
			[subscription],
		);

		const currencyFormatter = useCurrencyFormatter();

		const Component = (
			<Card
				padding="lg"
				radius="md"
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

					<div className={cn("flex flex-1 flex-col overflow-hidden")}>
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

							<div className={cn("flex-1")} />

							<Title
								order={4}
								className={cn("!mb-0")}
							>
								{currencyFormatter.format(subscription.price)}
							</Title>
						</div>

						{subscription.description && !hideDescription ? (
							<Text
								size="sm"
								className={cn("block truncate")}
								c="dimmed"
							>
								{subscription.description}
							</Text>
						) : null}

						{nextPaymentAt && !hideNextPaymentAt ? (
							<NextPaymentAt nextPaymentAt={nextPaymentAt} />
						) : null}
					</div>
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

export interface SubscriptionGridItemProps {
	subscription: SubscriptionModel;
	onClick: (subscription: SubscriptionModel) => void;
	hideDescription?: boolean;
	hideNextPaymentAt?: boolean;
}

const NextPaymentAt: FC<NextPaymentDateAt> = memo(({ nextPaymentAt }) => {
	const nextPaymentAtDayJs = useMemo(
		() => dayjs(nextPaymentAt),
		[nextPaymentAt],
	);

	const diffInDays = nextPaymentAtDayJs.diff(startOfToday, "days");

	const relativeTimeFormatter = useRelativeTimeFormatter();

	return (
		<Text
			size="sm"
			className={cn("block truncate")}
			c="dimmed"
		>
			{nextPaymentAtDayJs.format("D MMM")} •{" "}
			{relativeTimeFormatter.format(diffInDays, "days")}
		</Text>
	);
});

interface NextPaymentDateAt {
	nextPaymentAt: Date;
}
