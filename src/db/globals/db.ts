import type { CategoryModel } from '@/categories/models/category.model.ts';
import type { SubscriptionModel } from '@/subscriptions/models/subscription.model.ts';
import Dexie, { type EntityTable } from 'dexie';

export const dbVersion = 5;

export const db = new Dexie('subs-savvy') as Db;

export interface Db extends Dexie {
  subscriptions: EntityTable<
    Omit<SubscriptionModel, 'category'> & {
      categoryId?: CategoryModel['id'] | null;
    },
    'id'
  >;
  categories: EntityTable<CategoryModel, 'id'>;
}

db.version(dbVersion).stores({
  subscriptions: '++id,price,categoryId',
  categories: '++id',
});
