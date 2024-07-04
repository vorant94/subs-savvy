import { db } from '@/db/globals/db.ts';
import { recoveryRoute } from '@/recovery/types/recovery-route.ts';
import { rootRoute } from '@/ui/types/root-route.ts';
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

// setting it to the window so db is easily accessible to populate it with data during e2e tests
window.Dexie = db;

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '/',
        element: (
          <Navigate
            to={`/${rootRoute.dashboard}`}
            replace
          />
        ),
      },
      {
        path: `/${rootRoute.dashboard}`,
        lazy: () =>
          import(`@/dashboard/pages/dashboard.page.tsx`).then((m) => ({
            Component: m.DashboardPage,
          })),
      },
      {
        path: `/${rootRoute.subscriptions}`,
        lazy: () =>
          import(`@/subscriptions/pages/subscriptions.page.tsx`).then((m) => ({
            Component: m.SubscriptionsPage,
          })),
      },
      {
        path: `/${rootRoute.recovery}`,
        lazy: () =>
          import(`@/recovery/pages/recovery.page.tsx`).then((m) => ({
            Component: m.RecoveryPage,
          })),
        children: [
          {
            path: `/${rootRoute.recovery}`,
            element: (
              <Navigate to={`/${rootRoute.recovery}/${recoveryRoute.import}`} />
            ),
          },
          {
            path: `/${rootRoute.recovery}/${recoveryRoute.import}`,
            lazy: () =>
              import(`@/recovery/pages/recovery-import.page.tsx`).then((m) => ({
                Component: m.RecoveryImportPage,
              })),
          },
          {
            path: `/${rootRoute.recovery}/${recoveryRoute.export}`,
            lazy: () =>
              import(`@/recovery/pages/recovery-export.page.tsx`).then((m) => ({
                Component: m.RecoveryExportPage,
              })),
          },
        ],
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
