export const route = {
  root: '/',
  dashboard: '/dashboard',
  subscriptions: '/subscriptions',
} as const;

export type Route = (typeof route)[keyof typeof route];
