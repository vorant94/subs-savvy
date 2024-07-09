import { db } from '@/db/globals/db.ts';
import { cleanUpDb } from '@/db/utils/clean-up-db.ts';
import { populateDb } from '@/db/utils/populate-db.ts';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { monthlySubscription, subscriptions } from './subscription.mock.ts';
import { deleteSubscription } from './subscription.table.ts';

describe('subscription.table', () => {
  describe('with data', () => {
    beforeEach(async () => await populateDb(subscriptions));

    afterEach(async () => await cleanUpDb());

    it('should delete subscription with all its links', async () => {
      const subscription = monthlySubscription;

      await deleteSubscription(subscription.id);

      expect(await db.subscriptions.get(subscription.id)).toBeFalsy();
      expect(
        (
          await db.subscriptionsTags
            .where({ subscriptionId: subscription.id })
            .toArray()
        ).length,
      ).toEqual(0);
    });
  });
});
