export const rootRoute = {
	dashboard: "dashboard",
	subscriptions: "subscriptions",
	recovery: "recovery",
} as const;

export type RootRoute = (typeof rootRoute)[keyof typeof rootRoute];
