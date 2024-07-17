import type { MatchersObject } from '@vitest/expect';
import { expect } from 'vitest';

export const arrayMatchers = {
  toEqualIgnoreOrder(
    received: ReadonlyArray<unknown>,
    expected: ReadonlyArray<unknown>,
  ) {
    const { isNot } = this;

    let pass = true;
    try {
      for (const expectedEl of expected) {
        expect(received).toContainEqual(expectedEl);
      }
      for (const receivedEl of received) {
        expect(expected).toContainEqual(receivedEl);
      }
    } catch (_) {
      pass = false;
    }

    return {
      pass,
      message: () =>
        `${received} ${isNot ? `doesn't equal` : 'equals'} ${expected} and vise versa ignoring order`,
    };
  },
} satisfies MatchersObject;

export type ArrayMatchers = Record<keyof typeof arrayMatchers, ArrayComparer>;

export interface ArrayComparer {
  (expected: ReadonlyArray<unknown>): void;
}
