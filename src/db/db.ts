import Dexie from 'dexie';

export const db = new Dexie('subs-savvy');

db.version(1).stores({
  subscriptions: '++id',
});
