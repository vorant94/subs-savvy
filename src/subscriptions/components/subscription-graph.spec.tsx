import { describe, expect, it } from 'vitest';
import {
  minimalSubscription,
  subscriptionWithEndedAt,
  subscriptionWithStartedAt,
} from '../models/subscription.mock.ts';
import { aggregateSubscriptionsByMonth } from './subscription-graph.tsx';

const suites = new Map<
  string,
  [
    Parameters<typeof aggregateSubscriptionsByMonth>,
    ReturnType<typeof aggregateSubscriptionsByMonth>,
  ]
>([
  [
    'should consider sub without startedAt and endedAt as permanent',
    [
      [[minimalSubscription]],
      {
        January: 13.33,
        February: 13.33,
        March: 13.33,
        April: 13.33,
        May: 13.33,
        June: 13.33,
        July: 13.33,
        August: 13.33,
        September: 13.33,
        October: 13.33,
        November: 13.33,
        December: 13.33,
      },
    ],
  ],
  [
    'should respect subscription startedAt if it is present',
    [
      [[subscriptionWithStartedAt]],
      {
        January: 0,
        February: 0,
        March: 13.33,
        April: 13.33,
        May: 13.33,
        June: 13.33,
        July: 13.33,
        August: 13.33,
        September: 13.33,
        October: 13.33,
        November: 13.33,
        December: 13.33,
      },
    ],
  ],
  [
    'should respect subscription endedAt if it is present',
    [
      [[subscriptionWithEndedAt]],
      {
        January: 5.0,
        February: 5.0,
        March: 5.0,
        April: 5.0,
        May: 5.0,
        June: 5.0,
        July: 5.0,
        August: 5.0,
        September: 5.0,
        October: 5.0,
        November: 0,
        December: 0,
      },
    ],
  ],
]);

describe('aggregateSubscriptionsByMonth', () => {
  for (const [should, [input, actual]] of suites) {
    it(should, () => {
      expect(aggregateSubscriptionsByMonth(...input)).toEqual(actual);
    });
  }
});
