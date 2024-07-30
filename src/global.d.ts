import "vitest";
import type { TypeOptions } from "i18next";
import type { AppI18n } from "./app.i18n.ts";
import type { CategorySelectI18n } from "./categories/components/category-select.i18n.ts";
import type { ExpensesByCategoryI18n } from "./dashboard/components/expenses-by-category.i18n.tsx";
import type { DateMatchers } from "./date/utils/date.matchers.ts";
import type { db } from "./db/globals/db.ts";
import type { AddSubscriptionButtonI18n } from "./subscriptions/components/add-subscription-button.i18n.ts";
import type { UseNavLinksI18n } from "./ui/hooks/use-nav-links.i18n.ts";

declare global {
	interface Window {
		db: typeof db;
	}
}

declare module "vitest" {
	interface Assertion extends DateMatchers {}
	interface AsymmetricMatchersContaining extends DateMatchers {}
}

declare module "./ui/hooks/use-nav-links.i18n.ts" {
	interface UseNavLinksI18n extends AppI18n {}
}

declare module "i18next" {
	interface CustomTypeOptions {
		resources: CustomResources;
	}

	interface CustomResources
		extends Record<TypeOptions["defaultNS"], CustomDefaultNsResource> {}

	interface CustomDefaultNsResource
		extends AddSubscriptionButtonI18n,
			AppI18n,
			ExpensesByCategoryI18n,
			CategorySelectI18n,
			UseNavLinksI18n {}
}
