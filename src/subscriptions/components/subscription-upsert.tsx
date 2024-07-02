import { findTags } from '@/tags/models/tag.table.ts';
import { cn } from '@/ui/utils/cn.ts';
import { createDatePickerInputAriaLabels } from '@/ui/utils/create-date-picker-input-aria-labels.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Divider,
  Fieldset,
  MultiSelect,
  NumberInput,
  Select,
  TextInput,
  Textarea,
  type ComboboxData,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useLiveQuery } from 'dexie-react-hooks';
import { memo, useCallback, useMemo } from 'react';
import {
  Controller,
  useForm,
  type DefaultValues,
  type SubmitHandler,
} from 'react-hook-form';
import { useSubscriptionUpsert } from '../hooks/use-subscription-upsert.tsx';
import {
  insertSubscriptionSchema,
  updateSubscriptionSchema,
  type InsertSubscriptionModel,
  type UpdateSubscriptionModel,
  type UpsertSubscriptionModel,
} from '../models/subscription.model.ts';
import {
  deleteSubscription,
  insertSubscription,
  updateSubscription,
} from '../models/subscription.table.ts';
import { subscriptionCyclePeriodsComboboxData } from '../types/subscription-cycle-period.ts';
import { subscriptionIconsComboboxData } from '../types/subscription-icon.ts';

export const SubscriptionUpsert = memo(() => {
  const { state, dispatch } = useSubscriptionUpsert();

  const { register, handleSubmit, control } = useForm<UpsertSubscriptionModel>({
    resolver: zodResolver(
      state.mode === 'update'
        ? updateSubscriptionSchema
        : insertSubscriptionSchema,
    ),
    defaultValues: state.mode === 'update' ? state.subscription : defaultValues,
  });
  const upsertSubscription: SubmitHandler<UpsertSubscriptionModel> = async (
    raw,
  ) => {
    state.mode === 'update'
      ? await updateSubscription(raw as UpdateSubscriptionModel)
      : await insertSubscription(raw as InsertSubscriptionModel);

    dispatch({ type: 'close' });
  };
  const deleteSubscriptionCb = useCallback(async () => {
    if (state.mode !== 'update') {
      throw new Error(`Nothing to delete in insert mode!`);
    }

    await deleteSubscription(state.subscription.id);

    dispatch({ type: 'close' });
  }, [dispatch, state]);
  const closeUpsert = useCallback(() => {
    dispatch({ type: 'close' });
  }, [dispatch]);

  const tags = useLiveQuery(() => findTags(), [], []);
  const tagsData: ComboboxData = useMemo(() => {
    return tags.map((tag) => ({
      label: tag.name,
      value: `${tag.id}`,
    }));
  }, [tags]);

  return (
    <form
      onSubmit={handleSubmit(upsertSubscription)}
      className={cn('flex flex-col gap-2 self-stretch')}>
      <Divider />

      <Controller
        control={control}
        name="id"
        render={({ field: { onChange, onBlur, value } }) => (
          <NumberInput
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            className={cn('hidden')}
          />
        )}
      />

      <TextInput
        {...register('name')}
        label="Name"
        placeholder="Name"
        autoComplete="off"
      />

      <Textarea
        {...register('description')}
        label="Description"
        placeholder="Description"
      />

      <Controller
        control={control}
        name="icon"
        render={({ field: { value, onChange, onBlur } }) => (
          <Select
            value={value}
            onChange={(_, option) => option && onChange(option.value)}
            onBlur={onBlur}
            label="Icon"
            placeholder="Icon"
            data={subscriptionIconsComboboxData}
          />
        )}
      />

      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, onBlur, value } }) => (
          <NumberInput
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            label="Price"
            placeholder="Price"
          />
        )}
      />

      <Fieldset
        legend="Active Period"
        className={cn(`grid grid-cols-2 gap-2`)}>
        <Controller
          control={control}
          name="startedAt"
          render={({ field: { onChange, onBlur, value } }) => (
            <DatePickerInput
              label="Started At"
              aria-label="Started At"
              ariaLabels={createDatePickerInputAriaLabels('started at')}
              placeholder="Started At"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <Controller
          control={control}
          name="endedAt"
          render={({ field: { onChange, onBlur, value } }) => (
            <DatePickerInput
              label="Ended At"
              aria-label="Ended At"
              ariaLabels={createDatePickerInputAriaLabels('ended at')}
              placeholder="Ended At"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Fieldset>

      <Fieldset
        legend="Billing Cycle"
        className={cn(`grid grid-cols-2 gap-2`)}>
        <Controller
          control={control}
          name="cycle.each"
          render={({ field: { onChange, onBlur, value } }) => (
            <NumberInput
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              label="Each"
              placeholder="Each"
            />
          )}
        />

        <Controller
          control={control}
          name="cycle.period"
          render={({ field: { value, onChange, onBlur } }) => (
            <Select
              value={value}
              onChange={(_, option) => option && onChange(option.value)}
              onBlur={onBlur}
              label="Period"
              placeholder="Period"
              data={subscriptionCyclePeriodsComboboxData}
            />
          )}
        />
      </Fieldset>

      <Controller
        control={control}
        name="tags"
        render={({ field: { value, onChange, onBlur } }) => (
          <MultiSelect
            label="Tags"
            placeholder="Tags"
            clearable
            data={tagsData}
            value={value.map((tag) => `${tag.id}`)}
            onChange={(tagIds) =>
              onChange(
                tagIds.map(
                  (tagId) => tags.find((tag) => `${tag.id}` === tagId)!,
                ),
              )
            }
            onBlur={onBlur}
          />
        )}
      />

      <Divider />

      <div className={cn('flex justify-end gap-2')}>
        <Button type="submit">
          {state.mode === 'update' ? 'Update' : 'Insert'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={closeUpsert}>
          Close
        </Button>
        {state.mode === 'update' && (
          <Button
            type="button"
            color="red"
            variant="outline"
            onClick={deleteSubscriptionCb}>
            Delete
          </Button>
        )}
      </div>
    </form>
  );
});

const defaultValues: DefaultValues<UpsertSubscriptionModel> = {
  startedAt: new Date(),
  tags: [],
  cycle: {
    each: 1,
    period: 'monthly',
  },
};
