import {
  NavLinksContextProvider,
  type NavLink,
} from '@/router/providers/nav-links.provider.tsx';
import { SubscriptionUpsertStateProvider } from '@/subscriptions/providers/subscription-upsert-state.provider';
import { SubscriptionsProvider } from '@/subscriptions/providers/subscriptions.provider.tsx';
import { DefaultLayoutContextProvider } from '@/ui/layouts/default.layout';
import { faChartSimple, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react';
import { Outlet } from 'react-router-dom';

export const App = memo(() => {
  return (
    <NavLinksContextProvider navLinks={navLinks}>
      <DefaultLayoutContextProvider>
        <SubscriptionUpsertStateProvider>
          <SubscriptionsProvider>
            <Outlet />
          </SubscriptionsProvider>
        </SubscriptionUpsertStateProvider>
      </DefaultLayoutContextProvider>
    </NavLinksContextProvider>
  );
});

const navLinks = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <FontAwesomeIcon icon={faChartSimple} />,
  },
  {
    label: 'Subscriptions',
    path: '/subscriptions',
    icon: <FontAwesomeIcon icon={faCreditCard} />,
  },
] as const satisfies Array<NavLink>;
