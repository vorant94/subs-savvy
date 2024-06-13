import {
  TagsSelect,
  type TagsSelectProps,
} from '@/tags/components/tags-select.tsx';
import { SplitLayout, SplitLayoutHeader } from '@/ui/layouts/split.layout.tsx';
import { memo, useCallback } from 'react';
import { AddSubscriptionButton } from '../components/add-subscription-button.tsx';
import { SubscriptionList } from '../components/subscription-list.tsx';
import { SubscriptionUpsert } from '../components/subscription-upsert.tsx';

export const SubscriptionsPage = memo(() => {
  const updateSelectedTags: TagsSelectProps['onChange'] = useCallback(
    (tags) => {
      console.log(tags);
    },
    [],
  );

  return (
    <SplitLayout
      header={
        <SplitLayoutHeader actions={<AddSubscriptionButton />}>
          <TagsSelect onChange={updateSelectedTags} />
        </SplitLayoutHeader>
      }
      left={<SubscriptionList />}
      right={<SubscriptionUpsert />}
    />
  );
});
