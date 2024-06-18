import { route } from '@/router/types/route.ts';
import { MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { App } from './App.tsx';
import './index.css';

window.addEventListener('unhandledrejection', function ({ reason }) {
  if (import.meta.env.DEV && reason instanceof Error) {
    console.error(reason.message);
  }
});

window.addEventListener('error', function ({ error }) {
  if (import.meta.env.DEV && error instanceof Error) {
    console.error(error.message);
  }
});

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: route.root,
        element: (
          <Navigate
            to="/dashboard"
            replace
          />
        ),
      },
      {
        path: route.dashboard,
        lazy: () =>
          import(`@/dashboard/pages/dashboard.page.tsx`).then((m) => ({
            Component: m.DashboardPage,
          })),
      },
      {
        path: route.subscriptions,
        lazy: () =>
          import(`@/subscriptions/pages/subscriptions.page.tsx`).then((m) => ({
            Component: m.SubscriptionsPage,
          })),
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>,
);
