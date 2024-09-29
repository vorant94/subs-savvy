import { ActionIcon, Text } from "@mantine/core";
import { IconCircleFilled, IconPencil, IconTrash } from "@tabler/icons-react";
import { memo, useCallback } from "react";
import { Icon } from "../../ui/components/icon.tsx";
import { cn } from "../../ui/utils/cn.ts";
import type { CategoryModel } from "../models/category.model.ts";
import { deleteCategory } from "../models/category.table.ts";
import { useCategories } from "../stores/categories.store.tsx";
import { useUpsertCategoryActions } from "../stores/upsert-category.store.tsx";

export const CategoryList = memo(() => {
	const categories = useCategories();

	const { open } = useUpsertCategoryActions();
	const openCategoryUpdate = useCallback(
		(category: CategoryModel) => {
			open(category);
		},
		[open],
	);

	const handleDeleteCategory = useCallback(
		(id: number) => deleteCategory(id),
		[],
	);

	return (
		<div className={cn("flex flex-col divide-y divide-dashed")}>
			{categories.map((category) => (
				<div
					className={cn("flex items-center gap-2 py-1")}
					key={category.id}
				>
					<Icon
						icon={IconCircleFilled}
						color={category.color}
					/>

					<Text>{category.name}</Text>

					<div className={cn("flex-1")} />

					<ActionIcon
						aria-label={`edit ${category.name} category`}
						variant="subtle"
						onClick={() => openCategoryUpdate(category)}
					>
						<Icon icon={IconPencil} />
					</ActionIcon>

					<ActionIcon
						aria-label={`delete ${category.name} category`}
						variant="subtle"
						color="red"
						onClick={() => handleDeleteCategory(category.id)}
					>
						<Icon icon={IconTrash} />
					</ActionIcon>
				</div>
			))}
		</div>
	);
});
