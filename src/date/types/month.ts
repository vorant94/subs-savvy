import type { MonthName } from './month-name.ts';

export const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export type Month = (typeof months)[number];

export const monthToMonthName = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
} as const satisfies Record<Month, MonthName>;
