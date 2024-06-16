import { cn } from '@/ui/utils/cn.ts';
import { Avatar, Card, Text, Title } from '@mantine/core';
import { memo, useCallback, useContext } from 'react';
import {
  subscriptionIconToSvg,
  type SubscriptionModel,
} from '../models/subscription.model.tsx';
import { SubscriptionUpsertStateContext } from './subscription-upsert.tsx';

export const SubscriptionListItem = memo(
  ({ subscription }: SubscriptionListItemProps) => {
    const upsert = useContext(SubscriptionUpsertStateContext);

    const openSubscriptionUpdate = useCallback(
      () => upsert.dispatch({ type: 'open', subscription }),
      [subscription, upsert],
    );

    return (
      <Card
        shadow="xs"
        padding="xs"
        radius="md"
        withBorder
        aria-label={subscription.name}
        component="button"
        className={cn(`block text-left`)}
        onClick={openSubscriptionUpdate}>
        <div className={cn(`flex items-center gap-2`)}>
          <Avatar
            radius={0}
            variant="transparent">
            {subscriptionIconToSvg[subscription.icon]}
          </Avatar>

          <div className={cn('flex-1 overflow-hidden')}>
            <Title
              order={5}
              className={cn(`!mb-0 truncate uppercase`)}>
              {subscription.name}
            </Title>

            {subscription.description ? (
              <Text
                size="sm"
                className={cn(`block truncate`)}>
                {subscription.description}
              </Text>
            ) : null}
          </div>

          <Title
            order={4}
            className={cn(`!mb-0`)}>
            {subscription.price}
          </Title>
        </div>
      </Card>
    );
  },
);

export interface SubscriptionListItemProps {
  subscription: SubscriptionModel;
}
