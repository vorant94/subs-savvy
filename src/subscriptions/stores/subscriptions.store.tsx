import { useLiveQuery } from "dexie-react-hooks";
import { type PropsWithChildren, memo, useEffect, useMemo } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useSelectedCategory } from "../../categories/stores/categories.store.tsx";
import type { SubscriptionModel } from "../models/subscription.model.ts";
import { findSubscriptions } from "../models/subscription.table.ts";

export function useSubscriptions(): ReadonlyArray<SubscriptionModel> {
	return useStore(selectSubscriptions);
}

export const SubscriptionsProvider = memo(({ children }: PropsWithChildren) => {
	const [selectedCategory] = useSelectedCategory();
	const { setSubscriptions } = useStore();

	const unfilteredSubscriptions = useLiveQuery(
		() => findSubscriptions(),
		[],
		[],
	);
	const subscriptions = useMemo(() => {
		if (!selectedCategory) {
			return unfilteredSubscriptions;
		}

		return unfilteredSubscriptions.filter(
			({ category }) => category?.id === selectedCategory.id,
		);
	}, [selectedCategory, unfilteredSubscriptions]);
	useEffect(
		() => setSubscriptions(subscriptions),
		[subscriptions, setSubscriptions],
	);

	return <>{children}</>;
});

const useStore = create<Store>()(
	devtools(
		(set) => ({
			subscriptions: [],
			setSubscriptions: (subscriptions) =>
				set({ subscriptions }, undefined, {
					type: "setSubscriptions",
					subscriptions,
				}),
		}),
		{ name: "Subscriptions", enabled: import.meta.env.DEV },
	),
);

interface Store {
	subscriptions: ReadonlyArray<SubscriptionModel>;
	setSubscriptions(subscriptions: ReadonlyArray<SubscriptionModel>): void;
}

function selectSubscriptions({
	subscriptions,
}: Store): ReadonlyArray<SubscriptionModel> {
	return subscriptions;
}
