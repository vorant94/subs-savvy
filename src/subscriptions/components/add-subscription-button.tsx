import { memo, useCallback, useContext } from 'react';
import { SubscriptionUpsertStateContext } from './subscription-upsert.tsx';

export const AddSubscriptionButton = memo(() => {
  const upsert = useContext(SubscriptionUpsertStateContext);

  const onClick = useCallback(
    () => upsert.dispatch({ type: 'open' }),
    [upsert],
  );

  return <button onClick={onClick}>add sub</button>;
});
