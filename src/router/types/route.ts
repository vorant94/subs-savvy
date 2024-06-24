export const route = {
  dashboard: 'dashboard',
  subscriptions: 'subscriptions',
  recovery: 'recovery',
} as const;

export type Route = (typeof route)[keyof typeof route];
