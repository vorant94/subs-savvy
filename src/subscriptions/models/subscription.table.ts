import { db } from '@/db/globals/db.ts';
import type { UpsertSubscriptionTagModel } from '../models/subscription-tag.model.ts';
import {
  insertSubscriptionSchema,
  subscriptionSchema,
  updateSubscriptionSchema,
  type InsertSubscriptionModel,
  type SubscriptionModel,
  type UpdateSubscriptionModel,
} from './subscription.model.ts';

export function findSubscriptions(): Promise<Array<SubscriptionModel>> {
  return db.transaction(
    'r',
    db.subscriptions,
    db.subscriptionsTags,
    db.tags,
    async () => {
      const raws = await db.subscriptions.toArray();

      return await Promise.all(
        raws.map(async (raw) => {
          const tagsLinks = await db.subscriptionsTags
            .where({ subscriptionId: raw.id })
            .toArray();

          const tags = await Promise.all(
            tagsLinks.map(async (link) => db.tags.get(link.tagId)),
          );

          return subscriptionSchema.parse({ ...raw, tags });
        }),
      );
    },
  );
}

export function insertSubscription(
  raw: InsertSubscriptionModel,
): Promise<SubscriptionModel> {
  return db.transaction(
    'rw',
    db.subscriptions,
    db.subscriptionsTags,
    db.tags,
    () => insertSubscription(raw),
  );
}

export function insertSubscriptions(
  raw: Array<InsertSubscriptionModel>,
): Promise<Array<SubscriptionModel>> {
  return db.transaction(
    `rw`,
    db.subscriptions,
    db.subscriptionsTags,
    db.tags,
    () => Promise.all(raw.map((raw) => _insertSubscription(raw))),
  );
}

export function updateSubscription(
  raw: UpdateSubscriptionModel,
): Promise<SubscriptionModel> {
  return db.transaction(
    'rw',
    db.subscriptions,
    db.subscriptionsTags,
    db.tags,
    async () => {
      const { id, tags, ...rest } = updateSubscriptionSchema.parse(raw);

      await db.subscriptionsTags.where({ subscriptionId: id }).delete();

      await Promise.all(
        tags.map(async (tag) => {
          const link: UpsertSubscriptionTagModel = {
            tagId: tag.id,
            subscriptionId: id,
          };

          await db.subscriptionsTags.add(link);
        }),
      );

      await db.subscriptions.update(id, rest);

      return _getSubscription(id);
    },
  );
}

export function deleteSubscription(id: number): Promise<void> {
  return db.transaction(
    'rw',
    db.subscriptions,
    db.subscriptionsTags,
    async () => {
      await Promise.all([
        db.subscriptions.delete(id),
        db.subscriptionsTags.where({ subscriptionId: id }).delete(),
      ]);
    },
  );
}

async function _getSubscription(id: number): Promise<SubscriptionModel> {
  const raw = await db.subscriptions.get(id);
  if (!raw) {
    throw new Error(`Subscription not found!`);
  }

  const tagsLinks = await db.subscriptionsTags
    .where({ subscriptionId: raw.id })
    .toArray();

  const tags = await Promise.all(
    tagsLinks.map(async (link) => db.tags.get(link.tagId)),
  );

  return subscriptionSchema.parse({ ...raw, tags });
}

async function _insertSubscription(
  raw: InsertSubscriptionModel,
): Promise<SubscriptionModel> {
  const { tags, ...rest } = insertSubscriptionSchema.parse(raw);

  const id = await db.subscriptions.add(rest);

  await Promise.all(
    tags.map(async (tag) => {
      const link: UpsertSubscriptionTagModel = {
        tagId: tag.id,
        subscriptionId: id,
      };

      await db.subscriptionsTags.add(link);
    }),
  );

  return _getSubscription(id);
}
