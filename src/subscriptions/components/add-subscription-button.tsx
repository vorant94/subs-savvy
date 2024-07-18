import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Button } from "@mantine/core";
import { memo, useCallback } from "react";
import { useBreakpoint } from "../../ui/hooks/use-breakpoint.ts";
import { useSubscriptionUpsert } from "../hooks/use-subscription-upsert.tsx";

export const AddSubscriptionButton = memo(() => {
	const upsert = useSubscriptionUpsert();
	const isMd = useBreakpoint("md");

	const openSubscriptionInsert = useCallback(
		() => upsert.dispatch({ type: "open" }),
		[upsert],
	);

	return isMd ? (
		<Button onClick={openSubscriptionInsert}>add sub</Button>
	) : (
		<ActionIcon
			onClick={openSubscriptionInsert}
			size="xl"
			radius="xl"
			aria-label="add sub"
		>
			<FontAwesomeIcon icon={faPlus} />
		</ActionIcon>
	);
});
