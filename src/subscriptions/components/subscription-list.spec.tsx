import { cleanUpDb } from '@/db/utils/clean-up-db.ts';
import { populateDb } from '@/db/utils/populate-db.ts';
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
    beforeEach(async () => await populateDb(subscriptions));

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
