import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../db/globals/db.ts';
import { cleanUpDb } from '../../db/utils/clean-up-db.ts';
import { populateDb } from '../../db/utils/populate-db.ts';
import { subscriptions } from '../../subscriptions/models/subscription.mock.ts';
import { category as categoryMock } from './category.mock.ts';
import { deleteCategory } from './category.table.ts';

describe('category.table', () => {
  describe('with data', () => {
    beforeEach(async () => await populateDb(subscriptions));

    afterEach(async () => await cleanUpDb());

    it('should delete category and unlink all linked to it subscriptions', async () => {
      const category = categoryMock;

      await deleteCategory(category.id);

      expect(await db.categories.get(category.id)).toBeFalsy();
      expect(
        (await db.subscriptions.where({ categoryId: category.id }).toArray())
          .length,
      ).toEqual(0);
    });
  });
});
