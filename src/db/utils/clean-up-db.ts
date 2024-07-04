import { db } from '../globals/db.ts';

export async function cleanUpDb(): Promise<void> {
  await db.transaction(
    'rw',
    db.subscriptionsTags,
    db.subscriptions,
    db.tags,
    async () => {
      await db.subscriptionsTags.clear();
      await db.subscriptions.clear();
      await db.tags.clear();
    },
  );
}
