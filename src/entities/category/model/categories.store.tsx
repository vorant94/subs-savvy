import { useLiveQuery } from "dexie-react-hooks";
import { type PropsWithChildren, memo, useEffect } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type { CategoryModel } from "../../../shared/api/category.model.ts";
import {
	CategoryNotFound,
	findCategories,
} from "../../../shared/api/category.table.ts";

export function useCategories(): ReadonlyArray<CategoryModel> {
	return useStore(selectCategories);
}

export function useSelectedCategory(): UseSelectedCategory {
	return useStore(useShallow(selectSelectedCategory));
}

export type UseSelectedCategory = Readonly<
	[CategoryModel | null, (categoryId: string | null) => void]
>;

export const CategoriesProvider = memo(({ children }: PropsWithChildren) => {
	const { setCategories } = useStore();

	const categories = useLiveQuery(() => findCategories(), [], []);
	useEffect(() => setCategories(categories), [categories, setCategories]);

	return <>{children}</>;
});

const useStore = create<Store>()(
	devtools(
		(set) => ({
			categories: [],
			setCategories: (categories) =>
				set({ categories }, undefined, { type: "setCategories", categories }),
			selectedCategory: null,
			selectCategory: (categoryId) =>
				set(
					({ categories }) => {
						if (categoryId) {
							const categoryToSelect = categories.find(
								(category) => `${category.id}` === categoryId,
							);

							if (!categoryToSelect) {
								throw new CategoryNotFound(+categoryId);
							}

							return {
								selectedCategory: categoryToSelect,
							};
						}

						return {
							selectedCategory: null,
						};
					},
					undefined,
					{ type: "selectCategory", categoryId },
				),
		}),
		{ name: "Categories", enabled: import.meta.env.DEV },
	),
);

interface Store {
	categories: ReadonlyArray<CategoryModel>;
	setCategories(categories: ReadonlyArray<CategoryModel>): void;
	selectedCategory: CategoryModel | null;
	selectCategory(categoryId: string | null): void;
}

function selectCategories({ categories }: Store): ReadonlyArray<CategoryModel> {
	return categories;
}

function selectSelectedCategory({
	selectedCategory,
	selectCategory,
}: Store): UseSelectedCategory {
	return [selectedCategory, selectCategory];
}
