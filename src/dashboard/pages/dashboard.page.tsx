import { AddSubscriptionButton } from '@/subscriptions/components/add-subscription-button.tsx';
import { SubscriptionGraph } from '@/subscriptions/components/subscription-graph.tsx';
import {
  SubscriptionUpsert,
  SubscriptionUpsertStateContext,
} from '@/subscriptions/components/subscription-upsert.tsx';
import {
  DefaultLayout,
  DefaultLayoutHeader,
} from '@/ui/layouts/default.layout.tsx';
import { cn } from '@/ui/utils/cn.ts';
import { memo, useContext } from 'react';

export const DashboardPage = memo(() => {
  const upsert = useContext(SubscriptionUpsertStateContext);

  return (
    <DefaultLayout
      header={<DefaultLayoutHeader actions={<AddSubscriptionButton />} />}
      drawerContent={<SubscriptionUpsert />}
      drawerTitle={`${upsert.state.mode === 'update' ? 'Update' : 'Insert'} Subscription`}>
      <div className={cn(`grid flex-1 grid-rows-2 gap-4`)}>
        <SubscriptionGraph />
      </div>
    </DefaultLayout>
  );
});
