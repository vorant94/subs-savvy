import {
  SplitLayout,
  SplitLayoutContextProvider,
  SplitLayoutHeader,
} from '@/ui/layouts/split.layout.tsx';
import { type FC } from 'react';
import { SubscriptionList } from '../components/subscription-list.tsx';
import {
  SubscriptionUpsert,
  SubscriptionUpsertStateContext,
  SubscriptionUpsertStateProvider,
} from '../components/subscription-upsert.tsx';

export const SubscriptionsPage: FC = () => {
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
              left={<SubscriptionList />}
              right={<SubscriptionUpsert />}
            />
          )}
        </SubscriptionUpsertStateContext.Consumer>
      </SubscriptionUpsertStateProvider>
    </SplitLayoutContextProvider>
  );
};
