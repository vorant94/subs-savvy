import { Checkbox, Table } from '@mantine/core';
import dayjs from 'dayjs';
import { memo, type Dispatch, type SetStateAction } from 'react';
import type { SubscriptionModel } from '../models/subscription.model.ts';
import { subscriptionCyclePeriodToLabel } from '../types/subscription-cycle-period.ts';
import { subscriptionIconToLabel } from '../types/subscription-icon.ts';

export const SubscriptionsSelectTable = memo(
  ({
    subscriptions,
    selectedIds,
    setSelectedIds,
  }: SubscriptionsSelectTableProps) => {
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

    return (
      <Table.ScrollContainer minWidth="100%">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  aria-label="Select all subscriptions"
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
                  {subscription.endedAt
                    ? dayjs(subscription.endedAt).format('MMMM D, YYYY')
                    : null}
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
    );
  },
);

export interface SubscriptionsSelectTableProps {
  subscriptions: Array<SubscriptionModel>;
  selectedIds: Array<number>;
  setSelectedIds: Dispatch<SetStateAction<Array<number>>>;
}
