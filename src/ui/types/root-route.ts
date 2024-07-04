export const rootRoute = {
  dashboard: 'dashboard',
  subscriptions: 'subscriptions',
  recovery: 'recovery',
} as const;

export type Route = (typeof rootRoute)[keyof typeof rootRoute];
