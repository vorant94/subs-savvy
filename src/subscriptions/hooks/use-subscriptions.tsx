import { useLiveQuery } from "dexie-react-hooks";
import {
	type PropsWithChildren,
	createContext,
	memo,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import type { CategoryModel } from "../../categories/models/category.model.ts";
import {
	CategoryNotFound,
	findCategories,
} from "../../categories/models/category.table.ts";
import type { SubscriptionModel } from "../models/subscription.model.ts";
import { findSubscriptions } from "../models/subscription.table.ts";
import { useSubscriptionsMock } from "./use-subscriptions.mock.ts";

export function useSubscriptions(): UseSubscriptions {
	return useContext(subscriptionsContext);
}

export interface UseSubscriptions {
	subscriptions: ReadonlyArray<SubscriptionModel>;
	categories: ReadonlyArray<CategoryModel>;
	selectedCategory: CategoryModel | null;
	selectCategory(categoryId: string | null): void;
}

export const SubscriptionsProvider = memo(({ children }: PropsWithChildren) => {
	const unfilteredSubscriptions = useLiveQuery(
		() => findSubscriptions(),
		[],
		[],
	);
	const categories = useLiveQuery(() => findCategories(), [], []);
	const [selectedCategory, setSelectedCategory] =
		useState<CategoryModel | null>(null);

	const selectCategory: (categoryId: string | null) => void = useCallback(
		(categoryId) => {
			if (categoryId) {
				const categoryToSelect = categories.find(
					(category) => `${category.id}` === categoryId,
				);

				if (!categoryToSelect) {
					throw new CategoryNotFound(+categoryId);
				}

				setSelectedCategory(categoryToSelect);
			} else {
				setSelectedCategory(null);
			}
		},
		[categories],
	);

	const subscriptions = useMemo(
		() =>
			unfilteredSubscriptions.filter(
				(subscription) =>
					!selectedCategory ||
					subscription.category?.id === selectedCategory.id,
			),
		[selectedCategory, unfilteredSubscriptions],
	);

	return (
		<subscriptionsContext.Provider
			value={{
				subscriptions,
				categories,
				selectedCategory,
				selectCategory,
			}}
		>
			{children}
		</subscriptionsContext.Provider>
	);
});

const subscriptionsContext =
	createContext<UseSubscriptions>(useSubscriptionsMock);
