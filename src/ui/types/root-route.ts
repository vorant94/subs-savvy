export const rootRoute = {
	dashboard: "dashboard",
	subscriptions: "subscriptions",
	recovery: "recovery",
	devOnly: "dev-only",
} as const;

export type RootRoute = (typeof rootRoute)[keyof typeof rootRoute];
