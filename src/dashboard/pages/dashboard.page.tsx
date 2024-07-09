import { AddSubscriptionButton } from '@/subscriptions/components/add-subscription-button.tsx';
import { SubscriptionUpsert } from '@/subscriptions/components/subscription-upsert.tsx';
import { useSubscriptionUpsert } from '@/subscriptions/hooks/use-subscription-upsert';
import { TagSelect } from '@/tags/components/tag-select.tsx';
import {
  DefaultLayout,
  DefaultLayoutHeader,
} from '@/ui/layouts/default.layout.tsx';
import { cn } from '@/ui/utils/cn.ts';
import { memo } from 'react';
import { ExpensesPerMonth } from '../components/expenses-per-month.tsx';
import { UpcomingPayments } from '../components/upcoming-payments.tsx';

export const DashboardPage = memo(() => {
  const upsert = useSubscriptionUpsert();

  return (
    <DefaultLayout
      header={
        <DefaultLayoutHeader actions={<AddSubscriptionButton />}>
          <TagSelect />
        </DefaultLayoutHeader>
      }
      drawerContent={<SubscriptionUpsert />}
      drawerTitle={`${upsert.state.mode === 'update' ? 'Update' : 'Insert'} Subscription`}>
      <div
        className={cn(
          `grid flex-1 grid-flow-row auto-rows-[50%] grid-cols-1 gap-4 lg:grid-cols-2`,
        )}>
        <ExpensesPerMonth />

        <UpcomingPayments />
      </div>
    </DefaultLayout>
  );
});
