import { create } from "zustand";
import type {
	CategoryModel,
	InsertCategoryModel,
	UpdateCategoryModel,
	UpsertCategoryModel,
} from "../models/category.model.ts";
import { insertCategory, updateCategory } from "../models/category.table.ts";

export function useCategoryUpsertMode(): Store["mode"] {
	return useStore(selectMode);
}

export function useCategoryUpsertState(): UseCategoryUpsertState {
	return useStore(selectState);
}

export type UseCategoryUpsertState =
	| {
			mode: "update";
			category: CategoryModel;
	  }
	| {
			mode: "insert" | null;
	  };

export function useCategoryUpsertActions(): Store["actions"] {
	return useStore(selectActions);
}

const useStore = create<Store>((set, get) => ({
	mode: null,
	category: null,
	actions: {
		open(category) {
			return set(() => ({
				category,
				mode: category ? "update" : "insert",
			}));
		},
		close() {
			return set(() => ({
				mode: null,
				category: null,
			}));
		},
		async upsert(raw) {
			get().mode === "update"
				? await updateCategory(raw as UpdateCategoryModel)
				: await insertCategory(raw as InsertCategoryModel);

			get().actions.close();
		},
	},
}));

interface Store {
	mode: "update" | "insert" | null;
	category: CategoryModel | null;
	actions: {
		open(category?: CategoryModel | null): void;
		close(): void;
		upsert(raw: UpsertCategoryModel): Promise<void>;
	};
}

function selectMode({ mode }: Store): Store["mode"] {
	return mode;
}

function selectState({ category, mode }: Store): UseCategoryUpsertState {
	return mode === "update"
		? {
				category: category as CategoryModel,
				mode,
			}
		: {
				mode,
			};
}

function selectActions({ actions }: Store): Store["actions"] {
	return actions;
}
