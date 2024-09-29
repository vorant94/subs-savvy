import { CloseButton, TextInput } from "@mantine/core";
import { memo, useCallback, useMemo, useState } from "react";
import { useSubscriptions } from "../../../entities/subscription/model/subscriptions.store.tsx";
import { SubscriptionListItem } from "../../../features/list-subscriptions/ui/subscription-list-item.tsx";
import { useUpsertSubscriptionActions } from "../../../features/upsert-subscription/model/upsert-subscription.store.tsx";
import type { SubscriptionModel } from "../../../shared/api/subscription.model.ts";
import { cn } from "../../../shared/ui/cn.ts";

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

	const { open } = useUpsertSubscriptionActions();

	const openSubscriptionUpdate = useCallback(
		(subscription: SubscriptionModel) => open(subscription),
		[open],
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
							onClick={openSubscriptionUpdate}
						/>
					))
				) : (
					<div>No Subscriptions</div>
				)}
			</div>
		</div>
	);
});
