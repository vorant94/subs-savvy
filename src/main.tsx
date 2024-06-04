import { SubscriptionsPage } from '@/subscriptions/pages/subscriptions.page.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SubscriptionsPage />
  </StrictMode>,
);
