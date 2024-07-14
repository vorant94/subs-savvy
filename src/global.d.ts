import 'vitest';
import type { DateMatchers } from './date/utils/date-matchers.ts';
import type { db } from './db/globals/db.ts';

declare global {
  interface Window {
    Dexie: typeof db;
  }
}

declare module 'vitest' {
  interface Assertion extends DateMatchers {}
  interface AsymmetricMatchersContaining extends DateMatchers {}
}
