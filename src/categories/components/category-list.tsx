import { faCircle, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Text } from "@mantine/core";
import { memo } from "react";
import { cn } from "../../ui/utils/cn.ts";
import type { CategoryModel } from "../models/category.model.ts";

export const CategoryList = memo(
	({ categories, onUpdate, onDelete }: CategoryListProps) => {
		return (
			<div className={cn("flex flex-col divide-y divide-dashed")}>
				{categories.map((category) => (
					<div
						className={cn("flex items-center gap-2 py-1")}
						key={category.id}
					>
						<FontAwesomeIcon
							icon={faCircle}
							color={category.color}
						/>

						<Text>{category.name}</Text>

						<div className={cn("flex-1")} />

						<ActionIcon
							aria-label={`edit ${category.name} category`}
							variant="subtle"
							onClick={() => onUpdate(category)}
						>
							<FontAwesomeIcon icon={faPen} />
						</ActionIcon>

						<ActionIcon
							aria-label={`delete ${category.name} category`}
							variant="subtle"
							color="red"
							onClick={() => onDelete(category.id)}
						>
							<FontAwesomeIcon icon={faTrash} />
						</ActionIcon>
					</div>
				))}
			</div>
		);
	},
);

export interface CategoryListProps {
	categories: ReadonlyArray<CategoryModel>;
	onDelete(id: number): Promise<void> | void;
	onUpdate(category: CategoryModel): Promise<void> | void;
}
