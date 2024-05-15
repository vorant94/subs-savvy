import {
  SplitLayout,
  SplitLayoutContextProvider,
  SplitLayoutHeader,
} from '@/ui/layouts/SplitLayout.tsx';
import { type FC } from 'react';
import { SubscriptionList } from '../components/SubscriptionList.tsx';
import {
  SubscriptionUpsert,
  SubscriptionUpsertContext,
  SubscriptionUpsertContextProvider,
} from '../components/SubscriptionUpsert.tsx';

export const SubscriptionsPage: FC = () => {
  return (
    <SplitLayoutContextProvider>
      <SubscriptionUpsertContextProvider>
        <SubscriptionUpsertContext.Consumer>
          {({ open }) => (
            <SplitLayout
              header={
                <SplitLayoutHeader
                  actions={<button onClick={() => open()}>add sub</button>}
                />
              }
              left={<SubscriptionList />}
              right={<SubscriptionUpsert />}
            />
          )}
        </SubscriptionUpsertContext.Consumer>
      </SubscriptionUpsertContextProvider>
    </SplitLayoutContextProvider>
  );
};
