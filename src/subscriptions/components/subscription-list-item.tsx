import { cn } from '@/ui/utils/cn.ts';
import { memo, useContext } from 'react';
import type { SubscriptionModel } from '../models/subscription.model.ts';
import { SubscriptionUpsertStateContext } from './subscription-upsert.tsx';

export const SubscriptionListItem = memo(
  ({ subscription }: SubscriptionListItemProps) => {
    const upsert = useContext(SubscriptionUpsertStateContext);

    return (
      <div
        onClick={() => upsert.dispatch({ type: 'open', subscription })}
        className={cn(
          `min-w-60 min-h-40 bg-yellow-500 flex items-center justify-center`,
        )}>
        {subscription.name}
      </div>
    );
  },
);

export interface SubscriptionListItemProps {
  subscription: SubscriptionModel;
}
