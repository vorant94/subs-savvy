import { db } from '@/db/db.ts';
import {
  insertSubscriptionSchema,
  subscriptionSchema,
  updateSubscriptionSchema,
  type InsertSubscriptionModel,
  type SubscriptionModel,
  type UpdateSubscriptionModel,
} from './subscription.model.ts';

export async function findSubscriptions(): Promise<Array<SubscriptionModel>> {
  const raws = await db.subscriptions.toArray();

  return raws.map((raw) => subscriptionSchema.parse(raw));
}

export async function getSubscription(id: number): Promise<SubscriptionModel> {
  const raw = await db.subscriptions.get(id);
  if (!raw) {
    throw new Error(`Subscription not found!`);
  }

  return subscriptionSchema.parse(raw);
}

export async function insertSubscription(
  raw: InsertSubscriptionModel,
): Promise<SubscriptionModel> {
  const parsed = insertSubscriptionSchema.parse(raw);

  const id = await db.subscriptions.add(parsed);
  return await getSubscription(id);
}

export async function updateSubscription(
  raw: UpdateSubscriptionModel,
): Promise<SubscriptionModel> {
  const { id, ...rest } = updateSubscriptionSchema.parse(raw);

  await db.subscriptions.update(id, rest);
  return await getSubscription(id);
}

export async function deleteSubscription(id: number): Promise<void> {
  await db.subscriptions.delete(id);
}
