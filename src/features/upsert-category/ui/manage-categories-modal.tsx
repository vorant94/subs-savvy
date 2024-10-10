import { Button, Modal } from "@mantine/core";
import { memo, useCallback, useEffect, useState } from "react";
import { cn } from "../../../shared/ui/cn.ts";
import {
	useUpsertCategoryActions,
	useUpsertCategoryMode,
} from "../model/upsert-category.store.tsx";
import { CategoryForm } from "./category-form.tsx";
import { CategoryList } from "./category-list.tsx";

export const ManageCategoriesModal = memo(
	({ isOpen, close }: ManageCategoriesModalProps) => {
		const [mode, setMode] = useState<"view" | "upsert">("view");

		const upsertMode = useUpsertCategoryMode();
		const upsertActions = useUpsertCategoryActions();
		const openCategoryInsert = useCallback(() => {
			setMode("upsert");
			upsertActions.open();
		}, [upsertActions.open]);
		const closeCategoryUpsert = useCallback(() => {
			setMode("view");
			upsertActions.close();
		}, [upsertActions.close]);

		const [formId, setFormId] = useState("");
		const updateFormId: (ref: HTMLFormElement | null) => void = useCallback(
			(ref) => setFormId(ref?.getAttribute("id") ?? ""),
			[],
		);

		useEffect(() => {
			if (!isOpen) {
				if (mode !== "view") {
					setMode("view");
				}

				if (upsertMode) {
					upsertActions.close();
				}
			}

			if (!upsertMode && mode !== "view") {
				setMode("view");
			}

			if (upsertMode && mode === "view") {
				setMode("upsert");
			}
		}, [isOpen, mode, upsertActions.close, upsertMode]);

		return (
			<Modal
				opened={isOpen}
				onClose={close}
				title="Manage Categories"
			>
				<div className={cn("flex flex-col gap-2")}>
					{mode === "view" ? (
						<CategoryList />
					) : (
						<CategoryForm ref={updateFormId} />
					)}

					<div className={cn("flex justify-end gap-2")}>
						{mode === "view" ? (
							<Button
								type="button"
								key="add-category"
								onClick={openCategoryInsert}
							>
								add category
							</Button>
						) : (
							<Button
								type="submit"
								key="submit-category-form"
								form={formId}
							>
								{upsertMode === "update" ? "Update" : "Insert"}
							</Button>
						)}
						{mode !== "view" ? (
							<Button
								type="button"
								key="cancel-category-form"
								variant="outline"
								onClick={closeCategoryUpsert}
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