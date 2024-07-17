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
import { useSubscriptions } from '../hooks/use-subscriptions';
import { useSubscriptionsMock } from '../hooks/use-subscriptions.mock.ts';
import {
  monthlySubscription,
  yearlySubscription,
} from '../models/subscription.mock.ts';
import { SubscriptionList } from './subscription-list';

vi.mock(import('../hooks/use-subscriptions.tsx'));

describe('SubscriptionList', () => {
  let screen: RenderResult;

  beforeEach(() => {
    screen = render(<SubscriptionList />, { wrapper });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('with data', () => {
    beforeAll(() => {
      vi.mocked(useSubscriptions).mockReturnValue({
        ...useSubscriptionsMock,
        subscriptions: [monthlySubscription, yearlySubscription],
      });
    });

    it.todo('should render list items');

    it('should hide no subscription placeholder', async () => {
      await waitFor(() =>
        expect(screen.queryByText('No Subscriptions')).not.toBeInTheDocument(),
      );
    });
  });

  describe('without data', () => {
    beforeAll(() => {
      vi.mocked(useSubscriptions).mockReturnValue({ ...useSubscriptionsMock });
    });

    it('should show no subscription placeholder', async () => {
      await waitFor(() =>
        expect(screen.queryByText('No Subscriptions')).toBeVisible(),
      );
    });
  });
});

const wrapper: FC<PropsWithChildren> = ({ children }) => {
  return <MantineProvider>{children}</MantineProvider>;
};
