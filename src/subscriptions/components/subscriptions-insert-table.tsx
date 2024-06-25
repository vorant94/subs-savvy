import { findTags } from '@/tags/models/tag.table.ts';
import { cn } from '@/ui/utils/cn.ts';
import {
  MultiSelect,
  NumberInput,
  Select,
  Table,
  TextInput,
  type ComboboxData,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { usePrevious } from '@mantine/hooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { forwardRef, memo, useEffect, useMemo } from 'react';
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from 'react-hook-form';
import type { InsertSubscriptionModel } from '../models/subscription.model.ts';
import { insertSubscriptions } from '../models/subscription.table.ts';
import { subscriptionCyclePeriodsComboboxData } from '../types/subscription-cycle-period.ts';
import { subscriptionIconsComboboxData } from '../types/subscription-icon.tsx';

export const SubscriptionsInsertTable = memo(
  forwardRef<HTMLFormElement, SubscriptionsInsertTableProps>(
    ({ subscriptions, onInsert }, ref) => {
      const { handleSubmit, control, register } =
        useForm<SubscriptionsInsertTableFormValue>();
      const { fields, append, remove } = useFieldArray({
        control,
        name: 'subscriptions',
      });

      const prevSubscriptions = usePrevious(subscriptions);
      useEffect(() => {
        if (subscriptions !== prevSubscriptions) {
          remove();
          append(subscriptions);
        }
      }, [append, prevSubscriptions, remove, subscriptions]);

      const tags = useLiveQuery(() => findTags(), [], []);
      const tagsData: ComboboxData = useMemo(() => {
        return tags.map((tag) => ({
          label: tag.name,
          value: `${tag.id}`,
        }));
      }, [tags]);

      const insertSubscriptionsCb: SubmitHandler<
        SubscriptionsInsertTableFormValue
      > = async ({ subscriptions }) => {
        await insertSubscriptions(subscriptions);
        onInsert?.();
      };

      return (
        <form
          id="subscriptionsUpsertTableForm"
          onSubmit={handleSubmit(insertSubscriptionsCb)}
          ref={ref}>
          <Table.ScrollContainer minWidth="100%">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Icon</Table.Th>
                  <Table.Th>Price</Table.Th>
                  <Table.Th>Started At</Table.Th>
                  <Table.Th>Ended At</Table.Th>
                  <Table.Th>Each</Table.Th>
                  <Table.Th>Period</Table.Th>
                  <Table.Th>Tags</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {fields.map((field, index) => (
                  <Table.Tr key={field.id}>
                    <Table.Td className={cn(`min-w-40`)}>
                      <TextInput
                        {...register(`subscriptions.${index}.name`)}
                        placeholder="Name"
                        autoComplete="off"
                      />
                    </Table.Td>

                    <Table.Td className={cn(`min-w-40`)}>
                      <TextInput
                        {...register(`subscriptions.${index}.description`)}
                        placeholder="Description"
                      />
                    </Table.Td>

                    <Table.Td className={cn(`min-w-40`)}>
                      <Controller
                        control={control}
                        name={`subscriptions.${index}.icon`}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <Select
                            value={value}
                            onChange={(_, option) => onChange(option.value)}
                            onBlur={onBlur}
                            placeholder="Icon"
                            data={subscriptionIconsComboboxData}
                          />
                        )}
                      />
                    </Table.Td>

                    <Table.Td className={cn(`min-w-40`)}>
                      <Controller
                        control={control}
                        name={`subscriptions.${index}.price`}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <NumberInput
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder="Price"
                          />
                        )}
                      />
                    </Table.Td>

                    <Table.Td className={cn(`min-w-40`)}>
                      <Controller
                        control={control}
                        name={`subscriptions.${index}.startedAt`}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <DatePickerInput
                            className={cn(`text-nowrap`)}
                            placeholder="Started At"
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                    </Table.Td>

                    <Table.Td className={cn(`min-w-40 overflow-hidden`)}>
                      <Controller
                        control={control}
                        name={`subscriptions.${index}.endedAt`}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <DatePickerInput
                            className={cn(`text-nowrap`)}
                            placeholder="Ended At"
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                    </Table.Td>

                    <Table.Td className={cn(`min-w-40`)}>
                      <Controller
                        control={control}
                        name={`subscriptions.${index}.cycle.each`}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <NumberInput
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder="Each"
                          />
                        )}
                      />
                    </Table.Td>

                    <Table.Td className={cn(`min-w-40`)}>
                      <Controller
                        control={control}
                        name={`subscriptions.${index}.cycle.period`}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <Select
                            value={value}
                            onChange={(_, option) => onChange(option.value)}
                            onBlur={onBlur}
                            placeholder="Period"
                            data={subscriptionCyclePeriodsComboboxData}
                          />
                        )}
                      />
                    </Table.Td>

                    <Table.Td className={cn(`min-w-40`)}>
                      <Controller
                        control={control}
                        name={`subscriptions.${index}.tags`}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <MultiSelect
                            placeholder="Tags"
                            clearable
                            data={tagsData}
                            value={value.map((tag) => `${tag.id}`)}
                            onChange={(tagIds) =>
                              onChange(
                                tagIds.map(
                                  (tagId) =>
                                    tags.find((tag) => `${tag.id}` === tagId)!,
                                ),
                              )
                            }
                            onBlur={onBlur}
                          />
                        )}
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </form>
      );
    },
  ),
);

export interface SubscriptionsInsertTableProps {
  subscriptions: Array<InsertSubscriptionModel>;
  onInsert?: () => void;
}

export interface SubscriptionsInsertTableFormValue {
  subscriptions: Array<InsertSubscriptionModel>;
}
