import { Button, Modal } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";
import {
	type Reducer,
	memo,
	useCallback,
	useEffect,
	useReducer,
	useState,
} from "react";
import { cn } from "../../ui/utils/cn.ts";
import type {
	CategoryModel,
	InsertCategoryModel,
	UpdateCategoryModel,
} from "../models/category.model.ts";
import {
	deleteCategory,
	findCategories,
	insertCategory,
	updateCategory,
} from "../models/category.table.ts";
import { CategoryForm, type CategoryFormProps } from "./category-form.tsx";
import { CategoryList, type CategoryListProps } from "./category-list.tsx";

export const ManageCategoriesModal = memo(
	({ isOpen, close }: ManageCategoriesModalProps) => {
		const categories = useLiveQuery(() => findCategories(), [], []);
		const [state, dispatch] = useReducer<
			Reducer<ManageCategoriesModalState, ManageCategoriesModalAction>
		>((_, action) => {
			switch (action.type) {
				case "upsert": {
					return action.category
						? { category: action.category, mode: "update" }
						: { mode: "insert" };
				}
				case "view": {
					return stateDefaults;
				}
			}
		}, stateDefaults);

		const switchToInsertMode = useCallback(() => {
			dispatch({ type: "upsert" });
		}, []);

		const switchToViewMode = useCallback(() => {
			dispatch({ type: "view" });
		}, []);

		const switchToUpdateMode: CategoryListProps["onUpdate"] = useCallback(
			(category) => {
				dispatch({ type: "upsert", category });
			},
			[],
		);

		const upsertCategory: CategoryFormProps["onSubmit"] = useCallback(
			async (raw) => {
				if (state.mode === "view") {
					throw new Error("Nothing to upsert in view mode");
				}

				state.mode === "update"
					? await updateCategory(raw as UpdateCategoryModel)
					: await insertCategory(raw as InsertCategoryModel);

				switchToViewMode();
			},
			[state, switchToViewMode],
		);

		const deleteCategoryCb: CategoryListProps["onDelete"] = useCallback(
			async (id) => {
				await deleteCategory(id);
			},
			[],
		);

		useEffect(() => {
			if (!isOpen && state.mode !== "view") {
				dispatch({ type: "view" });
			}
		}, [isOpen, state]);

		const [formId, setFormId] = useState("");
		const updateFormId: (ref: HTMLFormElement | null) => void = useCallback(
			(ref) => setFormId(ref?.getAttribute("id") ?? ""),
			[],
		);

		return (
			<Modal
				opened={isOpen}
				onClose={close}
				title="Manage Categories"
			>
				<div className={cn("flex flex-col gap-2")}>
					{state.mode === "view" ? (
						<CategoryList
							categories={categories}
							onUpdate={switchToUpdateMode}
							onDelete={deleteCategoryCb}
						/>
					) : (
						<CategoryForm
							ref={updateFormId}
							onSubmit={upsertCategory}
							category={state.mode === "update" ? state.category : null}
						/>
					)}

					<div className={cn("flex justify-end gap-2")}>
						{state.mode === "view" ? (
							<Button
								type="button"
								key="add-category"
								onClick={switchToInsertMode}
							>
								add category
							</Button>
						) : (
							<Button
								type="submit"
								key="submit-category-form"
								form={formId}
							>
								{state.mode === "update" ? "Update" : "Insert"}
							</Button>
						)}
						{state.mode !== "view" ? (
							<Button
								type="button"
								key="cancel-category-form"
								variant="outline"
								onClick={switchToViewMode}
							>
								Cancel
							</Button>
						) : null}
					</div>
				</div>
			</Modal>
		);
	},
);

export interface ManageCategoriesModalProps {
	isOpen: boolean;
	close: () => void;
}

type ManageCategoriesModalState =
	| {
			category: CategoryModel;
			mode: "update";
	  }
	| {
			mode: "view";
	  }
	| {
			mode: "insert";
	  };

const stateDefaults: ManageCategoriesModalState = {
	mode: "view",
};

interface ManageCategoriesModalUpsertAction {
	type: "upsert";
	category?: CategoryModel | null;
}

interface ManageCategoriesModalViewAction {
	type: "view";
}

type ManageCategoriesModalAction =
	| ManageCategoriesModalUpsertAction
	| ManageCategoriesModalViewAction;
