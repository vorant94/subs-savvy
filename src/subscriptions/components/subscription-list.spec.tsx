import { MantineProvider } from '@mantine/core';
import { render, type RenderResult, waitFor } from '@testing-library/react';
import type { FC, PropsWithChildren } from 'react';
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { SubscriptionsProvider } from '../hooks/use-subscriptions';
import {
  monthlySubscription,
  yearlySubscription,
} from '../models/subscription.mock.ts';
import { findSubscriptions } from '../models/subscription.table.ts';
import { SubscriptionList } from './subscription-list';

vi.mock(import('../models/subscription.table.ts'));

describe('SubscriptionList', () => {
  let screen: RenderResult;

  beforeEach(() => {
    screen = render(<SubscriptionList />, { wrapper });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('without subscriptions', () => {
    beforeAll(() => {
      vi.mocked(findSubscriptions).mockResolvedValue([]);
    });

    it('should show no subscription placeholder', async () => {
      await waitFor(() =>
        expect(screen.queryByText('No Subscriptions')).toBeVisible(),
      );
    });
  });

  describe('with subscriptions', () => {
    beforeAll(() => {
      vi.mocked(findSubscriptions).mockResolvedValue([
        monthlySubscription,
        yearlySubscription,
      ]);
    });

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
