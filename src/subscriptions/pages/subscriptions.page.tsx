import {
  TagSelect,
  type TagsSelectProps,
} from '@/tags/components/tag-select.tsx';
import {
  DefaultLayout,
  DefaultLayoutHeader,
} from '@/ui/layouts/default.layout.tsx';
import { memo, useCallback, useContext } from 'react';
import { AddSubscriptionButton } from '../components/add-subscription-button.tsx';
import { SubscriptionList } from '../components/subscription-list.tsx';
import { SubscriptionUpsert } from '../components/subscription-upsert.tsx';
import { SubscriptionUpsertStateContext } from '../providers/subscription-upsert-state.provider.tsx';

export const SubscriptionsPage = memo(() => {
  const upsert = useContext(SubscriptionUpsertStateContext);

  const updateSelectedTags: TagsSelectProps['onChange'] = useCallback(
    (tags) => {
      console.log(tags);
    },
    [],
  );

  return (
    <DefaultLayout
      header={
        <DefaultLayoutHeader actions={<AddSubscriptionButton />}>
          <TagSelect onChange={updateSelectedTags} />
        </DefaultLayoutHeader>
      }
      drawerContent={<SubscriptionUpsert />}
      drawerTitle={`${upsert.state.mode === 'update' ? 'Update' : 'Insert'} Subscription`}>
      <SubscriptionList />
    </DefaultLayout>
  );
});
