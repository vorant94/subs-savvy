import type { SubscriptionTagModel } from '@/subscriptions/models/subscription-tag.model.ts';
import type { SubscriptionModel } from '@/subscriptions/models/subscription.model.tsx';
import type { TagModel } from '@/tags/models/tag.model.ts';
import Dexie, { type EntityTable } from 'dexie';

export const db = new Dexie('subs-savvy') as Dexie & {
  subscriptions: EntityTable<Omit<SubscriptionModel, 'tags'>, 'id'>;
  tags: EntityTable<TagModel, 'id'>;
  subscriptionsTags: EntityTable<
    SubscriptionTagModel,
    'subscriptionId' | 'tagId'
  >;
};

db.version(3).stores({
  subscriptions: '++id',
  tags: '++id',
  subscriptionsTags: '[subscriptionId+tagId],subscriptionId,tagId',
});
