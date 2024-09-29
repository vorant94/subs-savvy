import {
	ActionIcon,
	CloseButton,
	Combobox,
	Input,
	InputBase,
	useCombobox,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	IconAdjustmentsHorizontal,
	IconCircleFilled,
} from "@tabler/icons-react";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../../ui/components/icon.tsx";
import { cn } from "../../ui/utils/cn.ts";
import {
	useCategories,
	useSelectedCategory,
} from "../stores/categories.store.tsx";
import { ManageCategoriesModal } from "./manage-categories-modal.tsx";

export const SelectCategory = memo(() => {
	const categories = useCategories();

	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});
	const [selectedCategory, selectCategory] = useSelectedCategory();
	const handleSelectCategory = useCallback(
		(categoryId: string | null) => {
			selectCategory(categoryId);
			combobox.closeDropdown();
		},
		[selectCategory, combobox],
	);

	const [isManageCategoriesOpen, manageCategories] = useDisclosure(false);

	const { t } = useTranslation();

	return (
		<>
			<div className={cn("flex items-center gap-2")}>
				<Combobox
					store={combobox}
					onOptionSubmit={handleSelectCategory}
				>
					<Combobox.Target>
						<InputBase
							aria-label={t("select-category")}
							className={cn("w-48")}
							component="button"
							type="button"
							pointer
							leftSection={
								selectedCategory ? (
									<Icon
										icon={IconCircleFilled}
										color={selectedCategory.color}
									/>
								) : null
							}
							rightSection={
								selectedCategory ? (
									<CloseButton
										size="sm"
										onMouseDown={(event) => event.preventDefault()}
										onClick={() => selectCategory(null)}
										aria-label="Clear selected category"
									/>
								) : (
									<Combobox.Chevron />
								)
							}
							rightSectionPointerEvents={selectedCategory ? "all" : "none"}
							onClick={() => combobox.toggleDropdown()}
						>
							{selectedCategory?.name ?? (
								<Input.Placeholder>{t("select-category")}</Input.Placeholder>
							)}
						</InputBase>
					</Combobox.Target>

					<Combobox.Dropdown>
						<Combobox.Options>
							{categories.map((category) => (
								<Combobox.Option
									value={`${category.id}`}
									key={category.id}
								>
									<Icon
										icon={IconCircleFilled}
										color={category.color}
									/>{" "}
									{category.name}
								</Combobox.Option>
							))}
						</Combobox.Options>
					</Combobox.Dropdown>
				</Combobox>

				<ActionIcon
					aria-label="Manage Categories"
					onClick={manageCategories.open}
					size="lg"
					variant="light"
				>
					<Icon icon={IconAdjustmentsHorizontal} />
				</ActionIcon>
			</div>

			<ManageCategoriesModal
				isOpen={isManageCategoriesOpen}
				close={manageCategories.close}
			/>
		</>
	);
});
