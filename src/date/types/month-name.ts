import type { Translation } from "../../i18n/types/translation.ts";

// TODO make translations via date util lib
//  https://day.js.org/docs/en/customization/month-names
export const monthNames = [
	"jan",
	"feb",
	"mar",
	"apr",
	"may",
	"jun",
	"jul",
	"aug",
	"sep",
	"oct",
	"nov",
	"dec",
] as const satisfies ReadonlyArray<keyof Translation>;

export type MonthName = (typeof monthNames)[number];
