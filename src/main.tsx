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
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SubscriptionsPage />
  </React.StrictMode>,
);
