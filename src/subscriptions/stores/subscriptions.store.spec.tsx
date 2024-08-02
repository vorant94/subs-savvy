import {
	type RenderHookResult,
	act,
	renderHook,
	waitFor,
} from "@testing-library/react";
import type { FC, PropsWithChildren } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { categoryMock } from "../../categories/models/category.mock.ts";
import type { CategoryModel } from "../../categories/models/category.model.ts";
import { findCategories } from "../../categories/models/category.table.ts";
import {
	CategoriesProvider,
	useCategories,
	useSelectedCategory,
} from "../../categories/stores/categories.store.tsx";
import {
	monthlySubscription,
	yearlySubscription,
} from "../models/subscription.mock.ts";
import type { SubscriptionModel } from "../models/subscription.model.ts";
import { findSubscriptions } from "../models/subscription.table.ts";
import {
	SubscriptionsProvider,
	useSubscriptions,
} from "./subscriptions.store.tsx";

vi.mock(import("../../categories/models/category.table.ts"));
vi.mock(import("../models/subscription.table.ts"));

describe("subscriptions.store", () => {
	let screen: RenderHookResult<HooksCombined, void>;
	let hook: RenderHookResult<HooksCombined, void>["result"];

	beforeAll(() => {
		vi.mocked(findSubscriptions).mockResolvedValue([
			monthlySubscription,
			yearlySubscription,
		]);

		vi.mocked(findCategories).mockResolvedValue([categoryMock]);
	});

	beforeEach(() => {
		screen = renderHook<HooksCombined, void>(
			() => {
				const subscriptions = useSubscriptions();
				const categories = useCategories();
				const [selectedCategory, selectCategory] = useSelectedCategory();

				return {
					subscriptions,
					categories,
					selectedCategory,
					selectCategory,
				};
			},
			{
				wrapper,
			},
		);

		hook = screen.result;
	});

	it("should fetch subscriptions", async () => {
		await Promise.all([
			waitFor(() =>
				expect(hook.current.subscriptions).toEqual([
					monthlySubscription,
					yearlySubscription,
				]),
			),
		]);
	});

	it("should filter/unfilter subscriptions based on selected category", async () => {
		const category = {
			...categoryMock,
		} satisfies CategoryModel;

		// not real validation, but just to ensure that component is stable and is ready for upcoming `act` to be called
		await waitFor(() => expect(hook.current.categories.length).toEqual(1));

		act(() => hook.current.selectCategory(`${category.id}`));
		await Promise.all([
			waitFor(() =>
				expect(hook.current.selectedCategory?.id).toEqual(category.id),
			),
			waitFor(() => expect(hook.current.subscriptions.length).toEqual(1)),
		]);

		act(() => hook.current.selectCategory(null));
		await Promise.all([
			waitFor(() => expect(hook.current.selectedCategory).toBeFalsy()),
			waitFor(() => expect(hook.current.subscriptions.length).toEqual(2)),
		]);
	});
});

const wrapper: FC<PropsWithChildren> = ({ children }) => {
	return (
		<CategoriesProvider>
			<SubscriptionsProvider>{children}</SubscriptionsProvider>
		</CategoriesProvider>
	);
};

interface HooksCombined {
	subscriptions: ReadonlyArray<SubscriptionModel>;
	categories: ReadonlyArray<CategoryModel>;
	selectedCategory: CategoryModel | null;
	selectCategory(categoryId: string | null): void;
}
