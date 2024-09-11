import { vi } from "vitest";
import type { CategoryModel } from "../../models/category.model.ts";
import { categoryStub } from "../../models/category.stub.ts";
import type { UseSelectedCategory } from "../categories.store.tsx";

export const useCategories = vi.fn(() => [
	categoryStub,
]) satisfies () => ReadonlyArray<CategoryModel>;

export const selectCategorySpy = vi.fn() satisfies UseSelectedCategory[1];

export const useSelectedCategory = vi.fn(
	() => [null, selectCategorySpy] as const,
) satisfies () => UseSelectedCategory;
