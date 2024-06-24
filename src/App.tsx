import {
  NavLinksProvider,
  type NavLink,
} from '@/router/hooks/use-nav-links.tsx';
import { route } from '@/router/types/route.ts';
import { SubscriptionUpsertProvider } from '@/subscriptions/hooks/use-subscription-upsert.tsx';
import { SubscriptionsProvider } from '@/subscriptions/hooks/use-subscriptions.tsx';
import { DefaultLayoutProvider } from '@/ui/hooks/use-default-layout.tsx';
import {
  faChartSimple,
  faClockRotateLeft,
  faCreditCard,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react';
import { Outlet } from 'react-router-dom';

export const App = memo(() => {
  return (
    <NavLinksProvider
      topNavLinks={topNavLinks}
      bottomNavLinks={bottomNavLinks}>
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

const topNavLinks = [
  {
    label: 'Dashboard',
    path: `/${route.dashboard}`,
    icon: <FontAwesomeIcon icon={faChartSimple} />,
  },
  {
    label: 'Subscriptions',
    path: `/${route.subscriptions}`,
    icon: <FontAwesomeIcon icon={faCreditCard} />,
  },
] as const satisfies Array<NavLink>;

const bottomNavLinks = [
  {
    label: 'Recovery',
    path: `/${route.recovery}`,
    icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
  },
] as const satisfies Array<NavLink>;
