import { App } from '@/App.tsx';
import { DashboardPage } from '@/dashboard/pages/dashboard.page.tsx';
import { route } from '@/router/types/route.ts';
import { SubscriptionsPage } from '@/subscriptions/pages/subscriptions.page.tsx';
import { ChakraProvider } from '@chakra-ui/react';
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
        Component: DashboardPage,
      },
      {
        path: route.subscriptions,
        Component: SubscriptionsPage,
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
