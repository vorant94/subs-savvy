import {
  act,
  renderHook,
  waitFor,
  type RenderHookResult,
} from '@testing-library/react';
import type { FC, PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { category } from '../../categories/models/category.mock.ts';
import { cleanUpDb } from '../../db/utils/clean-up-db.ts';
import { populateDb } from '../../db/utils/populate-db.ts';
import { subscriptions } from '../models/subscription.mock.ts';
import {
  SubscriptionsProvider,
  useSubscriptions,
  type UseSubscriptions,
} from './use-subscriptions.tsx';

describe('useSubscriptions', () => {
  let screen: RenderHookResult<UseSubscriptions, void>;
  let hook: RenderHookResult<UseSubscriptions, void>['result'];

  beforeEach(() => {
    screen = renderHook<UseSubscriptions, void>(() => useSubscriptions(), {
      wrapper,
    });

    hook = screen.result;
  });

  beforeEach(async () => await populateDb(subscriptions));

  afterEach(async () => await cleanUpDb());

  it('should fetch subscriptions and categories', async () => {
    await Promise.all([
      waitFor(() =>
        expect(
          hook.current.selectedCategory,
          'have initially no selected category',
        ).toBeFalsy(),
      ),
      waitFor(() =>
        expect(
          hook.current.categories.length,
          'have initially one populated category',
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

  it('should filter out subscriptions based on selected category', async () => {
    await Promise.all([
      waitFor(() =>
        expect(
          hook.current.selectedCategory,
          'have initially no selected category',
        ).toBeFalsy(),
      ),
      waitFor(() =>
        expect(
          hook.current.categories.length,
          'have initially one populated category',
        ).toEqual(1),
      ),
      waitFor(() =>
        expect(
          hook.current.subscriptions.length,
          'have initially two populated subscriptions',
        ).toEqual(2),
      ),
    ]);

    act(() => hook.current.selectCategory(`${category.id}`));

    await Promise.all([
      waitFor(() =>
        expect(
          hook.current.selectedCategory?.id,
          'selected category to be there',
        ).toEqual(category.id),
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
        subscription.category?.id === hook.current.selectedCategory?.id,
        'all left subscriptions should have selected category in it',
      ).toBeTruthy();
    }

    act(() => hook.current.selectCategory(null));

    await Promise.all([
      waitFor(() =>
        expect(
          hook.current.selectedCategory,
          'selected category to not be there',
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
