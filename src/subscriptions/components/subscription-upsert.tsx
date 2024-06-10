import type { RawFormValue } from '@/form/types/raw-form-value.ts';
import { SplitLayoutContext } from '@/ui/layouts/split.layout.tsx';
import { cn } from '@/ui/utils/cn.ts';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { clsx } from 'clsx';
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
import { subscriptionUpsertForm } from '../globals/subscription.test-id.ts';
import {
  type InsertSubscriptionModel,
  type SubscriptionModel,
  type UpdateSubscriptionModel,
  type UpsertSubscriptionModel,
} from '../models/subscription.model.ts';
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

  const onSubmit: SubmitHandler<RawFormValue<UpsertSubscriptionModel>> =
    useCallback(
      async (raw) => {
        const subscription =
          state.mode === 'update'
            ? await updateSubscription(
                raw as RawFormValue<UpdateSubscriptionModel>,
              )
            : await insertSubscription(
                raw as RawFormValue<InsertSubscriptionModel>,
              );

        if (state.mode === 'update') {
          return;
        }

        dispatch({ type: 'open', subscription });
      },
      [dispatch, state.mode],
    );

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
        data-testid={subscriptionUpsertForm}
        onSubmit={handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-2 self-stretch')}>
        <input
          {...register('id')}
          id="id"
          type="number"
          className={clsx('hidden')}
        />

        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            {...register('name')}
            id="name"
            placeholder="name"
            type="text"
            autoComplete="off"
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            {...register('description')}
            id="description"
            placeholder="description"
            autoComplete="off"
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="icon">Icon</FormLabel>
          <Input
            {...register('icon')}
            id="icon"
            placeholder="icon"
            type="text"
            autoComplete="off"
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="price">Price</FormLabel>
          <Input
            {...register('price')}
            id="price"
            placeholder="price"
            type="number"
            autoComplete="off"
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="price">Started At</FormLabel>
          <Input
            {...register('startedAt')}
            id="startedAt"
            placeholder="startedAt"
            type="date"
            autoComplete="off"
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="price">Ended At</FormLabel>
          <Input
            {...register('endedAt')}
            id="endedAt"
            placeholder="endedAt"
            type="date"
            autoComplete="off"
          />
        </FormControl>

        <Stack
          spacing={2}
          direction="row">
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
        </Stack>
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
