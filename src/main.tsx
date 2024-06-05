import { App } from '@/App.tsx';
import { DashboardPage } from '@/dashboard/pages/dashboard.page.tsx';
import { SubscriptionsPage } from '@/subscriptions/pages/subscriptions.page.tsx';
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
    Component: App,
    children: [
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
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
