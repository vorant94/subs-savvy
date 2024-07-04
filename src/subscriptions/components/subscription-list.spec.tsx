import { db } from '@/db/globals/db.ts';
import { MantineProvider } from '@mantine/core';
import { render, type RenderResult, waitFor } from '@testing-library/react';
import type { FC, PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SubscriptionsProvider } from '../hooks/use-subscriptions';
import { subscriptions } from '../models/subscription.mock.ts';
import { SubscriptionList } from './subscription-list';

describe('SubscriptionList', () => {
  let screen: RenderResult;

  beforeEach(() => {
    screen = render(<SubscriptionList />, { wrapper });
  });

  describe('without subscriptions', () => {
    it('should show no subscription placeholder', async () => {
      await waitFor(() =>
        expect(screen.queryByText('No Subscriptions')).toBeVisible(),
      );
    });
  });

  describe('with subscriptions', () => {
    beforeEach(async () => await populateDb());

    afterEach(async () => await cleanUpDb());

    it('should hide no subscription placeholder', async () => {
      await waitFor(() =>
        expect(screen.queryByText('No Subscriptions')).not.toBeInTheDocument(),
      );
    });
  });
});

const wrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <MantineProvider>
      <SubscriptionsProvider>{children}</SubscriptionsProvider>
    </MantineProvider>
  );
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
