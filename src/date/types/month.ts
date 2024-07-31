import type { MonthName } from "./month-name.ts";

export const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export type Month = (typeof months)[number];

export const monthToMonthName = {
	0: "jan",
	1: "feb",
	2: "mar",
	3: "apr",
	4: "may",
	5: "jun",
	6: "jul",
	7: "aug",
	8: "sep",
	9: "oct",
	10: "nov",
	11: "dec",
} as const satisfies Record<Month, MonthName>;
