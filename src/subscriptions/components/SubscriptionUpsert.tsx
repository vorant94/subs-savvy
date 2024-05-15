import { SplitLayoutContext } from '@/ui/layouts/SplitLayout.tsx';
import { cn } from '@/ui/utils/cn.ts';
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';

export const SubscriptionUpsert: FC = () => {
  const { mode, close } = useContext(SubscriptionUpsertContext);

  return (
    <div className={cn(`flex-1 flex flex-col`)}>
      <div>{mode} mode</div>
      <div className={cn(`flex-1`)}></div>
      <button onClick={() => close()}>close</button>
    </div>
  );
};

export const SubscriptionUpsertContext =
  createContext<SubscriptionUpsertContextModel>({
    mode: null,
    open() {},
    close() {},
  });

export interface SubscriptionUpsertContextModel {
  mode: 'insert' | 'update' | null;
  open(subscription?: unknown): void;
  close(): void;
}

export const SubscriptionUpsertContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { setIsSplit } = useContext(SplitLayoutContext);

  const [mode, setMode] =
    useState<SubscriptionUpsertContextModel['mode']>(null);

  const open = useCallback<SubscriptionUpsertContextModel['open']>(
    (subscription) => {
      setMode(subscription ? 'update' : 'insert');
      setIsSplit(true);
    },
    [],
  );

  const close = useCallback<SubscriptionUpsertContextModel['close']>(() => {
    setMode(null);
    setIsSplit(false);
  }, []);

  return (
    <SubscriptionUpsertContext.Provider value={{ mode, open, close }}>
      {children}
    </SubscriptionUpsertContext.Provider>
  );
};
