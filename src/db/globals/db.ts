import type { SubscriptionModel } from '@/subscriptions/models/subscription.model.ts';
import Dexie, { type EntityTable } from 'dexie';

export const db = new Dexie('subs-savvy') as Dexie & {
  subscriptions: EntityTable<SubscriptionModel, 'id'>;
};

db.version(1).stores({
  subscriptions: '++id',
});
