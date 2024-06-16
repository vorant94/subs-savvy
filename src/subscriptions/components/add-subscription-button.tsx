import { Button } from '@mantine/core';
import { memo, useCallback, useContext } from 'react';
import { SubscriptionUpsertStateContext } from '../providers/subscription-upsert-state.provider.tsx';

export const AddSubscriptionButton = memo(() => {
  const upsert = useContext(SubscriptionUpsertStateContext);

  const openSubscriptionInsert = useCallback(
    () => upsert.dispatch({ type: 'open' }),
    [upsert],
  );

  return <Button onClick={openSubscriptionInsert}>add sub</Button>;
});
