import { db } from '@/db/globals/db.ts';
import { cleanUpDb } from '@/db/utils/clean-up-db.ts';
import { populateDb } from '@/db/utils/populate-db.ts';
import { subscriptions } from '@/subscriptions/models/subscription.mock.ts';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { tag as tagMock } from './tag.mock';
import { deleteTag } from './tag.table.ts';

describe('tag.table', () => {
  describe('with data', () => {
    beforeEach(async () => await populateDb(subscriptions));

    afterEach(async () => await cleanUpDb());

    it('should delete tag with all its links', async () => {
      const tag = tagMock;

      await deleteTag(tag.id);

      expect(await db.tags.get(tag.id)).toBeFalsy();
      expect(
        (await db.subscriptionsTags.where({ tagId: tag.id }).toArray()).length,
      ).toEqual(0);
    });
  });
});
