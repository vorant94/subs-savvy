import { cn } from '@/ui/utils/cn.ts';
import { Card, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { memo, useMemo } from 'react';
import { useSubscriptions } from '../hooks/use-subscriptions.tsx';
import type { SubscriptionModel } from '../models/subscription.model.ts';
import { getSubscriptionNextPaymentAt } from '../utils/get-subscription-next-payment-at.ts';

export const UpcomingSubscriptionPaymentsChart = memo(() => {
  const { subscriptions } = useSubscriptions();

  const subscriptionsWithNextPaymentAt = useMemo(
    () => filterSubscriptionsWithNextPaymentAt(subscriptions),
    [subscriptions],
  );

  return (
    <Card
      className={cn(`flex h-full flex-col gap-2`)}
      shadow="xs"
      padding="xs"
      radius="md"
      withBorder>
      <Title
        className={cn(`self-center`)}
        order={5}>
        Upcoming Payments
      </Title>

      <div className={cn(`flex flex-col overflow-y-auto`)}>
        {subscriptionsWithNextPaymentAt.map((subscription) => (
          <div key={subscription.id}>
            {subscription.name} - {subscription.nextPaymentAt.toISOString()}
          </div>
        ))}
      </div>
    </Card>
  );
});

interface SubscriptionWithNextPaymentAt extends SubscriptionModel {
  nextPaymentAt: Date;
}

function filterSubscriptionsWithNextPaymentAt(
  subscriptions: Array<SubscriptionModel>,
): Array<SubscriptionWithNextPaymentAt> {
  return subscriptions
    .map((subscription) => ({
      ...subscription,
      nextPaymentAt: getSubscriptionNextPaymentAt(subscription),
    }))
    .filter(
      (subscription): subscription is SubscriptionWithNextPaymentAt =>
        !!subscription.nextPaymentAt,
    )
    .toSorted((a, b) =>
      dayjs(a.nextPaymentAt).isBefore(b.nextPaymentAt) ? -1 : 1,
    );
}
