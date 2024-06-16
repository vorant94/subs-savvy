import { findTags } from '@/tags/models/tag.table.ts';
import { cn } from '@/ui/utils/cn.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
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
import { memo, useCallback, useContext, useMemo } from 'react';
import {
  Controller,
  useForm,
  type DefaultValues,
  type SubmitHandler,
} from 'react-hook-form';
import {
  insertSubscriptionSchema,
  subscriptionCyclePeriodToLabel,
  subscriptionCyclePeriods,
  subscriptionIconToLabel,
  subscriptionIcons,
  updateSubscriptionSchema,
  type InsertSubscriptionModel,
  type UpdateSubscriptionModel,
  type UpsertSubscriptionModel,
} from '../models/subscription.model.tsx';
import {
  deleteSubscription,
  insertSubscription,
  updateSubscription,
} from '../models/subscription.table.ts';
import { SubscriptionUpsertStateContext } from '../providers/subscription-upsert-state.provider.tsx';

export const SubscriptionUpsert = memo(() => {
  const { state, dispatch } = useContext(SubscriptionUpsertStateContext);

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

  const tags = useLiveQuery(() => findTags());
  const tagsData: ComboboxData = useMemo(() => {
    return (tags ?? []).map((tag) => ({
      label: tag.name,
      value: `${tag.id}`,
    }));
  }, [tags]);

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
            onChange={(_, option) => onChange(option.value)}
            onBlur={onBlur}
            label="Icon"
            placeholder="Icon"
            data={iconsData}
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
              onChange={(_, option) => onChange(option.value)}
              onBlur={onBlur}
              label="Period"
              placeholder="Period"
              data={cyclePeriodsData}
            />
          )}
        />
      </Fieldset>

      <Controller
        control={control}
        name="tags"
        render={({ field: { value, onChange, onBlur } }) => (
          <MultiSelect
            aria-label="Tags"
            placeholder="Tags"
            clearable
            data={tagsData}
            value={value.map((tag) => `${tag.id}`)}
            onChange={(tagIds) =>
              onChange(
                tagIds.map(
                  (tagId) => (tags ?? []).find((tag) => `${tag.id}` === tagId)!,
                ),
              )
            }
            onBlur={onBlur}
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

const iconsData: ComboboxData = subscriptionIcons.map((icon) => ({
  value: icon,
  label: subscriptionIconToLabel[icon],
}));

const cyclePeriodsData: ComboboxData = subscriptionCyclePeriods.map(
  (cyclePeriod) => ({
    value: cyclePeriod,
    label: subscriptionCyclePeriodToLabel[cyclePeriod],
  }),
);

const defaultValues: DefaultValues<UpsertSubscriptionModel> = {
  startedAt: new Date(),
  tags: [],
  cycle: {
    each: 1,
    period: 'monthly',
  },
};
