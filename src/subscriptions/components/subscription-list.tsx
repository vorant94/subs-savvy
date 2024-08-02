import { CloseButton, TextInput } from "@mantine/core";
import { memo, useCallback, useMemo, useState } from "react";
import { cn } from "../../ui/utils/cn.ts";
import { useSubscriptions } from "../stores/subscriptions.store.tsx";
import { SubscriptionListItem } from "./subscription-list-item.tsx";

export const SubscriptionList = memo(() => {
	const [namePrefix, setNamePrefix] = useState("");
	const changeNamePrefix: (value: string) => void = useCallback(
		(value) => setNamePrefix(value.toLowerCase()),
		[],
	);

	const subscriptions = useSubscriptions();
	const filteredSubscriptions = useMemo(
		() =>
			subscriptions.filter((subscription) =>
				subscription.name.toLowerCase().startsWith(namePrefix),
			),
		[subscriptions, namePrefix],
	);

	return (
		<div className={cn("flex flex-col gap-4")}>
			<TextInput
				className={cn("self-start")}
				aria-label="Name prefix"
				placeholder="Name prefix"
				autoComplete="off"
				value={namePrefix}
				onChange={({ currentTarget }) => changeNamePrefix(currentTarget.value)}
				rightSection={
					namePrefix ? (
						<CloseButton
							size="sm"
							onMouseDown={(event) => event.preventDefault()}
							onClick={() => changeNamePrefix("")}
							aria-label="Clear name prefix"
						/>
					) : null
				}
			/>

			<div
				className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4")}
			>
				{filteredSubscriptions.length > 0 ? (
					filteredSubscriptions.map((subscription) => (
						<SubscriptionListItem
							key={subscription.id}
							subscription={subscription}
						/>
					))
				) : (
					<div>No Subscriptions</div>
				)}
			</div>
		</div>
	);
});
