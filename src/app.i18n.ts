export const appI18n = {
	dashboard: "dashboard",
	subscriptions: "subscriptions",
	recovery: "recovery",
} as const;

export type AppI18n = Record<keyof typeof appI18n, string>;

export const appEn = {
	dashboard: "Dashboard",
	subscriptions: "Subscriptions",
	recovery: "Recovery",
} as const satisfies AppI18n;
