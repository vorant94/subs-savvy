import { SplitLayoutContext } from '@/ui/layouts/split.layout.tsx';
import { cn } from '@/ui/utils/cn.ts';
import { clsx } from 'clsx';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type FC,
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
  insertSubscription,
  updateSubscription,
} from '../models/subscription.table.ts';

export const SubscriptionUpsert: FC = () => {
  const { state, dispatch } = useContext(SubscriptionUpsertStateContext);
  const { register, handleSubmit, reset } = useForm<UpsertSubscriptionModel>();

  const onSubmit = useCallback(async (raw) => {
    const subscription = await (state.mode === 'update'
      ? updateSubscription(raw as UpdateSubscriptionModel)
      : insertSubscription(raw as InsertSubscriptionModel));

    if (state.mode === 'update') {
      return;
    }

    dispatch({ type: 'open', subscription });
  }, []) satisfies SubmitHandler<UpsertSubscriptionModel>;

  useEffect(() => {
    reset(state.subscription ?? defaults);
  }, [state]);

  return (
    <div className={cn(`flex-1 flex flex-col`)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-2')}>
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

        <button type="submit">Submit</button>
      </form>
      <div>{state.mode} mode</div>
      <div>{state.subscription?.name} subscription</div>
      <div className={cn(`flex-1`)} />
      <button onClick={() => dispatch({ type: 'close' })}>close</button>
    </div>
  );
};

const defaults = {
  id: '',
  name: '',
  description: '',
  icon: '',
  price: '',
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

export const SubscriptionUpsertStateProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const layout = useContext(SplitLayoutContext);

  const [state, dispatch] = useReducer<
    Reducer<SubscriptionUpsertState, SubscriptionUpsertAction>
  >(
    (state, action) => {
      switch (action.type) {
        case 'open': {
          return {
            ...state,
            subscription: action.subscription ?? null,
            mode: action.subscription ? 'update' : 'insert',
          };
        }
        case 'close': {
          return {
            ...state,
            subscription: null,
            mode: null,
          };
        }
      }
    },
    { mode: null, subscription: null },
  );

  useEffect(() => {
    layout.setIsSplit(!!state.mode);
  }, [state]);

  return (
    <SubscriptionUpsertStateContext.Provider value={{ state, dispatch }}>
      {children}
    </SubscriptionUpsertStateContext.Provider>
  );
};

export interface SubscriptionUpsertState {
  subscription: SubscriptionModel | null;
  mode: 'insert' | 'update' | null;
}

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
