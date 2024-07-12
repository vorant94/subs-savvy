import type { db } from './db/globals/db.ts';

declare global {
  interface Window {
    Dexie: typeof db;
  }
}
