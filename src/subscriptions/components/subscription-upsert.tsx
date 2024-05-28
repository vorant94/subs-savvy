import { SplitLayoutContext } from '@/ui/layouts/split.layout.tsx';
import { cn } from '@/ui/utils/cn.ts';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type Reducer,
} from 'react';
import { type SubscriptionModel } from '../models/subscription.model.ts';
import { insertSubscription } from '../models/subscription.table.ts';

export const SubscriptionUpsert: FC = () => {
  const { state, dispatch } = useContext(SubscriptionUpsertStateContext);

  const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await insertSubscription(event.currentTarget);

    // TODO switch to update mode with newly created subscription
  }, []);

  return (
    <div className={cn(`flex-1 flex flex-col`)}>
      <form
        onSubmit={onSubmit}
        className={cn('flex flex-col gap-2')}>
        <div className={cn(`flex flex-col`)}>
          <label htmlFor="name">Name</label>
          <input
            placeholder="name"
            name="name"
            id="name"
            type="text"
            autoComplete="off"
          />
        </div>

        <div className={cn(`flex flex-col`)}>
          <label htmlFor="description">Description</label>
          <textarea
            placeholder="description"
            name="description"
            id="description"
            autoComplete="off"
          />
        </div>

        <div className={cn(`flex flex-col`)}>
          <label htmlFor="icon">Icon</label>
          <input
            placeholder="icon"
            name="icon"
            id="icon"
            type="text"
            autoComplete="off"
          />
        </div>

        <div className={cn(`flex flex-col`)}>
          <label htmlFor="price">Price</label>
          <input
            placeholder="price"
            name="price"
            id="price"
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
