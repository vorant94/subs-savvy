import { TagSelect } from '@/tags/components/tag-select.tsx';
import {
  DefaultLayout,
  DefaultLayoutHeader,
} from '@/ui/layouts/default.layout.tsx';
import { memo, useContext } from 'react';
import { AddSubscriptionButton } from '../components/add-subscription-button.tsx';
import { SubscriptionList } from '../components/subscription-list.tsx';
import { SubscriptionUpsert } from '../components/subscription-upsert.tsx';
import { SubscriptionUpsertStateContext } from '../providers/subscription-upsert-state.provider.tsx';

export const SubscriptionsPage = memo(() => {
  const upsert = useContext(SubscriptionUpsertStateContext);

  return (
    <DefaultLayout
      header={
        <DefaultLayoutHeader actions={<AddSubscriptionButton />}>
          <TagSelect />
        </DefaultLayoutHeader>
      }
      drawerContent={<SubscriptionUpsert />}
      drawerTitle={`${upsert.state.mode === 'update' ? 'Update' : 'Insert'} Subscription`}>
      <SubscriptionList />
    </DefaultLayout>
  );
});
