export const route = {
  root: '/',
  dashboard: '/dashboard',
  subscriptions: '/subscriptions',
  subscriptionsBulk: '/subscriptions-bulk',
} as const;

export type Route = (typeof route)[keyof typeof route];
