import { cn } from '@/ui/utils/cn.ts';
import {
  Avatar,
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import { memo, useContext } from 'react';
import type { SubscriptionModel } from '../models/subscription.model.ts';
import { SubscriptionUpsertStateContext } from './subscription-upsert.tsx';

export const SubscriptionListItem = memo(
  ({ subscription }: SubscriptionListItemProps) => {
    const upsert = useContext(SubscriptionUpsertStateContext);

    return (
      <Card onClick={() => upsert.dispatch({ type: 'open', subscription })}>
        <CardBody>
          <Flex className={cn(`items-center gap-2`)}>
            <Avatar size="sm" />

            <Box flex={1}>
              <Heading
                size="xs"
                textTransform="uppercase">
                {subscription.name}
              </Heading>

              {subscription.description ? (
                <Text fontSize="sm">{subscription.description}</Text>
              ) : null}
            </Box>

            <Heading size="md">{subscription.price}</Heading>
          </Flex>
        </CardBody>
      </Card>
    );
  },
);

export interface SubscriptionListItemProps {
  subscription: SubscriptionModel;
}
