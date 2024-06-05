import { SubscriptionUpsertStateProvider } from '@/subscriptions/components/subscription-upsert';
import {
  SplitLayoutContextProvider,
  type SplitLayoutNavLink,
} from '@/ui/layouts/split.layout.tsx';
import { memo } from 'react';
import { Outlet } from 'react-router-dom';

export const App = memo(() => {
  return (
    <SplitLayoutContextProvider navLinks={navLinks}>
      <SubscriptionUpsertStateProvider>
        <Outlet />
      </SubscriptionUpsertStateProvider>
    </SplitLayoutContextProvider>
  );
});

const navLinks = [
  {
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    label: 'Subscriptions',
    path: '/subscriptions',
  },
] as const satisfies Array<SplitLayoutNavLink>;
