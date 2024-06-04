import {
  SplitLayout,
  SplitLayoutContextProvider,
  SplitLayoutHeader,
} from '@/ui/layouts/split.layout.tsx';
import { cn } from '@/ui/utils/cn.ts';
import { memo } from 'react';
import { SubscriptionGraph } from '../components/subscription-graph.tsx';
import { SubscriptionList } from '../components/subscription-list.tsx';
import {
  SubscriptionUpsert,
  SubscriptionUpsertStateContext,
  SubscriptionUpsertStateProvider,
} from '../components/subscription-upsert.tsx';

export const SubscriptionsPage = memo(() => {
  return (
    <SplitLayoutContextProvider>
      <SubscriptionUpsertStateProvider>
        <SubscriptionUpsertStateContext.Consumer>
          {(upsert) => (
            <SplitLayout
              header={
                <SplitLayoutHeader
                  actions={
                    <button onClick={() => upsert.dispatch({ type: 'open' })}>
                      add sub
                    </button>
                  }
                />
              }
              left={
                <div
                  className={cn(`grid flex-1 grid-rows-2 items-start gap-4`)}>
                  <SubscriptionGraph />
                  <SubscriptionList />
                </div>
              }
              right={<SubscriptionUpsert />}
            />
          )}
        </SubscriptionUpsertStateContext.Consumer>
      </SubscriptionUpsertStateProvider>
    </SplitLayoutContextProvider>
  );
});
