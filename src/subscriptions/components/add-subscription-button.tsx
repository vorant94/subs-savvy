import { Button } from '@chakra-ui/react';
import { memo, useCallback, useContext } from 'react';
import { addSubscriptionButton } from '../globals/subscription.test-id.ts';
import { SubscriptionUpsertStateContext } from './subscription-upsert.tsx';

export const AddSubscriptionButton = memo(() => {
  const upsert = useContext(SubscriptionUpsertStateContext);

  const onClick = useCallback(
    () => upsert.dispatch({ type: 'open' }),
    [upsert],
  );

  return (
    <Button
      colorScheme="teal"
      data-testid={addSubscriptionButton}
      onClick={onClick}>
      add sub
    </Button>
  );
});