import { findCategories } from '@/categories/models/category.table.ts';
import { cn } from '@/ui/utils/cn.ts';
import { createDatePickerInputAriaLabels } from '@/ui/utils/create-date-picker-input-aria-labels.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Fieldset,
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpsertSubscriptionModel>({
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

  const categories = useLiveQuery(() => findCategories(), [], []);
  const categoriesData: ComboboxData = useMemo(() => {
    return categories.map((category) => ({
      label: category.name,
      value: `${category.id}`,
    }));
  }, [categories]);

  return (
    <form
      onSubmit={handleSubmit(upsertSubscription)}
      className={cn('flex flex-col gap-2 self-stretch')}>
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
        error={errors.name?.message}
      />

      <Textarea
        {...register('description')}
        label="Description"
        placeholder="Description"
        error={errors.description?.message}
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
            error={errors.icon?.message}
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
            error={errors.price?.message}
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
              error={errors.startedAt?.message}
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
              error={errors.endedAt?.message}
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
              error={errors.cycle?.each?.message}
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
              error={errors.cycle?.period?.message}
            />
          )}
        />
      </Fieldset>

      <Controller
        control={control}
        name="category"
        render={({ field: { value, onChange, onBlur } }) => (
          <Select
            label="Category"
            placeholder="Category"
            data={categoriesData}
            value={`${value?.id}`}
            onChange={(categoryId) =>
              onChange(
                categories.find((category) => `${category.id}` === categoryId),
              )
            }
            onBlur={onBlur}
            error={errors.category?.message}
          />
        )}
      />

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
  cycle: {
    each: 1,
    period: 'monthly',
  },
};
