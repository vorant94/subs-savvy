import { SplitLayoutContext } from '@/ui/layouts/split.layout.tsx';
import { cn } from '@/ui/utils/cn.ts';
import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type FC,
  type PropsWithChildren,
  type Reducer,
} from 'react';
import type { SubscriptionModel } from '../models/subscription.model.ts';

export const SubscriptionUpsert: FC = () => {
  const { state, dispatch } = useContext(SubscriptionUpsertStateContext);

  return (
    <div className={cn(`flex-1 flex flex-col`)}>
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
          layout.setIsSplit(true);

          return {
            ...state,
            subscription: action.subscription ?? null,
            mode: action.subscription ? 'update' : 'insert',
          };
        }
        case 'close': {
          layout.setIsSplit(false);

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
