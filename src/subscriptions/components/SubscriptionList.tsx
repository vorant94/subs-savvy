import { SplitLayoutContext } from '@/ui/layouts/SplitLayout.tsx';
import { cn } from '@/ui/utils/cn.ts';
import { useContext, type FC } from 'react';
import { SubscriptionListItem } from './SubscriptionListItem.tsx';

const subs = Array.from(new Array(5));

export const SubscriptionList: FC = () => {
  const { isSplit } = useContext(SplitLayoutContext);

  return (
    <div className={cn(`grid gap-4`, isSplit ? `grid-cols-2` : `grid-cols-4`)}>
      {subs.map((_, index) => (
        <SubscriptionListItem key={index} />
      ))}
    </div>
  );
};
