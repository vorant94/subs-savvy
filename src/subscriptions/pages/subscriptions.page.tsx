import {
  TagsSelect,
  type TagsSelectProps,
} from '@/tags/components/tags-select.tsx';
import {
  DefaultLayout,
  DefaultLayoutHeader,
} from '@/ui/layouts/default.layout.tsx';
import { memo, useCallback, useContext } from 'react';
import { AddSubscriptionButton } from '../components/add-subscription-button.tsx';
import { SubscriptionList } from '../components/subscription-list.tsx';
import {
  SubscriptionUpsert,
  SubscriptionUpsertStateContext,
} from '../components/subscription-upsert.tsx';

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
          <TagsSelect onChange={updateSelectedTags} />
        </DefaultLayoutHeader>
      }
      drawerContent={<SubscriptionUpsert />}
      drawerTitle={`${upsert.state.mode === 'update' ? 'Update' : 'Insert'} Subscription`}>
      <SubscriptionList />
    </DefaultLayout>
  );
});
