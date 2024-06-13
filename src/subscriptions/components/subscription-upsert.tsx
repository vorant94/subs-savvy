import type { RawFormValue } from '@/form/types/raw-form-value.ts';
import { SplitLayoutContext } from '@/ui/layouts/split.layout.tsx';
import { cn } from '@/ui/utils/cn.ts';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
  type Reducer,
} from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { usePrevious } from 'react-use';
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
  mapSubscriptionToRawValue,
  updateSubscription,
} from '../models/subscription.table.ts';

export const SubscriptionUpsert = memo(() => {
  const { state, dispatch } = useContext(SubscriptionUpsertStateContext);
  const { register, handleSubmit, reset } =
    useForm<RawFormValue<UpsertSubscriptionModel>>();

  const onSubmit: SubmitHandler<RawFormValue<UpsertSubscriptionModel>> = async (
    raw,
  ) => {
    const subscription =
      state.mode === 'update'
        ? await updateSubscription(raw as RawFormValue<UpdateSubscriptionModel>)
        : await insertSubscription(
            raw as RawFormValue<InsertSubscriptionModel>,
          );

    if (state.mode === 'update') {
      return;
    }

    dispatch({ type: 'open', subscription });
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

  useEffect(() => {
    reset(
      state.mode === 'update'
        ? mapSubscriptionToRawValue(state.subscription)
        : formDefaults,
    );
  }, [reset, state]);

  return (
    <div className={cn(`flex flex-1 flex-col items-center`)}>
      <h1>{`${state.mode === 'update' ? 'Update' : 'Insert'} Subscription`}</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-2 self-stretch')}>
        <input
          {...register('id')}
          id="id"
          type="number"
          className={cn('hidden')}
        />

        <FormControl>
          <FormLabel>
            Name
            <Input
              {...register('name', { required: true })}
              placeholder="Name"
              type="text"
              autoComplete="off"
            />
          </FormLabel>
        </FormControl>

        <FormControl>
          <FormLabel>
            Description
            <Textarea
              {...register('description')}
              placeholder="Description"
              autoComplete="off"
            />
          </FormLabel>
        </FormControl>

        <FormControl>
          <FormLabel>
            Icon
            <Select
              {...register('icon', { required: true })}
              placeholder="Icon">
              {subscriptionIcons.map((icon) => (
                <option
                  key={icon}
                  value={icon}>
                  {subscriptionIconToLabel[icon]}
                </option>
              ))}
            </Select>
          </FormLabel>
        </FormControl>

        <FormControl>
          <FormLabel>
            Price
            <Input
              {...register('price', { required: true })}
              placeholder="Price"
              type="number"
              step=".01"
              autoComplete="off"
            />
          </FormLabel>
        </FormControl>

        <FormControl>
          <FormLabel>
            Started At
            <Input
              {...register('startedAt', { required: true })}
              placeholder="Started At"
              type="date"
              autoComplete="off"
            />
          </FormLabel>
        </FormControl>

        <FormControl>
          <FormLabel>
            Ended At
            <Input
              {...register('endedAt')}
              placeholder="Ended At"
              type="date"
              autoComplete="off"
            />
          </FormLabel>
        </FormControl>

        <FormControl>
          <FormLabel>
            Each
            <Input
              {...register('cycle.each', { required: true })}
              placeholder="Each"
              type="number"
              autoComplete="off"
            />
          </FormLabel>
        </FormControl>

        <FormControl>
          <FormLabel>
            Period
            <Select
              {...register('cycle.period', { required: true })}
              placeholder="Period">
              {subscriptionCyclePeriods.map((period) => (
                <option
                  key={period}
                  value={period}>
                  {subscriptionCyclePeriodToLabel[period]}
                </option>
              ))}
            </Select>
          </FormLabel>
        </FormControl>

        <div className={cn('flex gap-2')}>
          <Button
            type="submit"
            colorScheme="teal">
            {state.mode === 'update' ? 'Update' : 'Insert'}
          </Button>
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}>
            Close
          </Button>
          {state.mode === 'update' && (
            <Button
              colorScheme="red"
              variant="ghost"
              type="button"
              onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      </form>
    </div>
  );
});

const formDefaults = {
  id: '',
  name: '',
  description: '',
  icon: '',
  price: '',
  startedAt: '',
  endedAt: '',
  cycle: {
    each: '',
    period: '',
  },
} as const satisfies RawFormValue<SubscriptionModel>;

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
    const layout = useContext(SplitLayoutContext);
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
    const prevState = usePrevious(state);

    useEffect(() => {
      if (state.mode !== prevState?.mode) {
        layout.setIsSplit(!!state.mode);
      }
    }, [layout, prevState, state]);

    useEffect(() => {
      if (!layout.isSplit) {
        dispatch({ type: 'close' });
      }
    }, [layout, dispatch]);

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
