import { ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { type FC, memo } from "react";
import { ManageCategoriesModal } from "../../../features/upsert-category/ui/manage-categories-modal.tsx";
import { Icon } from "../../../shared/ui/icon.tsx";

export const ManageCategories: FC = memo(() => {
	const [isManageCategoriesOpen, manageCategories] = useDisclosure(false);

	return (
		<>
			<ActionIcon
				aria-label="Manage Categories"
				onClick={manageCategories.open}
				size="lg"
				variant="light"
			>
				<Icon icon={IconAdjustmentsHorizontal} />
			</ActionIcon>

			<ManageCategoriesModal
				isOpen={isManageCategoriesOpen}
				close={manageCategories.close}
			/>
		</>
	);
});
