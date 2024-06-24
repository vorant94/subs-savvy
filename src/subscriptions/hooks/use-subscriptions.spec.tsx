import { db } from '@/db/globals/db.ts';
import { tag } from '@/tags/models/tag.mock.ts';
import {
  act,
  renderHook,
  waitFor,
  type RenderHookResult,
} from '@testing-library/react';
import type { FC, PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  SubscriptionsProvider,
  useSubscriptions,
  type UseSubscriptions,
} from '../hooks/use-subscriptions.tsx';
import { subscriptions } from '../models/subscription.mock.ts';

describe('useSubscriptions', () => {
  let renderResult: RenderHookResult<UseSubscriptions, void>;
  let hook: RenderHookResult<UseSubscriptions, void>['result'];

  beforeEach(() => {
    renderResult = renderHook<UseSubscriptions, void>(
      () => useSubscriptions(),
      {
        wrapper,
      },
    );

    hook = renderResult.result;
  });

  beforeEach(async () => await populateDb());

  afterEach(async () => await cleanUpDb());

  it('should fetch subscriptions and tags', async () => {
    await Promise.all([
      waitFor(() =>
        expect(
          hook.current.selectedTag,
          'have initially no selected tag',
        ).toBeFalsy(),
      ),
      waitFor(() =>
        expect(
          hook.current.tags.length,
          'have initially one populated tag',
        ).toEqual(1),
      ),
      waitFor(() =>
        expect(
          hook.current.subscriptions.length,
          'have initially two populated subscriptions',
        ).toEqual(2),
      ),
    ]);
  });

  it('should filter out subscriptions based on selected tag', async () => {
    await Promise.all([
      waitFor(() =>
        expect(
          hook.current.selectedTag,
          'have initially no selected tag',
        ).toBeFalsy(),
      ),
      waitFor(() =>
        expect(
          hook.current.tags.length,
          'have initially one populated tag',
        ).toEqual(1),
      ),
      waitFor(() =>
        expect(
          hook.current.subscriptions.length,
          'have initially two populated subscriptions',
        ).toEqual(2),
      ),
    ]);

    act(() => hook.current.selectTag(`${tag.id}`));

    await Promise.all([
      waitFor(() =>
        expect(
          hook.current.selectedTag?.id,
          'selected tag to be there',
        ).toEqual(tag.id),
      ),
      waitFor(() =>
        expect(
          hook.current.subscriptions.length,
          'decrease amount of filtered subscriptions',
        ).toEqual(1),
      ),
    ]);

    for (const subscription of hook.current.subscriptions) {
      expect(
        subscription.tags.find(
          (tag) => tag.id === hook.current.selectedTag?.id,
        ),
        'all left subscriptions should have selected tag in it',
      ).toBeTruthy();
    }

    act(() => hook.current.selectTag(null));

    await Promise.all([
      waitFor(() =>
        expect(
          hook.current.selectedTag,
          'selected tag to not be there',
        ).toBeFalsy(),
      ),
      waitFor(() =>
        expect(
          hook.current.subscriptions.length,
          'restore amount of filtered subscriptions',
        ).toEqual(2),
      ),
    ]);
  });
});

const wrapper: FC<PropsWithChildren> = ({ children }) => {
  return <SubscriptionsProvider>{children}</SubscriptionsProvider>;
};

async function populateDb(): Promise<void> {
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

async function cleanUpDb(): Promise<void> {
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