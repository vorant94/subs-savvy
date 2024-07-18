import type { UseSubscriptionUpsert } from "./use-subscription-upsert.tsx";

export const useSubscriptionUpsertMock = {
	state: {
		subscription: null,
		mode: null,
	},
	dispatch: () => {},
} as const satisfies UseSubscriptionUpsert;
