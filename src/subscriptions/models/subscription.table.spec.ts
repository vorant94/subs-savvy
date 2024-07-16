import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../db/globals/db.ts';
import { cleanUpDb } from '../../db/utils/clean-up-db.ts';
import { populateDb } from '../../db/utils/populate-db.ts';
import {
  monthlySubscription,
  yearlySubscription,
} from './subscription.mock.ts';
import type { SubscriptionModel } from './subscription.model.ts';
import { deleteSubscription, findSubscriptions } from './subscription.table.ts';

describe('subscription.table', () => {
  describe('with data', () => {
    beforeEach(
      async () => await populateDb([monthlySubscription, yearlySubscription]),
    );

    afterEach(async () => await cleanUpDb());

    it('should find subscriptions', async () => {
      const subscriptions = [
        monthlySubscription,
        yearlySubscription,
      ] satisfies ReadonlyArray<SubscriptionModel>;

      expect(await findSubscriptions()).toEqualIgnoreOrder(subscriptions);
    });

    it('should delete subscription', async () => {
      const subscription = {
        ...monthlySubscription,
      } satisfies SubscriptionModel;

      await deleteSubscription(subscription.id);

      expect(await db.subscriptions.get(subscription.id)).toBeFalsy();
    });
  });
});
