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
	monthlySubscription,
	yearlySubscription,
} from "../models/subscription.mock.ts";
import { findSubscriptions } from "../models/subscription.table.ts";
import { useSubscriptionsMock } from "./use-subscriptions.mock.ts";
import {
	SubscriptionsProvider,
	type UseSubscriptions,
	useSubscriptions,
} from "./use-subscriptions.tsx";

vi.mock(import("../../categories/models/category.table.ts"));
vi.mock(import("../models/subscription.table.ts"));

describe("useSubscriptions", () => {
	let screen: RenderHookResult<UseSubscriptions, void>;
	let hook: RenderHookResult<UseSubscriptions, void>["result"];

	beforeAll(() => {
		vi.mocked(findSubscriptions).mockResolvedValue([
			monthlySubscription,
			yearlySubscription,
		]);

		vi.mocked(findCategories).mockResolvedValue([categoryMock]);
	});

	beforeEach(() => {
		screen = renderHook<UseSubscriptions, void>(() => useSubscriptions(), {
			wrapper,
		});

		hook = screen.result;
	});

	it("should fetch subscriptions and categories", async () => {
		await Promise.all([
			waitFor(() => expect(hook.current.selectedCategory).toBeFalsy()),
			waitFor(() =>
				expect(hook.current.categories).toEqual(
					useSubscriptionsMock.categories,
				),
			),
			waitFor(() =>
				expect(hook.current.subscriptions).toEqual(
					useSubscriptionsMock.subscriptions,
				),
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

	it("should throw when trying to select category with wrong id", async () => {
		// not real validation, but just to ensure that component is stable and is ready for upcoming `act` to be called
		await waitFor(() => expect(hook.current.categories.length).toEqual(1));

		// don't know how to check error type here, it isn't bubbling up to ErrorBoundary#onError for some reason
		expect(() => act(() => hook.current.selectCategory("7"))).toThrowError();
	});
});

const wrapper: FC<PropsWithChildren> = ({ children }) => {
	return <SubscriptionsProvider>{children}</SubscriptionsProvider>;
};
