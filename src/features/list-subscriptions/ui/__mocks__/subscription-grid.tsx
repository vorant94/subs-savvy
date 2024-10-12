import { vi } from "vitest";
import type { SubscriptionGridProps } from "../subscription-grid.tsx";

export const SubscriptionGrid = vi.fn(
	({ subscriptions }: SubscriptionGridProps) => {
		return (
			<>
				{subscriptions.map((subscription) => (
					<div
						key={subscription.id}
						data-testid={subscription.id}
					/>
				))}
			</>
		);
	},
);
