import { useBreakpoint } from '@/ui/hooks/use-breakpoint.ts';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Button } from '@mantine/core';
import { memo, useCallback, useContext } from 'react';
import { SubscriptionUpsertStateContext } from '../providers/subscription-upsert-state.provider.tsx';

export const AddSubscriptionButton = memo(() => {
  const upsert = useContext(SubscriptionUpsertStateContext);
  const isMd = useBreakpoint('md');

  const openSubscriptionInsert = useCallback(
    () => upsert.dispatch({ type: 'open' }),
    [upsert],
  );

  return isMd ? (
    <Button onClick={openSubscriptionInsert}>add sub</Button>
  ) : (
    <ActionIcon
      onClick={openSubscriptionInsert}
      size="xl"
      radius="xl"
      aria-label="add sub">
      <FontAwesomeIcon icon={faPlus} />
    </ActionIcon>
  );
});
