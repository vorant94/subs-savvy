import { cn } from '@/ui/utils/cn.ts';
import { memo } from 'react';
import { useSubscriptions } from '../hooks/use-subscriptions.tsx';
import { SubscriptionListItem } from './subscription-list-item.tsx';

export const SubscriptionList = memo(() => {
  const { subscriptions } = useSubscriptions();

  return (
    <div className={cn(`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4`)}>
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
