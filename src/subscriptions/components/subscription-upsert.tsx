import { findTags } from '@/tags/models/tag.table.ts';
import { DefaultLayoutContext } from '@/ui/layouts/default.layout.tsx';
import { cn } from '@/ui/utils/cn.ts';
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
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
  type Reducer,
} from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import {
  subscriptionCyclePeriodToLabel,
  subscriptionCyclePeriods,
  subscriptionIconToLabel,
  subscriptionIcons,
  type InsertSubscriptionModel,
  type SubscriptionModel,
  type UpdateSubscriptionModel,
  type UpsertSubscriptionModel,
} from '../models/subscription.model.tsx';
import {
  deleteSubscription,
  insertSubscription,
  updateSubscription,
} from '../models/subscription.table.ts';

export const SubscriptionUpsert = memo(() => {
  const { state, dispatch } = useContext(SubscriptionUpsertStateContext);
  const { register, handleSubmit, control, reset } =
    useForm<UpsertSubscriptionModel>();
  const tags = useLiveQuery(() => findTags());

  const onSubmit: SubmitHandler<UpsertSubscriptionModel> = async (raw) => {
    state.mode === 'update'
      ? await updateSubscription(raw as UpdateSubscriptionModel)
      : await insertSubscription(raw as InsertSubscriptionModel);

    dispatch({ type: 'close' });
  };

  const onDelete = useCallback(async () => {
    if (state.mode !== 'update') {
      throw new Error(`Nothing to delete in insert mode!`);
    }

    await deleteSubscription(state.subscription.id);

    dispatch({ type: 'close' });
  }, [dispatch, state]);

  const onClose = useCallback(() => {
    dispatch({ type: 'close' });
  }, [dispatch]);

  // TODO fix form reset on add new after existing is open
  useEffect(() => {
    if (state.mode === 'update') {
      reset(state.subscription);
    }
  }, [reset, state]);

  const tagsData: ComboboxData = useMemo(() => {
    return (tags ?? []).map((tag) => ({
      label: tag.name,
      value: `${tag.id}`,
    }));
  }, [tags]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
        defaultValue=""
        {...register('name')}
        label="Name"
        placeholder="Name"
        autoComplete="off"
      />

      <Textarea
        defaultValue=""
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
          defaultValue={new Date()}
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
          defaultValue={1}
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
          defaultValue="monthly"
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
        defaultValue={[]}
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
          onClick={onClose}>
          Close
        </Button>
        {state.mode === 'update' && (
          <Button
            type="button"
            color="red"
            variant="outline"
            onClick={onDelete}>
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

export const SubscriptionUpsertStateContext = createContext<{
  state: SubscriptionUpsertState;
  dispatch: Dispatch<SubscriptionUpsertAction>;
}>({
  state: {
    subscription: null,
    mode: null,
  },
  dispatch: () => {},
});

const stateDefaults: SubscriptionUpsertState = {
  mode: null,
  subscription: null,
};

export const SubscriptionUpsertStateProvider = memo(
  ({ children }: PropsWithChildren) => {
    const layout = useContext(DefaultLayoutContext);
    const [state, dispatch] = useReducer<
      Reducer<SubscriptionUpsertState, SubscriptionUpsertAction>
    >((_, action) => {
      switch (action.type) {
        case 'open': {
          return action.subscription
            ? {
                subscription: action.subscription,
                mode: 'update',
              }
            : {
                mode: 'insert',
              };
        }
        case 'close': {
          return stateDefaults;
        }
      }
    }, stateDefaults);

    useEffect(() => {
      state.mode ? layout.drawer.open() : layout.drawer.close();
    }, [layout, state]);

    useEffect(() => {
      if (!layout.isDrawerOpened && !state.mode) {
        dispatch({ type: 'close' });
      }
    }, [layout, dispatch, state]);

    return (
      <SubscriptionUpsertStateContext.Provider value={{ state, dispatch }}>
        {children}
      </SubscriptionUpsertStateContext.Provider>
    );
  },
);

export type SubscriptionUpsertState =
  | {
      subscription: SubscriptionModel;
      mode: 'update';
    }
  | {
      mode: 'insert';
    }
  | {
      subscription: null;
      mode: null;
    };

export interface SubscriptionUpsertOpenAction {
  type: 'open';
  subscription?: SubscriptionModel | null;
}

export interface SubscriptionUpsertCloseAction {
  type: 'close';
}

export type SubscriptionUpsertAction =
  | SubscriptionUpsertOpenAction
  | SubscriptionUpsertCloseAction;
