import { cn } from '@/ui/utils/cn.ts';
import { Button, Checkbox, Switch, Table } from '@mantine/core';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { memo, useCallback, useState } from 'react';
import { exportedSubscriptionSchema } from '../models/subscription.model.ts';
import { findSubscriptions } from '../models/subscription.table.ts';
import { subscriptionCyclePeriodToLabel } from '../types/subscription-cycle-period.ts';
import { subscriptionIconToLabel } from '../types/subscription-icon.tsx';

export const ExportSubscriptions = memo(() => {
  const subscriptions = useLiveQuery(() => findSubscriptions(), [], []);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const toggleAll = () => {
    selectedIds.length === subscriptions.length
      ? setSelectedIds([])
      : setSelectedIds(subscriptions.map((subscription) => subscription.id));
  };
  const toggleSelectedId = (id: number): void => {
    setSelectedIds(
      !selectedIds.includes(id)
        ? [...selectedIds, id]
        : selectedIds.filter((selectedId) => selectedId !== id),
    );
  };

  const [isPrettify, setIsPrettify] = useState(true);
  const toggleIsPrettify = useCallback(() => {
    setIsPrettify(!isPrettify);
  }, [isPrettify]);

  const exportSubscriptions = () => {
    const subscriptionsToExport = subscriptions
      .filter((subscription) => selectedIds.includes(subscription.id))
      .map((subscription) => exportedSubscriptionSchema.parse(subscription));
    const jsonToExport = isPrettify
      ? JSON.stringify(subscriptionsToExport, null, 2)
      : JSON.stringify(subscriptionsToExport);
    const blobToExport = new Blob([jsonToExport], { type: 'application/json' });

    const exportLink = document.createElement('a');
    exportLink.href = URL.createObjectURL(blobToExport);
    exportLink.download = 'subscriptions.json';
    document.body.appendChild(exportLink);
    exportLink.click();
    document.body.removeChild(exportLink);
  };

  return (
    <div className={cn(`flex flex-col gap-4`)}>
      <Table.ScrollContainer minWidth="100%">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  aria-label="Select subscription"
                  checked={
                    subscriptions.length > 0 &&
                    selectedIds.length === subscriptions.length
                  }
                  indeterminate={
                    selectedIds.length !== subscriptions.length &&
                    selectedIds.length > 0
                  }
                  onChange={toggleAll}
                />
              </Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Icon</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Started At</Table.Th>
              <Table.Th>Ended At</Table.Th>
              <Table.Th>Each</Table.Th>
              <Table.Th>Period</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {subscriptions.map((subscription) => (
              <Table.Tr key={subscription.id}>
                <Table.Td>
                  <Checkbox
                    aria-label="Select subscription"
                    checked={selectedIds.includes(subscription.id)}
                    onChange={() => toggleSelectedId(subscription.id)}
                  />
                </Table.Td>
                <Table.Td>{subscription.name}</Table.Td>
                <Table.Td>{subscription.description}</Table.Td>
                <Table.Td>
                  {subscriptionIconToLabel[subscription.icon]}
                </Table.Td>
                <Table.Td>{subscription.price}</Table.Td>
                <Table.Td>
                  {dayjs(subscription.startedAt).format('MMMM D, YYYY')}
                </Table.Td>
                <Table.Td>
                  {dayjs(subscription.endedAt).format('MMMM D, YYYY')}
                </Table.Td>
                <Table.Td>{subscription.cycle.each}</Table.Td>
                <Table.Td>
                  {subscriptionCyclePeriodToLabel[subscription.cycle.period]}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

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
