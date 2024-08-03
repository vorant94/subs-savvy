import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type {
	CategoryModel,
	InsertCategoryModel,
	UpdateCategoryModel,
	UpsertCategoryModel,
} from "../models/category.model.ts";
import { insertCategory, updateCategory } from "../models/category.table.ts";

export function useCategoryUpsertState(): CategoryUpsertState {
	return useStore(useShallow(selectState));
}

export type CategoryUpsertState =
	| {
			mode: "update";
			category: CategoryModel;
	  }
	| {
			mode: "insert" | null;
			category: null;
	  };

export function useCategoryUpsertMode(): CategoryUpsertState["mode"] {
	return useStore(selectMode);
}

export function useCategoryUpsertActions(): CategoryUpsertActions {
	return useStore(useShallow(selectActions));
}

export interface CategoryUpsertActions {
	open(category?: CategoryModel | null): void;
	close(): void;
	upsert(raw: UpsertCategoryModel): Promise<void>;
}

const useStore = create<Store>()(
	devtools(
		(set, get) => ({
			mode: null,
			category: null,
			open(category) {
				return set(
					category
						? {
								category,
								mode: "update",
							}
						: {
								category: null,
								mode: "insert",
							},
					undefined,
					{ type: "open", category },
				);
			},
			close() {
				return set(
					{
						mode: null,
						category: null,
					},
					undefined,
					{ type: "close" },
				);
			},
			async upsert(raw) {
				const store = get();

				store.mode === "update"
					? await updateCategory(raw as UpdateCategoryModel)
					: await insertCategory(raw as InsertCategoryModel);

				store.close();
				set({}, undefined, { type: "upsert", raw });
			},
		}),
		{ name: "CategoryUpsert", enabled: import.meta.env.DEV },
	),
);

type Store = CategoryUpsertState & CategoryUpsertActions;

function selectState({ category, mode }: Store): CategoryUpsertState {
	return { category, mode } as CategoryUpsertState;
}

function selectMode({ mode }: Store): CategoryUpsertState["mode"] {
	return mode;
}

function selectActions({ open, close, upsert }: Store): CategoryUpsertActions {
	return { open, close, upsert };
}
