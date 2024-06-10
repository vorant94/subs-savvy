import { App } from '@/App.tsx';
import { route } from '@/router/types/route.ts';
import { ChakraProvider } from '@chakra-ui/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import './index.css';

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
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>,
);
