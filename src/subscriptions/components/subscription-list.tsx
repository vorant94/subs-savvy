import { SplitLayoutContext } from '@/ui/layouts/split.layout.tsx';
import { cn } from '@/ui/utils/cn.ts';
import { useLiveQuery } from 'dexie-react-hooks';
import { memo, useContext } from 'react';
import { findSubscriptions } from '../models/subscription.table.ts';
import { SubscriptionListItem } from './subscription-list-item.tsx';

export const SubscriptionList = memo(() => {
  const layout = useContext(SplitLayoutContext);
  const subscriptions = useLiveQuery(() => findSubscriptions());

  return (
    <div
      className={cn(
        `grid gap-4`,
        layout.isSplit ? `grid-cols-2` : `grid-cols-4`,
      )}>
      {subscriptions && subscriptions.length > 0 ? (
        subscriptions.map((subscription) => (
          <SubscriptionListItem
            key={subscription.id}
            subscription={subscription}
          />
        ))
      ) : (
        <div>No Subscriptions</div>
      )}
    </div>
  );
});
