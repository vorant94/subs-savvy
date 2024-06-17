import type { TagModel } from '@/tags/models/tag.model.ts';
import { findTags } from '@/tags/models/tag.table.ts';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  createContext,
  memo,
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type { SubscriptionModel } from '../models/subscription.model.tsx';
import { findSubscriptions } from '../models/subscription.table.ts';

export const SubscriptionsProvider = memo(({ children }: PropsWithChildren) => {
  const unfilteredSubscriptions = useLiveQuery(() => findSubscriptions());
  const tags = useLiveQuery(() => findTags());
  const [selectedTag, setSelectedTag] = useState<TagModel | null>(null);

  const selectTag: (tagId: string | null) => void = useCallback(
    (tagId) => {
      if (tagId) {
        setSelectedTag(
          (tags ?? []).find((tag) => `${tag.id}` === tagId) ?? null,
        );
      } else {
        setSelectedTag(null);
      }
    },
    [tags],
  );

  const subscriptions = useMemo(
    () =>
      (unfilteredSubscriptions ?? []).filter(
        (subscription) =>
          !selectedTag ||
          subscription.tags.find((subTag) => subTag.id === selectedTag.id),
      ),
    [selectedTag, unfilteredSubscriptions],
  );

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions,
        tags: tags ?? [],
        selectedTag,
        selectTag,
      }}>
      {children}
    </SubscriptionsContext.Provider>
  );
});

export const SubscriptionsContext = createContext<{
  subscriptions: Array<SubscriptionModel>;
  tags: Array<TagModel>;
  selectedTag: TagModel | null;
  selectTag(tagId: string | null): void;
}>({
  subscriptions: [],
  tags: [],
  selectedTag: null,
  selectTag() {},
});
