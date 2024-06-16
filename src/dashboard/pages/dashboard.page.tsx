import { AddSubscriptionButton } from '@/subscriptions/components/add-subscription-button.tsx';
import { SubscriptionUpsert } from '@/subscriptions/components/subscription-upsert.tsx';
import { SubscriptionsByMonthChart } from '@/subscriptions/components/subscriptions-by-month-chart.tsx';
import { SubscriptionUpsertStateContext } from '@/subscriptions/providers/subscription-upsert-state.provider.tsx';
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
        <SubscriptionsByMonthChart />
      </div>
    </DefaultLayout>
  );
});
