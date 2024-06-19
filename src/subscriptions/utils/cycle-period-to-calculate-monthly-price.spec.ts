import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import {
  monthlySubscription,
  yearlySubscription,
} from '../models/subscription.mock.ts';
import type { SubscriptionModel } from '../models/subscription.model.ts';
import { cyclePeriodToCalculateMonthlyPrice } from './cycle-period-to-calculate-monthly-price.ts';

describe('cyclePeriodToCalculateMonthlyPrice', () => {
  describe('monthly', () => {
    const calculateMonthlyPrice = cyclePeriodToCalculateMonthlyPrice.monthly;

    it('startedAtMonth < month && startedAtYear < year', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: dayjs(monthlySubscription.startedAt)
          .subtract(1, 'year')
          .set('month', 2)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 3)).toEqual(13.33);
    });

    it('startedAtMonth < month && startedAtYear = year', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: dayjs(monthlySubscription.startedAt)
          .set('month', 2)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 3)).toEqual(13.33);
    });

    it('startedAtMonth = month && startedAtYear = year', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: dayjs(monthlySubscription.startedAt)
          .set('month', 2)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 2)).toEqual(13.33);
    });

    it('month < startedAtMonth && startedAtYear = year', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: dayjs(monthlySubscription.startedAt)
          .set('month', 2)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 1)).toEqual(0);
    });

    it('month < startedAtMonth && year < startedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: dayjs(monthlySubscription.startedAt)
          .add(1, 'year')
          .set('month', 2)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 1)).toEqual(0);
    });

    it('startedAtMonth < endedAtMonth < month && startedAtYear < endedAtYear < year', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: dayjs(monthlySubscription.startedAt)
          .subtract(1, 'year')
          .set('month', 2)
          .toDate(),
        endedAt: dayjs(monthlySubscription.startedAt)
          .subtract(1, 'year')
          .set('month', 6)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 9)).toEqual(0);
    });

    it('startedAtMonth < endedAtMonth < month && startedAtYear < year = endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: dayjs(monthlySubscription.startedAt)
          .subtract(1, 'year')
          .set('month', 2)
          .toDate(),
        endedAt: dayjs(monthlySubscription.startedAt).set('month', 6).toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 9)).toEqual(0);
    });

    it('startedAtMonth < month = endedAtMonth && startedAtYear < year = endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: dayjs(monthlySubscription.startedAt)
          .subtract(1, 'year')
          .set('month', 2)
          .toDate(),
        endedAt: dayjs(monthlySubscription.startedAt).set('month', 9).toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 9)).toEqual(0);
    });

    it('startedAtMonth < month < endedAtMonth && startedAtYear < year = endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: dayjs(monthlySubscription.startedAt)
          .subtract(1, 'year')
          .set('month', 2)
          .toDate(),
        endedAt: dayjs(monthlySubscription.startedAt).set('month', 9).toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 6)).toEqual(13.33);
    });

    it('startedAtMonth < month < endedAtMonth && startedAtYear < year < endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: dayjs(monthlySubscription.startedAt)
          .subtract(1, 'year')
          .set('month', 2)
          .toDate(),
        endedAt: dayjs(monthlySubscription.startedAt)
          .add(1, 'year')
          .set('month', 9)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 6)).toEqual(13.33);
    });
  });

  describe('yearly', () => {
    const calculateMonthlyPrice = cyclePeriodToCalculateMonthlyPrice.yearly;

    it('startedAtMonth < month && startedAtYear < year', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: dayjs(yearlySubscription.startedAt)
          .subtract(1, 'year')
          .set('month', 2)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 3)).toEqual(0);
    });

    it('startedAtMonth < month && startedAtYear = year', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: dayjs(yearlySubscription.startedAt).set('month', 2).toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 3)).toEqual(0);
    });

    it('startedAtMonth = month && startedAtYear = year', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: dayjs(yearlySubscription.startedAt).set('month', 2).toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 2)).toEqual(13.33);
    });

    it('startedAtMonth = month && startedAtYear < year', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: dayjs(yearlySubscription.startedAt)
          .subtract(1, 'year')
          .set('month', 2)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 2)).toEqual(13.33);
    });

    it('month < startedAtMonth && startedAtYear = year', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: dayjs(yearlySubscription.startedAt).set('month', 4).toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 2)).toEqual(0);
    });

    it('month < startedAtMonth && year < startedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: dayjs(yearlySubscription.startedAt)
          .add(1, 'year')
          .set('month', 4)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 2)).toEqual(0);
    });

    it('startedAtMonth < endedAtMonth < month && startedAtYear < endedAtYear < year', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: dayjs(yearlySubscription.startedAt)
          .subtract(2, 'year')
          .set('month', 2)
          .toDate(),
        endedAt: dayjs(yearlySubscription.startedAt)
          .subtract(1, 'year')
          .set('month', 4)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 6)).toEqual(0);
    });

    it('startedAtMonth < endedAtMonth < month && startedAtYear < year = endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: dayjs(yearlySubscription.startedAt)
          .subtract(2, 'year')
          .set('month', 2)
          .toDate(),
        endedAt: dayjs(yearlySubscription.startedAt).set('month', 4).toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 6)).toEqual(0);
    });

    it('startedAtMonth < month = endedAtMonth && startedAtYear < year = endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: dayjs(yearlySubscription.startedAt)
          .subtract(2, 'year')
          .set('month', 2)
          .toDate(),
        endedAt: dayjs(yearlySubscription.startedAt).set('month', 4).toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 4)).toEqual(0);
    });

    it('startedAtMonth < month = endedAtMonth && startedAtYear = year < endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: dayjs(yearlySubscription.startedAt).set('month', 2).toDate(),
        endedAt: dayjs(yearlySubscription.startedAt)
          .add(1, 'year')
          .set('month', 4)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 4)).toEqual(0);
    });

    it('startedAtMonth = month < endedAtMonth && startedAtYear < year < endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: dayjs(yearlySubscription.startedAt)
          .subtract(1, 'year')
          .set('month', 2)
          .toDate(),
        endedAt: dayjs(yearlySubscription.startedAt)
          .add(1, 'year')
          .set('month', 4)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 2)).toEqual(13.33);
    });

    it('startedAtMonth = month < endedAtMonth && year < startedAtYear < endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: dayjs(yearlySubscription.startedAt)
          .add(1, 'year')
          .set('month', 2)
          .toDate(),
        endedAt: dayjs(yearlySubscription.startedAt)
          .add(2, 'year')
          .set('month', 4)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 2)).toEqual(0);
    });

    it('month < startedAtMonth < endedAtMonth && year < startedAtYear < endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: dayjs(yearlySubscription.startedAt)
          .add(1, 'year')
          .set('month', 2)
          .toDate(),
        endedAt: dayjs(yearlySubscription.startedAt)
          .add(2, 'year')
          .set('month', 4)
          .toDate(),
      };

      expect(calculateMonthlyPrice(subscription, 1)).toEqual(0);
    });
  });
});
