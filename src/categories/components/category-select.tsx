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
import { useDisclosure, usePrevious } from "@mantine/hooks";
import { memo, useEffect } from "react";
import { useSubscriptions } from "../../subscriptions/hooks/use-subscriptions.tsx";
import { cn } from "../../ui/utils/cn.ts";
import { ManageCategoriesModal } from "./manage-categories-modal.tsx";

export const CategorySelect = memo(() => {
	const { categories, selectCategory, selectedCategory } = useSubscriptions();
	const prevSelectedCategory = usePrevious(selectedCategory);

	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	useEffect(() => {
		if (selectedCategory?.id !== prevSelectedCategory?.id) {
			combobox.closeDropdown();
		}
	}, [selectedCategory, prevSelectedCategory, combobox]);

	const [isManageCategoriesOpen, manageCategories] = useDisclosure(false);

	return (
		<>
			<div className={cn("flex items-center gap-2")}>
				<Combobox
					store={combobox}
					onOptionSubmit={selectCategory}
				>
					<Combobox.Target>
						<InputBase
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
										aria-label="Clear value"
									/>
								) : (
									<Combobox.Chevron />
								)
							}
							rightSectionPointerEvents={selectedCategory ? "all" : "none"}
							onClick={() => combobox.toggleDropdown()}
						>
							{selectedCategory?.name ?? (
								<Input.Placeholder>Select category</Input.Placeholder>
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
