import { vi } from "vitest";
import type { SubscriptionListItemProps } from "../subscription-list-item.tsx";

export const SubscriptionListItem = vi.fn(
	({ subscription }: SubscriptionListItemProps) => {
		return <div data-testid={subscription.id} />;
	},
);
