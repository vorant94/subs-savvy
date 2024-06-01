import { SplitLayoutContext } from '@/ui/layouts/split.layout.tsx';
import { cn } from '@/ui/utils/cn.ts';
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
import {
  type InsertSubscriptionModel,
  type SubscriptionModel,
  type UpdateSubscriptionModel,
  type UpsertSubscriptionModel,
} from '../models/subscription.model.ts';
import {
  deleteSubscription,
  insertSubscription,
  updateSubscription,
} from '../models/subscription.table.ts';

export const SubscriptionUpsert = memo(() => {
  const { state, dispatch } = useContext(SubscriptionUpsertStateContext);
  const { register, handleSubmit, reset } = useForm<UpsertSubscriptionModel>();

  const onSubmit: SubmitHandler<UpsertSubscriptionModel> = useCallback(
    async (raw) => {
      console.log(raw);
      const subscription =
        state.mode === 'update'
          ? await updateSubscription(raw as UpdateSubscriptionModel)
          : await insertSubscription(raw as InsertSubscriptionModel);

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
  }, [state, dispatch]);

  const onClose = useCallback(() => {
    dispatch({ type: 'close' });
  }, [dispatch]);

  useEffect(() => {
    // TODO format date here
    reset(state.mode === 'update' ? state.subscription : formDefaults);
  }, [reset, state]);

  return (
    <div className={cn(`flex-1 flex flex-col items-center`)}>
      <h1>{`${state.mode === 'update' ? 'Update' : 'Insert'} Subscription`}</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-2 self-stretch')}>
        <input
          {...register('id')}
          id="id"
          type="number"
          className={clsx('hidden')}
        />

        <div className={cn(`flex flex-col`)}>
          <label htmlFor="name">Name</label>
          <input
            {...register('name')}
            id="name"
            placeholder="name"
            type="text"
            autoComplete="off"
          />
        </div>

        <div className={cn(`flex flex-col`)}>
          <label htmlFor="description">Description</label>
          <textarea
            {...register('description')}
            id="description"
            placeholder="description"
            autoComplete="off"
          />
        </div>

        <div className={cn(`flex flex-col`)}>
          <label htmlFor="icon">Icon</label>
          <input
            {...register('icon')}
            id="icon"
            placeholder="icon"
            type="text"
            autoComplete="off"
          />
        </div>

        <div className={cn(`flex flex-col`)}>
          <label htmlFor="price">Price</label>
          <input
            {...register('price')}
            id="price"
            placeholder="price"
            type="number"
            autoComplete="off"
          />
        </div>

        <div className={cn(`flex flex-col`)}>
          <label htmlFor="price">Started At</label>
          <input
            {...register('startedAt')}
            id="startedAt"
            placeholder="startedAt"
            type="date"
            autoComplete="off"
          />
        </div>

        <div className={cn(`flex flex-col`)}>
          <label htmlFor="price">Ended At</label>
          <input
            {...register('endedAt')}
            id="endedAt"
            placeholder="endedAt"
            type="date"
            autoComplete="off"
          />
        </div>

        <div className={cn('flex gap-2 justify-center')}>
          <button type="submit">
            {state.mode === 'update' ? 'Update' : 'Insert'}
          </button>
          <button
            type="button"
            onClick={onClose}>
            Close
          </button>
          {state.mode === 'update' && (
            <button
              type="button"
              onClick={onDelete}>
              Delete
            </button>
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
} as unknown as SubscriptionModel;

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

    useEffect(() => {
      layout.setIsSplit(!!state.mode);
    }, [state]);

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
