import {
  NavLinksProvider,
  type NavLink,
} from '@/router/hooks/use-nav-links.tsx';
import { SubscriptionUpsertProvider } from '@/subscriptions/hooks/use-subscription-upsert.tsx';
import { SubscriptionsProvider } from '@/subscriptions/hooks/use-subscriptions.tsx';
import { DefaultLayoutProvider } from '@/ui/hooks/use-default-layout.tsx';
import { faChartSimple, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react';
import { Outlet } from 'react-router-dom';

export const App = memo(() => {
  return (
    <NavLinksProvider navLinks={navLinks}>
      <DefaultLayoutProvider>
        <SubscriptionUpsertProvider>
          <SubscriptionsProvider>
            <Outlet />
          </SubscriptionsProvider>
        </SubscriptionUpsertProvider>
      </DefaultLayoutProvider>
    </NavLinksProvider>
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
