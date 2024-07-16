import { useLiveQuery } from 'dexie-react-hooks';
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type { CategoryModel } from '../../categories/models/category.model.ts';
import { findCategories } from '../../categories/models/category.table.ts';
import type { SubscriptionModel } from '../models/subscription.model.ts';
import { findSubscriptions } from '../models/subscription.table.ts';

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
        setSelectedCategory(
          categories.find((category) => `${category.id}` === categoryId) ??
            null,
        );
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
      }}>
      {children}
    </subscriptionsContext.Provider>
  );
});

const subscriptionsContext = createContext<UseSubscriptions>({
  subscriptions: [],
  categories: [],
  selectedCategory: null,
  selectCategory() {},
});
