import { SplitLayout, SplitLayoutHeader } from '@/ui/layouts/split.layout.tsx';
import { memo } from 'react';
import { AddSubscriptionButton } from '../components/add-subscription-button.tsx';
import { SubscriptionList } from '../components/subscription-list.tsx';
import { SubscriptionUpsert } from '../components/subscription-upsert.tsx';

export const SubscriptionsPage = memo(() => {
  return (
    <SplitLayout
      header={<SplitLayoutHeader actions={<AddSubscriptionButton />} />}
      left={<SubscriptionList />}
      right={<SubscriptionUpsert />}
    />
  );
});
