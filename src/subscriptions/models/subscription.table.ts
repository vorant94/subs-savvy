import { db } from '@/db/globals/db.ts';
import {
  formDateFormat,
  type FormDateFormat,
} from '@/form/types/form-date-format.ts';
import type { RawFormValue } from '@/form/types/raw-form-value.ts';
import { format } from 'date-fns';
import {
  insertSubscriptionSchema,
  subscriptionSchema,
  updateSubscriptionSchema,
  type InsertSubscriptionModel,
  type SubscriptionModel,
  type UpdateSubscriptionModel,
} from './subscription.model.tsx';

export async function findSubscriptions(): Promise<Array<SubscriptionModel>> {
  const raws = await db.subscriptions.toArray();

  return await Promise.all(
    raws.map(async (raw) => {
      const tagsLinks = await db.subscriptionsTags
        .where({ subscriptionId: raw.id })
        .toArray();

      const tags = await Promise.all(
        tagsLinks.map(async (link) => db.subscriptionsTags.get(link.tagId)),
      );

      return subscriptionSchema.parse({ ...raw, tags });
    }),
  );
}

export async function getSubscription(id: number): Promise<SubscriptionModel> {
  const raw = await db.subscriptions.get(id);
  if (!raw) {
    throw new Error(`Subscription not found!`);
  }
  const tagsLinks = await db.subscriptionsTags
    .where({ subscriptionId: raw.id })
    .toArray();

  const tags = await Promise.all(
    tagsLinks.map(async (link) => db.subscriptionsTags.get(link.tagId)),
  );

  return subscriptionSchema.parse({ ...raw, tags });
}

export async function insertSubscription(
  raw: RawFormValue<InsertSubscriptionModel>,
): Promise<SubscriptionModel> {
  const { tags: _, ...rest } = insertSubscriptionSchema.parse(raw);

  const id = await db.transaction(
    'rw',
    db.subscriptions,
    db.subscriptionsTags,
    async () => {
      // TODO create subscription tag links
      return await db.subscriptions.add(rest);
    },
  );

  return await getSubscription(id);
}

export async function updateSubscription(
  raw: RawFormValue<UpdateSubscriptionModel>,
): Promise<SubscriptionModel> {
  const { id, tags: _, ...rest } = updateSubscriptionSchema.parse(raw);

  db.transaction('rw', db.subscriptions, db.subscriptionsTags, async () => {
    // TODO delete existing subscription tag links and create new ones
    await db.subscriptions.update(id, rest);
  });

  return await getSubscription(id);
}

export async function deleteSubscription(id: number): Promise<void> {
  await db.transaction(
    'rw',
    db.subscriptions,
    db.subscriptionsTags,
    async () => {
      await db.subscriptions.delete(id);
    },
  );
}

export function mapSubscriptionToRawValue(
  subscription: SubscriptionModel,
): RawFormValue<SubscriptionModel> {
  return {
    ...subscription,
    id: `${subscription.id ?? ''}`,
    description: `${subscription.description ?? ''}`,
    price: `${subscription.price ?? ''}`,
    startedAt: format(subscription.startedAt, formDateFormat) as FormDateFormat,
    endedAt: subscription.endedAt
      ? format(subscription.endedAt, formDateFormat)
      : '',
    cycle: {
      each: `${subscription.cycle.each}`,
      period: subscription.cycle.period,
    },
    // TODO actually map this stuff
    tags: [],
  };
}
