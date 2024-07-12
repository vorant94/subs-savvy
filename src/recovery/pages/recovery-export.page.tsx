import { Button, Switch } from '@mantine/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { memo, useCallback, useState } from 'react';
import { dbVersion } from '../../db/globals/db.ts';
import { SubscriptionsSelectTable } from '../../subscriptions/components/subscriptions-select-table.tsx';
import { findSubscriptions } from '../../subscriptions/models/subscription.table.ts';
import { cn } from '../../ui/utils/cn.ts';
import { recoverySchema } from '../models/recovery.model.ts';

export const RecoveryExportPage = memo(() => {
  const subscriptions = useLiveQuery(() => findSubscriptions(), [], []);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [isPrettify, setIsPrettify] = useState(true);
  const toggleIsPrettify = useCallback(() => {
    setIsPrettify(!isPrettify);
  }, [isPrettify]);

  const exportSubscriptions = useCallback(() => {
    const subscriptionsToExport = subscriptions.filter((subscription) =>
      selectedIds.includes(subscription.id),
    );
    const subscriptionsExport = recoverySchema.parse({
      dbVersion,
      subscriptions: subscriptionsToExport,
    });
    const jsonToExport = isPrettify
      ? JSON.stringify(subscriptionsExport, null, 2)
      : JSON.stringify(subscriptionsExport);
    const blobToExport = new Blob([jsonToExport], { type: 'application/json' });

    const exportLink = document.createElement('a');
    exportLink.href = URL.createObjectURL(blobToExport);
    exportLink.download = 'subscriptions.json';
    document.body.appendChild(exportLink);
    exportLink.click();
    document.body.removeChild(exportLink);
  }, [isPrettify, selectedIds, subscriptions]);

  return (
    <div className={cn(`flex flex-col gap-4`)}>
      <SubscriptionsSelectTable
        subscriptions={subscriptions}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />

      <div className={cn(`flex items-center`)}>
        <Switch
          checked={isPrettify}
          onChange={toggleIsPrettify}
          label="Prettify"
        />

        <div className={cn('flex-1')} />

        <Button
          disabled={selectedIds.length === 0}
          onClick={exportSubscriptions}>
          export
        </Button>
      </div>
    </div>
  );
});
