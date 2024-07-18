export const breakpoints = ["sm", "md", "lg", "xl", "2xl"] as const;
export type Breakpoint = (typeof breakpoints)[number];

export const breakpointToMediaQuery = {
	sm: "(min-width: 640px)",
	md: "(min-width: 768px)",
	lg: "(min-width: 1024px)",
	xl: "(min-width: 1280px)",
	"2xl": "(min-width: 1536px)",
} as const satisfies Record<Breakpoint, string>;
