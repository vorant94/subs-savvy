import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { monthlySubscription } from '../models/subscription.mock.ts';
import type { SubscriptionModel } from '../models/subscription.model.ts';
import { isSubscriptionExpired } from './is-subscription-expired.ts';

describe(`compare by day`, () => {
  it('no endedAt', () => {
    const subscription = {
      ...monthlySubscription,
    } satisfies SubscriptionModel;
    const compareTo = dayjs(subscription.startedAt).add(1, 'day').toDate();

    expect(isSubscriptionExpired(subscription, compareTo)).toBeFalsy();
  });

  it('endedAt < compareTo', () => {
    const subscription = {
      ...monthlySubscription,
      endedAt: dayjs(monthlySubscription.startedAt).add(1, 'month').toDate(),
    } satisfies SubscriptionModel;
    const compareTo = dayjs(subscription.endedAt).add(1, 'day').toDate();

    expect(isSubscriptionExpired(subscription, compareTo)).toBeTruthy();
  });

  it('endedAt = compareTo', () => {
    const subscription = {
      ...monthlySubscription,
      endedAt: dayjs(monthlySubscription.startedAt).add(1, 'month').toDate(),
    } satisfies SubscriptionModel;
    const compareTo = dayjs(subscription.endedAt).startOf('day').toDate();

    expect(isSubscriptionExpired(subscription, compareTo)).toBeTruthy();
  });

  it('compareTo < endedAt', () => {
    const subscription = {
      ...monthlySubscription,
      endedAt: dayjs(monthlySubscription.startedAt).add(1, 'month').toDate(),
    } satisfies SubscriptionModel;
    const compareTo = dayjs(subscription.endedAt).subtract(1, 'day').toDate();

    expect(isSubscriptionExpired(subscription, compareTo)).toBeFalsy();
  });
});

describe.todo('compare by month');
