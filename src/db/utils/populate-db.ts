import type { SubscriptionModel } from '@/subscriptions/models/subscription.model.ts';
import { db } from '../globals/db.ts';

// utility function for tests only
export async function populateDb(
  subscriptions: ReadonlyArray<SubscriptionModel>,
): Promise<void> {
  await db.transaction(
    `rw`,
    db.subscriptionsTags,
    db.subscriptions,
    db.tags,
    async () => {
      for (const { tags, ...subscription } of subscriptions) {
        const tagPuts = tags.map((tag) => db.tags.put(tag));
        const tagLinkPuts = tags.map((tag) =>
          db.subscriptionsTags.put({
            tagId: tag.id,
            subscriptionId: subscription.id,
          }),
        );

        await Promise.all([
          ...tagPuts,
          db.subscriptions.put(subscription),
          ...tagLinkPuts,
        ]);
      }
    },
  );
}
