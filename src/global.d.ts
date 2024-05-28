import type {
  InsertSubscriptionModel,
  SubscriptionModel,
} from '@/subscriptions/models/subscription.model.ts';
import 'dexie';
import { Table } from 'dexie';

declare module 'dexie' {
  // This is needed because Dexie doesn't distinguish between mutation and query models
  // hence requiring to pass id while creating row even though it is auto-generating under the hood
  type RawSubscriptionModel = InsertSubscriptionModel &
    Partial<Pick<SubscriptionModel, 'id'>>;

  interface Dexie {
    subscriptions: Table<RawSubscriptionModel>;
  }
}
