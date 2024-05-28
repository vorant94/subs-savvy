import type {
  InsertSubscriptionModel,
  SubscriptionModel,
} from '@/subscriptions/models/subscription.model.ts';
import Dexie, { type Table } from 'dexie';

export const db = new Dexie('subs-savvy') as Dexie & {
  subscriptions: Table<RawSubscriptionModel>;
};

db.version(1).stores({
  subscriptions: '++id',
});

// This is needed because Dexie doesn't distinguish between mutation and query models
// hence requiring to pass id while creating row even though it is auto-generating under the hood
type RawSubscriptionModel = InsertSubscriptionModel &
  Partial<Pick<SubscriptionModel, 'id'>>;
