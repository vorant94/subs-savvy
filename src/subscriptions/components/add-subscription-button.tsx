import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Button } from "@mantine/core";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useBreakpoint } from "../../ui/hooks/use-breakpoint.ts";
import { useSubscriptionUpsert } from "../hooks/use-subscription-upsert.tsx";
import { addSubscriptionButtonI18n } from "./add-subscription-button.i18n.ts";

export const AddSubscriptionButton = memo(() => {
	const upsert = useSubscriptionUpsert();
	const isMd = useBreakpoint("md");
	const { t } = useTranslation();

	const openSubscriptionInsert = useCallback(
		() => upsert.dispatch({ type: "open" }),
		[upsert],
	);

	return isMd ? (
		<Button onClick={openSubscriptionInsert}>
			{t(addSubscriptionButtonI18n["add-sub"])}
		</Button>
	) : (
		<ActionIcon
			onClick={openSubscriptionInsert}
			size="xl"
			radius="xl"
			aria-label={t(addSubscriptionButtonI18n["add-sub"])}
		>
			<FontAwesomeIcon icon={faPlus} />
		</ActionIcon>
	);
});
