import "vitest";
import type { TypeOptions } from "i18next";
import type { DateMatchers } from "./date/utils/date.matchers.ts";
import type { db } from "./db/globals/db.ts";
import type { Translation } from "./i18n/types/translation.ts";

declare global {
	interface Window {
		db: typeof db;
	}
}

declare module "vitest" {
	interface Assertion extends DateMatchers {}
	interface AsymmetricMatchersContaining extends DateMatchers {}
}

declare module "i18next" {
	interface CustomTypeOptions {
		resources: CustomResources;
	}

	interface CustomResources
		extends Record<TypeOptions["defaultNS"], typeof Translation> {}
}
