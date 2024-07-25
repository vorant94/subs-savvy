export const devOnlyRoute = {
	iconList: "icon-list",
} as const;

export type DevOnlyRoute = (typeof devOnlyRoute)[keyof typeof devOnlyRoute];
