import { DashboardPage } from '@/dashboard/pages/dashboard.page.tsx';
import { SubscriptionUpsertStateProvider } from '@/subscriptions/components/subscription-upsert';
import { SubscriptionsPage } from '@/subscriptions/pages/subscriptions.page.tsx';
import {
  SplitLayoutContextProvider,
  type SplitLayoutNavLink,
} from '@/ui/layouts/split.layout';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Navigate
        to="/dashboard"
        replace
      />
    ),
  },
  {
    path: '/dashboard',
    Component: DashboardPage,
  },
  {
    path: '/subscriptions',
    Component: SubscriptionsPage,
  },
]);

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SplitLayoutContextProvider navLinks={navLinks}>
      <SubscriptionUpsertStateProvider>
        <RouterProvider router={router} />
      </SubscriptionUpsertStateProvider>
    </SplitLayoutContextProvider>
  </StrictMode>,
);
