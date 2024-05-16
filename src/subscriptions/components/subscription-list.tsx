import { SplitLayoutContext } from '@/ui/layouts/split.layout.tsx';
import { cn } from '@/ui/utils/cn.ts';
import { useContext, type FC } from 'react';
import { subscriptionsMock } from '../models/subscription.mock.ts';
import { SubscriptionListItem } from './subscription-list-item.tsx';

export const SubscriptionList: FC = () => {
  const layout = useContext(SplitLayoutContext);

  return (
    <div
      className={cn(
        `grid gap-4`,
        layout.isSplit ? `grid-cols-2` : `grid-cols-4`,
      )}>
      {subscriptionsMock.map((subscription) => (
        <SubscriptionListItem
          key={subscription.id}
          subscription={subscription}
        />
      ))}
    </div>
  );
};
