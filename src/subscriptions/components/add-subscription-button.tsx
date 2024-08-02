import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Button } from "@mantine/core";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useBreakpoint } from "../../ui/hooks/use-breakpoint.tsx";
import { useSubscriptionUpsertActions } from "../stores/subscription-upsert.store.tsx";

export const AddSubscriptionButton = memo(() => {
	const { open } = useSubscriptionUpsertActions();
	const isMd = useBreakpoint("md");
	const { t } = useTranslation();

	const openSubscriptionInsert = useCallback(() => open(), [open]);

	return isMd ? (
		<Button onClick={openSubscriptionInsert}>{t("add-sub")}</Button>
	) : (
		<ActionIcon
			onClick={openSubscriptionInsert}
			size="xl"
			radius="xl"
			aria-label={t("add-sub")}
		>
			<FontAwesomeIcon icon={faPlus} />
		</ActionIcon>
	);
});
