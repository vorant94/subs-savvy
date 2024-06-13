import { cn } from '@/ui/utils/cn.ts';
import { Avatar, Card, CardBody, Heading, Text } from '@chakra-ui/react';
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
        as="button"
        textAlign="start"
        alignItems="initial"
        onClick={openSubscriptionUpdate}>
        <CardBody className={cn(`flex items-center gap-2`)}>
          <Avatar
            bg="transparent"
            size="sm"
            icon={subscriptionIconToSvg[subscription.icon]}
          />

          <div className={cn('flex-1 overflow-hidden')}>
            <Heading
              size="xs"
              className={cn(`truncate`)}
              textTransform="uppercase">
              {subscription.name}
            </Heading>

            {subscription.description ? (
              <Text
                className={cn(`truncate`)}
                fontSize="sm">
                {subscription.description}
              </Text>
            ) : null}
          </div>

          <Heading size="md">{subscription.price}</Heading>
        </CardBody>
      </Card>
    );
  },
);

export interface SubscriptionListItemProps {
  subscription: SubscriptionModel;
}
