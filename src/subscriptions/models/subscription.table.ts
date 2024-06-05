import { db } from '@/db/globals/db.ts';
import type { RawFormValue } from '@/form/types/raw-form-value.ts';
import { format } from 'date-fns';
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
  raw: RawFormValue<InsertSubscriptionModel>,
): Promise<SubscriptionModel> {
  const parsed = insertSubscriptionSchema.parse(raw);

  const id = await db.subscriptions.add(parsed);
  return await getSubscription(id);
}

export async function updateSubscription(
  raw: RawFormValue<UpdateSubscriptionModel>,
): Promise<SubscriptionModel> {
  const { id, ...rest } = updateSubscriptionSchema.parse(raw);

  await db.subscriptions.update(id, rest);
  return await getSubscription(id);
}

export async function deleteSubscription(id: number): Promise<void> {
  await db.subscriptions.delete(id);
}

export function mapSubscriptionToRawValue(
  subscription: SubscriptionModel,
): RawFormValue<SubscriptionModel> {
  return {
    ...subscription,
    id: `${subscription.id ?? ''}`,
    description: `${subscription.description ?? ''}`,
    price: `${subscription.price ?? ''}`,
    startedAt: subscription.startedAt
      ? format(subscription.startedAt, 'yyyy-MM-dd')
      : '',
    endedAt: subscription.endedAt
      ? format(subscription.endedAt, 'yyyy-MM-dd')
      : '',
  };
}
