import { Button } from '@mantine/core';
import { memo, useCallback, useContext } from 'react';
import { SubscriptionUpsertStateContext } from './subscription-upsert.tsx';

export const AddSubscriptionButton = memo(() => {
  const upsert = useContext(SubscriptionUpsertStateContext);

  const onClick = useCallback(
    () => upsert.dispatch({ type: 'open' }),
    [upsert],
  );

  return <Button onClick={onClick}>add sub</Button>;
});
