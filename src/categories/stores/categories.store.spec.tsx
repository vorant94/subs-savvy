import {
	type RenderHookResult,
	act,
	renderHook,
	waitFor,
} from "@testing-library/react";
import type { FC, PropsWithChildren } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { categoryMock } from "../models/category.mock.ts";
import type { CategoryModel } from "../models/category.model.ts";
import { findCategories } from "../models/category.table.ts";
import {
	CategoriesProvider,
	useCategories,
	useSelectedCategory,
} from "./categories.store.tsx";

vi.mock(import("../models/category.table.ts"));

describe("categories.store", () => {
	let screen: RenderHookResult<HooksCombined, void>;
	let hook: RenderHookResult<HooksCombined, void>["result"];

	beforeAll(() => {
		vi.mocked(findCategories).mockResolvedValue([categoryMock]);
	});

	beforeEach(() => {
		screen = renderHook<HooksCombined, void>(
			() => {
				const categories = useCategories();
				const [selectedCategory, selectCategory] = useSelectedCategory();

				return {
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

	it("should fetch categories", async () => {
		await Promise.all([
			waitFor(() => expect(hook.current.selectedCategory).toBeFalsy()),
			waitFor(() => expect(hook.current.categories).toEqual([categoryMock])),
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
	return <CategoriesProvider>{children}</CategoriesProvider>;
};

interface HooksCombined {
	categories: ReadonlyArray<CategoryModel>;
	selectedCategory: CategoryModel | null;
	selectCategory(categoryId: string | null): void;
}
