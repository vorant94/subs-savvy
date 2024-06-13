import { addYears, setMonth, subYears } from 'date-fns';
import { describe, expect, it } from 'vitest';
import {
  monthlySubscription,
  yearlySubscription,
} from '../models/subscription.mock.ts';
import type { SubscriptionModel } from '../models/subscription.model.tsx';
import { cyclePeriodToCalculateMonthlyPrice } from './cycle-period-to-calculate-monthly-price.ts';

describe('cyclePeriodToCalculateMonthlyPrice', () => {
  describe('monthly', () => {
    const calculateMonthlyPrice = cyclePeriodToCalculateMonthlyPrice.monthly;

    it('startedAtMonth < month && startedAtYear < year', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: subYears(setMonth(monthlySubscription.startedAt, 2), 1),
      };

      expect(calculateMonthlyPrice(subscription, 3)).toEqual(13.33);
    });

    it('startedAtMonth < month && startedAtYear = year', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: setMonth(monthlySubscription.startedAt, 2),
      };

      expect(calculateMonthlyPrice(subscription, 3)).toEqual(13.33);
    });

    it('startedAtMonth = month && startedAtYear = year', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: setMonth(monthlySubscription.startedAt, 2),
      };

      expect(calculateMonthlyPrice(subscription, 2)).toEqual(13.33);
    });

    it('month < startedAtMonth && startedAtYear = year', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: setMonth(monthlySubscription.startedAt, 2),
      };

      expect(calculateMonthlyPrice(subscription, 1)).toEqual(0);
    });

    it('month < startedAtMonth && year < startedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: addYears(setMonth(monthlySubscription.startedAt, 2), 1),
      };

      expect(calculateMonthlyPrice(subscription, 1)).toEqual(0);
    });

    it('startedAtMonth < endedAtMonth < month && startedAtYear < endedAtYear < year', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: subYears(setMonth(monthlySubscription.startedAt, 2), 1),
        endedAt: subYears(setMonth(monthlySubscription.startedAt, 6), 1),
      };

      expect(calculateMonthlyPrice(subscription, 9)).toEqual(0);
    });

    it('startedAtMonth < endedAtMonth < month && startedAtYear < year = endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: subYears(setMonth(monthlySubscription.startedAt, 2), 1),
        endedAt: setMonth(monthlySubscription.startedAt, 6),
      };

      expect(calculateMonthlyPrice(subscription, 9)).toEqual(0);
    });

    it('startedAtMonth < month = endedAtMonth && startedAtYear < year = endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: subYears(setMonth(monthlySubscription.startedAt, 2), 1),
        endedAt: setMonth(monthlySubscription.startedAt, 9),
      };

      expect(calculateMonthlyPrice(subscription, 9)).toEqual(0);
    });

    it('startedAtMonth < month < endedAtMonth && startedAtYear < year = endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: subYears(setMonth(monthlySubscription.startedAt, 2), 1),
        endedAt: setMonth(monthlySubscription.startedAt, 9),
      };

      expect(calculateMonthlyPrice(subscription, 6)).toEqual(13.33);
    });

    it('startedAtMonth < month < endedAtMonth && startedAtYear < year < endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...monthlySubscription,
        startedAt: subYears(setMonth(monthlySubscription.startedAt, 2), 1),
        endedAt: addYears(setMonth(monthlySubscription.startedAt, 9), 1),
      };

      expect(calculateMonthlyPrice(subscription, 6)).toEqual(13.33);
    });
  });

  describe('yearly', () => {
    const calculateMonthlyPrice = cyclePeriodToCalculateMonthlyPrice.yearly;

    it('startedAtMonth < month && startedAtYear < year', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: subYears(setMonth(yearlySubscription.startedAt, 2), 1),
      };

      expect(calculateMonthlyPrice(subscription, 3)).toEqual(0);
    });

    it('startedAtMonth < month && startedAtYear = year', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: setMonth(yearlySubscription.startedAt, 2),
      };

      expect(calculateMonthlyPrice(subscription, 3)).toEqual(0);
    });

    it('startedAtMonth = month && startedAtYear = year', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: setMonth(yearlySubscription.startedAt, 2),
      };

      expect(calculateMonthlyPrice(subscription, 2)).toEqual(13.33);
    });

    it('startedAtMonth = month && startedAtYear < year', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: subYears(setMonth(yearlySubscription.startedAt, 2), 1),
      };

      expect(calculateMonthlyPrice(subscription, 2)).toEqual(13.33);
    });

    it('month < startedAtMonth && startedAtYear = year', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: setMonth(yearlySubscription.startedAt, 4),
      };

      expect(calculateMonthlyPrice(subscription, 2)).toEqual(0);
    });

    it('month < startedAtMonth && year < startedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: addYears(setMonth(yearlySubscription.startedAt, 4), 1),
      };

      expect(calculateMonthlyPrice(subscription, 2)).toEqual(0);
    });

    it('startedAtMonth < endedAtMonth < month && startedAtYear < endedAtYear < year', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: subYears(setMonth(yearlySubscription.startedAt, 2), 2),
        endedAt: subYears(setMonth(yearlySubscription.startedAt, 4), 1),
      };

      expect(calculateMonthlyPrice(subscription, 6)).toEqual(0);
    });

    it('startedAtMonth < endedAtMonth < month && startedAtYear < year = endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: subYears(setMonth(yearlySubscription.startedAt, 2), 2),
        endedAt: setMonth(yearlySubscription.startedAt, 4),
      };

      expect(calculateMonthlyPrice(subscription, 6)).toEqual(0);
    });

    it('startedAtMonth < month = endedAtMonth && startedAtYear < year = endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: subYears(setMonth(yearlySubscription.startedAt, 2), 2),
        endedAt: setMonth(yearlySubscription.startedAt, 4),
      };

      expect(calculateMonthlyPrice(subscription, 4)).toEqual(0);
    });

    it('startedAtMonth < month = endedAtMonth && startedAtYear = year < endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: setMonth(yearlySubscription.startedAt, 2),
        endedAt: addYears(setMonth(yearlySubscription.startedAt, 4), 1),
      };

      expect(calculateMonthlyPrice(subscription, 4)).toEqual(0);
    });

    it('startedAtMonth = month < endedAtMonth && startedAtYear < year < endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: subYears(setMonth(yearlySubscription.startedAt, 2), 1),
        endedAt: addYears(setMonth(yearlySubscription.startedAt, 4), 1),
      };

      expect(calculateMonthlyPrice(subscription, 2)).toEqual(13.33);
    });

    it('startedAtMonth = month < endedAtMonth && year < startedAtYear < endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: addYears(setMonth(yearlySubscription.startedAt, 2), 1),
        endedAt: addYears(setMonth(yearlySubscription.startedAt, 4), 2),
      };

      expect(calculateMonthlyPrice(subscription, 2)).toEqual(0);
    });

    it('month < startedAtMonth < endedAtMonth && year < startedAtYear < endedAtYear', () => {
      const subscription: SubscriptionModel = {
        ...yearlySubscription,
        startedAt: addYears(setMonth(yearlySubscription.startedAt, 2), 1),
        endedAt: addYears(setMonth(yearlySubscription.startedAt, 4), 2),
      };

      expect(calculateMonthlyPrice(subscription, 1)).toEqual(0);
    });
  });
});
