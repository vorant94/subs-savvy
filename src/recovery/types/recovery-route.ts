export const recoveryRoute = {
	import: "import",
	export: "export",
} as const;

export type RecoveryRoute = (typeof recoveryRoute)[keyof typeof recoveryRoute];
