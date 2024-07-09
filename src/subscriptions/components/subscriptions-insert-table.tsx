import { findCategories } from '@/categories/models/category.table.ts';
import { cn } from '@/ui/utils/cn.ts';
import {
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
import { subscriptionIconsComboboxData } from '../types/subscription-icon.ts';

export const SubscriptionsInsertTable = memo(
  forwardRef<HTMLFormElement, SubscriptionsInsertTableProps>(
    ({ subscriptions, onInsert }, ref) => {
      const {
        handleSubmit,
        control,
        register,
        formState: { errors },
      } = useForm<SubscriptionsInsertTableFormValue>();
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

      const categories = useLiveQuery(() => findCategories(), [], []);
      const categoriesData: ComboboxData = useMemo(() => {
        return categories.map((category) => ({
          label: category.name,
          value: `${category.id}`,
        }));
      }, [categories]);

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
                  <Table.Th>Category</Table.Th>
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
                        error={errors.subscriptions?.[index]?.name?.message}
                      />
                    </Table.Td>

                    <Table.Td className={cn(`min-w-40`)}>
                      <TextInput
                        {...register(`subscriptions.${index}.description`)}
                        placeholder="Description"
                        error={
                          errors.subscriptions?.[index]?.description?.message
                        }
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
                            error={errors.subscriptions?.[index]?.icon?.message}
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
                            error={
                              errors.subscriptions?.[index]?.price?.message
                            }
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
                            error={
                              errors.subscriptions?.[index]?.startedAt?.message
                            }
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
                            error={
                              errors.subscriptions?.[index]?.endedAt?.message
                            }
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
                            error={
                              errors.subscriptions?.[index]?.cycle?.each
                                ?.message
                            }
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
                            error={
                              errors.subscriptions?.[index]?.cycle?.period
                                ?.message
                            }
                          />
                        )}
                      />
                    </Table.Td>

                    <Table.Td className={cn(`min-w-40`)}>
                      <Controller
                        control={control}
                        name={`subscriptions.${index}.category`}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <Select
                            placeholder="Category"
                            data={categoriesData}
                            value={`${value?.id}`}
                            onChange={(categoryId) =>
                              onChange(
                                categories.find(
                                  (category) => `${category.id}` === categoryId,
                                ),
                              )
                            }
                            onBlur={onBlur}
                            error={
                              errors.subscriptions?.[index]?.category?.message
                            }
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
