import type { SubscriptionModel } from '@/subscriptions/models/subscription.model.tsx';
import type { TagModel } from '@/tags/models/tag.model.ts';
import Dexie, { type EntityTable } from 'dexie';

export const db = new Dexie('subs-savvy') as Dexie & {
  subscriptions: EntityTable<SubscriptionModel, 'id'>;
  tags: EntityTable<TagModel, 'id'>;
};

db.version(2).stores({
  subscriptions: '++id',
  tags: '++id',
});
