import { cn } from '@/ui/utils/cn.ts';
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type FC,
  type PropsWithChildren,
  type ReactElement,
  type SetStateAction,
} from 'react';

export const SplitLayout: FC<SplitLayoutProps> = ({ header, left, right }) => {
  const { isSplit } = useContext(SplitLayoutContext);

  return (
    <div className={cn(`flex flex-col min-h-dvh gap-4`)}>
      {header}
      <div className={cn(`flex-1 flex flex-row gap-4`)}>
        <div className={cn(`flex flex-col flex-1 bg-blue-500`)}>{left}</div>
        {isSplit && right ? (
          <div className={cn(`flex flex-col flex-1 bg-green-500`)}>{right}</div>
        ) : null}
      </div>
    </div>
  );
};

export interface SplitLayoutProps {
  header: ReactElement<ReturnType<typeof SplitLayoutHeader>>;
  left: ReactElement;
  right?: ReactElement | null;
}

export const SplitLayoutHeader: FC<SplitLayoutHeaderProps> = ({ actions }) => {
  return (
    <header className={cn(`flex flex-row items-center bg-red-500 h-16 px-8`)}>
      <div className={cn(`flex-1`)}></div>
      <div>{actions ? actions : null}</div>
    </header>
  );
};

export interface SplitLayoutHeaderProps {
  actions?: ReactElement;
}

export const SplitLayoutContext = createContext<SplitLayoutContextModel>({
  isSplit: false,
  setIsSplit: () => {},
});

export interface SplitLayoutContextModel {
  isSplit: boolean;
  setIsSplit: Dispatch<SetStateAction<boolean>>;
}

export const SplitLayoutContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [isSplit, setIsSplit] = useState(false);

  return (
    <SplitLayoutContext.Provider value={{ isSplit, setIsSplit }}>
      {children}
    </SplitLayoutContext.Provider>
  );
};
