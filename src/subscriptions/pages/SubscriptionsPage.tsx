import { SplitLayout, SplitLayoutHeader } from '@/ui/layouts/SplitLayout.tsx';
import { useState, type FC } from 'react';
import { SubscriptionList } from '../components/SubscriptionList.tsx';
import { SubscriptionUpsert } from '../components/SubscriptionUpsert.tsx';

export const SubscriptionsPage: FC = function () {
  const [isUpsertActive, setIsUpsertActive] = useState(false);

  const header = (
    <SplitLayoutHeader
      actions={
        <div>
          <button onClick={() => setIsUpsertActive(!isUpsertActive)}>
            add sub
          </button>
        </div>
      }
    />
  );

  return (
    <SplitLayout
      header={header}
      left={<SubscriptionList />}
      right={isUpsertActive ? <SubscriptionUpsert /> : null}
    />
  );
};
