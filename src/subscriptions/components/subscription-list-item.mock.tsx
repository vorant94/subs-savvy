import type { SubscriptionListItemProps } from "./subscription-list-item.tsx";

export const SubscriptionListItemMock = ({
	subscription,
}: SubscriptionListItemProps) => {
	return <div data-testid={subscription.id} />;
};
