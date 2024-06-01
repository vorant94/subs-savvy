import { SubscriptionsPage } from '@/subscriptions/pages/subscriptions.page.tsx';
import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SubscriptionsPage />
  </StrictMode>,
);
