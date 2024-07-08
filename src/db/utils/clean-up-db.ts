import { db } from '../globals/db.ts';

// utility function for tests only
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
