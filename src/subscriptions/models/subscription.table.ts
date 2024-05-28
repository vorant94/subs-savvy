import { db } from '@/db/db.ts';
import {
  insertSubscriptionSchema,
  subscriptionSchema,
  type SubscriptionModel,
} from './subscription.model.ts';

export async function findSubscriptions(): Promise<SubscriptionModel[]> {
  const raws = await db.subscriptions.toArray();

  return raws.map((raw) => subscriptionSchema.parse(raw));
}

export async function insertSubscription(
  form: HTMLFormElement,
): Promise<string> {
  const formData = new FormData(form);
  const raw = Object.fromEntries(formData);
  const parsed = insertSubscriptionSchema.parse(raw);

  return await db.subscriptions.add(parsed);
}
