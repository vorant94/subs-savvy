import { cn } from '@/ui/utils/cn.ts';
import { useContext, type FC } from 'react';
import { SubscriptionUpsertContext } from './SubscriptionUpsert.tsx';

export const SubscriptionListItem: FC = () => {
  const { open } = useContext(SubscriptionUpsertContext);

  return (
    <div
      onClick={() => open(true)}
      className={cn(
        `min-w-60 min-h-40 bg-yellow-500 flex items-center justify-center`,
      )}>
      sub
    </div>
  );
};
