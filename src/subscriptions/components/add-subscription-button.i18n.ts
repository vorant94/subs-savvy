export const addSubscriptionButtonI18n = {
	"add-sub": "add-sub",
} as const;

export type AddSubscriptionButtonI18n = Record<
	keyof typeof addSubscriptionButtonI18n,
	string
>;

export const addSubscriptionButtonEn = {
	"add-sub": "add sub",
} as const satisfies AddSubscriptionButtonI18n;
