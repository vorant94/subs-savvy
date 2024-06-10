import { cn } from '@/ui/utils/cn.ts';
import { Avatar, Card, CardBody, Heading, Text } from '@chakra-ui/react';
import { memo, useCallback, useContext } from 'react';
import type { SubscriptionModel } from '../models/subscription.model.ts';
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
        as="button"
        textAlign="start"
        alignItems="initial"
        onClick={openSubscriptionUpdate}>
        <CardBody>
          <div className={cn(`flex items-center gap-2`)}>
            <Avatar size="sm" />

            <div className={cn('flex-1')}>
              <Heading
                size="xs"
                textTransform="uppercase">
                {subscription.name}
              </Heading>

              {subscription.description ? (
                <Text fontSize="sm">{subscription.description}</Text>
              ) : null}
            </div>

            <Heading size="md">{subscription.price}</Heading>
          </div>
        </CardBody>
      </Card>
    );
  },
);

export interface SubscriptionListItemProps {
  subscription: SubscriptionModel;
}
