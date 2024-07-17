import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { categoryMock } from '../../categories/models/category.mock.ts';
import { db } from '../../db/globals/db.ts';
import { cleanUpDb } from '../../db/utils/clean-up-db.ts';
import { populateDb } from '../../db/utils/populate-db.ts';
import {
  monthlySubscription,
  yearlySubscription,
} from './subscription.mock.ts';
import type { SubscriptionModel } from './subscription.model.ts';
import {
  deleteSubscription,
  findSubscriptions,
  insertSubscription,
  insertSubscriptions,
  updateSubscription,
} from './subscription.table.ts';

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

  it('should throw if there are subscriptions with non-existing categories', async () => {
    await db.categories.delete(categoryMock.id);

    expect(async () => await findSubscriptions()).rejects.toThrowError(
      /Category with id 1 not found!/,
    );
  });

  it('should update subscription', async () => {
    const subscriptionToUpdate = {
      ...monthlySubscription,
      price: 10,
    } satisfies SubscriptionModel;

    await updateSubscription(subscriptionToUpdate);

    const { category: _, ...expected } = {
      ...subscriptionToUpdate,
      categoryId: subscriptionToUpdate.category.id,
    };
    expect(await db.subscriptions.get(subscriptionToUpdate.id)).toEqual(
      expected,
    );
  });

  it(`should throw on update if subscription category doesn't exist`, async () => {
    const subscriptionToUpdate = {
      ...monthlySubscription,
      price: 10,
      category: {
        ...monthlySubscription.category,
        id: 7,
      },
    } satisfies SubscriptionModel;

    await expect(
      async () => await updateSubscription(subscriptionToUpdate),
    ).rejects.toThrowError(/Category with id 7 not found!/);
  });

  it('should delete subscription', async () => {
    const subscription = {
      ...monthlySubscription,
    } satisfies SubscriptionModel;

    await deleteSubscription(subscription.id);

    expect(await db.subscriptions.get(subscription.id)).toBeFalsy();
  });
});

describe('without data', () => {
  beforeEach(async () => await populateDb(undefined, [categoryMock]));

  afterEach(async () => await cleanUpDb());

  it('should insert subscription', async () => {
    const { id: _, ...subscriptionToInsert } = {
      ...monthlySubscription,
    } satisfies SubscriptionModel;

    const { id } = await insertSubscription(subscriptionToInsert);

    const { category: __, ...expected } = {
      id,
      ...subscriptionToInsert,
      categoryId: subscriptionToInsert.category.id,
    };
    expect(await db.subscriptions.get(id)).toEqual(expected);
  });

  it('should insert subscriptions', async () => {
    const subscriptionsToInsert = [monthlySubscription, yearlySubscription].map(
      ({ id: _, ...subscriptionToInsert }) => subscriptionToInsert,
    );

    await insertSubscriptions(subscriptionsToInsert);

    expect((await db.subscriptions.toArray()).length).toEqual(
      subscriptionsToInsert.length,
    );
  });

  it(`should throw on insert if subscription category doesn't exist`, async () => {
    const { id: _, ...subscriptionToInsert } = {
      ...monthlySubscription,
      category: {
        ...monthlySubscription.category,
        id: 7,
      },
    } satisfies SubscriptionModel;

    await expect(
      async () => await insertSubscription(subscriptionToInsert),
    ).rejects.toThrowError(/Category with id 7 not found!/);
  });
});
