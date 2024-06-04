import { AddSubscriptionButton } from '@/subscriptions/components/add-subscription-button.tsx';
import { SubscriptionGraph } from '@/subscriptions/components/subscription-graph.tsx';
import { SubscriptionUpsert } from '@/subscriptions/components/subscription-upsert.tsx';
import { SplitLayout, SplitLayoutHeader } from '@/ui/layouts/split.layout.tsx';
import { cn } from '@/ui/utils/cn.ts';
import { memo } from 'react';

export const DashboardPage = memo(() => {
  return (
    <SplitLayout
      header={<SplitLayoutHeader actions={<AddSubscriptionButton />} />}
      left={
        <div className={cn(`grid flex-1 grid-rows-2 items-start gap-4`)}>
          <SubscriptionGraph />
        </div>
      }
      right={<SubscriptionUpsert />}
    />
  );
});
