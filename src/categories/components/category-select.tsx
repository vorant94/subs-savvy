import { faCircle, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	ActionIcon,
	CloseButton,
	Combobox,
	Input,
	InputBase,
	useCombobox,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSubscriptions } from "../../subscriptions/hooks/use-subscriptions.tsx";
import { cn } from "../../ui/utils/cn.ts";
import { ManageCategoriesModal } from "./manage-categories-modal.tsx";

export const CategorySelect = memo(() => {
	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});
	const { categories, selectCategory, selectedCategory } = useSubscriptions();
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
									<FontAwesomeIcon
										color={selectedCategory.color}
										icon={faCircle}
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
									<FontAwesomeIcon
										color={category.color}
										icon={faCircle}
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
					<FontAwesomeIcon
						className={cn("mr-1")}
						icon={faSliders}
					/>
				</ActionIcon>
			</div>

			<ManageCategoriesModal
				isOpen={isManageCategoriesOpen}
				close={manageCategories.close}
			/>
		</>
	);
});
