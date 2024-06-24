import { forwardRef, memo } from 'react';
import type { UpsertSubscriptionModel } from '../models/subscription.model.ts';

export const SubscriptionsUpsertTable = memo(
  forwardRef<HTMLFormElement, SubscriptionsUpsertTableProps>(() => {
    return <>upsert table</>;
  }),
);

export interface SubscriptionsUpsertTableProps {
  subscriptions: Array<UpsertSubscriptionModel>;
}
