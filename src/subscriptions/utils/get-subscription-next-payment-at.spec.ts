import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import {
  monthlySubscription,
  yearlySubscription,
} from '../models/subscription.mock.ts';
import type { SubscriptionModel } from '../models/subscription.model.ts';
import { getSubscriptionNextPaymentAt } from './get-subscription-next-payment-at.ts';

describe('getSubscriptionNextPaymentAt', () => {
  it('monthly subscription', () => {
    const subscription = {
      ...monthlySubscription,
      startedAt: dayjs(monthlySubscription.startedAt)
        .set('date', 1)
        .subtract(1, 'year')
        .toDate(),
    } satisfies SubscriptionModel;

    const expectedDayJS = dayjs(new Date()).add(1, 'month').set('date', 1);
    expect(
      expectedDayJS.isSame(getSubscriptionNextPaymentAt(subscription), 'day'),
    ).toBeTruthy();
  });

  it('yearly subscription', () => {
    const subscription = {
      ...yearlySubscription,
      startedAt: dayjs(monthlySubscription.startedAt)
        .set('date', 1)
        .set('month', 1)
        .subtract(1, 'year')
        .toDate(),
    } satisfies SubscriptionModel;
    const now = dayjs(subscription.startedAt).add(6, 'month').toDate();

    const expectedDayJS = dayjs(subscription.startedAt).add(1, 'year');
    expect(
      expectedDayJS.isSame(
        getSubscriptionNextPaymentAt(subscription, now),
        'day',
      ),
    ).toBeTruthy();
  });

  it('expired subscription', () => {
    const subscription = {
      ...monthlySubscription,
      startedAt: dayjs(monthlySubscription.startedAt)
        .set('date', 1)
        .subtract(1, 'year')
        .toDate(),
      endedAt: dayjs(monthlySubscription.startedAt)
        .set('date', 1)
        .subtract(1, 'year')
        .add(1, 'month')
        .toDate(),
    } satisfies SubscriptionModel;

    expect(getSubscriptionNextPaymentAt(subscription)).toBeNull();
  });

  it('will expire before supposed next payment date', () => {
    const subscription = {
      ...monthlySubscription,
      startedAt: dayjs(monthlySubscription.startedAt)
        .set('date', 1)
        .subtract(1, 'year')
        .toDate(),
      endedAt: dayjs(monthlySubscription.startedAt)
        .set('date', 1)
        .subtract(1, 'year')
        .add(2, 'month')
        .toDate(),
    } satisfies SubscriptionModel;
    const now = dayjs(subscription.endedAt).subtract(2, 'days').toDate();

    expect(getSubscriptionNextPaymentAt(subscription, now)).toBeNull();
  });

  it('startedAt is in the future', () => {
    const subscription = {
      ...monthlySubscription,
      startedAt: dayjs(monthlySubscription.startedAt).add(3, 'year').toDate(),
    } satisfies SubscriptionModel;

    const expectedDayJS = dayjs(subscription.startedAt);
    expect(
      expectedDayJS.isSame(getSubscriptionNextPaymentAt(subscription), 'day'),
    ).toBeTruthy();
  });
});