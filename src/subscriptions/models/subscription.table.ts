import type { CategoryModel } from '../../categories/models/category.model.ts';
import { db } from '../../db/globals/db.ts';
import {
  insertSubscriptionSchema,
  subscriptionSchema,
  updateSubscriptionSchema,
  type InsertSubscriptionModel,
  type SubscriptionModel,
  type UpdateSubscriptionModel,
} from './subscription.model.ts';

export function findSubscriptions(): Promise<Array<SubscriptionModel>> {
  return db.transaction('r', db.subscriptions, db.categories, async () => {
    const raws = await db.subscriptions.orderBy('price').reverse().toArray();

    return await Promise.all(
      raws.map(async ({ categoryId, ...raw }) => {
        let category: CategoryModel | null = null;
        if (categoryId) {
          category = (await db.categories.get(categoryId)) ?? null;

          if (!category) {
            throw new Error(`Category not found!`);
          }
        }

        return subscriptionSchema.parse({ ...raw, category });
      }),
    );
  });
}

export function insertSubscription(
  raw: InsertSubscriptionModel,
): Promise<SubscriptionModel> {
  return db.transaction('rw', db.subscriptions, db.categories, () =>
    _insertSubscription(raw),
  );
}

export function insertSubscriptions(
  raw: Array<InsertSubscriptionModel>,
): Promise<Array<SubscriptionModel>> {
  return db.transaction(`rw`, db.subscriptions, db.categories, () =>
    Promise.all(raw.map((raw) => _insertSubscription(raw))),
  );
}

export function updateSubscription(
  raw: UpdateSubscriptionModel,
): Promise<SubscriptionModel> {
  return db.transaction('rw', db.subscriptions, db.categories, async () => {
    const { id, category, ...rest } = updateSubscriptionSchema.parse(raw);

    await db.subscriptions.update(id, {
      ...rest,
      categoryId: category?.id ?? null,
    });

    return _getSubscription(id);
  });
}

export function deleteSubscription(id: number): Promise<void> {
  return db.transaction('rw', db.subscriptions, async () => {
    await db.subscriptions.delete(id);
  });
}

async function _getSubscription(id: number): Promise<SubscriptionModel> {
  const raw = await db.subscriptions.get(id);
  if (!raw) {
    throw new Error(`Subscription not found!`);
  }

  let category: CategoryModel | null = null;
  if (raw.categoryId) {
    category = (await db.categories.get(raw.categoryId)) ?? null;

    if (!category) {
      throw new Error(`Category not found!`);
    }
  }

  return subscriptionSchema.parse({ ...raw, category });
}

async function _insertSubscription(
  raw: InsertSubscriptionModel,
): Promise<SubscriptionModel> {
  const { category, ...rest } = insertSubscriptionSchema.parse(raw);

  const id = await db.subscriptions.add({ ...rest, categoryId: category?.id });
  return _getSubscription(id);
}
