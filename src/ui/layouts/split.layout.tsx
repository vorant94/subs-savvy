import { cn } from '@/ui/utils/cn.ts';
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type ReactElement,
  type SetStateAction,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePrevious } from 'react-use';

export const SplitLayout = memo(({ header, left, right }: SplitLayoutProps) => {
  const { isSplit, navLinks } = useContext(SplitLayoutContext);

  return (
    <div className={cn(`flex min-h-dvh flex-col gap-4`)}>
      {header}
      <div className={cn(`flex flex-1 flex-row gap-4`)}>
        <div className={cn(`min-w-32`)}>
          <nav>
            <ol>
              {navLinks.map((navLink) => (
                <li key={navLink.path}>
                  <Link to={navLink.path}>{navLink.label}</Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <div className={cn(`flex flex-1 flex-col`)}>{left}</div>
        {isSplit && right ? (
          <div className={cn(`flex flex-1 flex-col`)}>{right}</div>
        ) : null}
      </div>
    </div>
  );
});

export interface SplitLayoutProps {
  header: ReactElement<ReturnType<typeof SplitLayoutHeader>>;
  left: ReactElement;
  right?: ReactElement | null;
}

export const SplitLayoutHeader = memo(({ actions }: SplitLayoutHeaderProps) => {
  return (
    <header className={cn(`flex h-16 flex-row items-center px-8`)}>
      <h1>Subs Savvy</h1>
      <div className={cn(`flex-1`)} />
      <div>{actions ? actions : null}</div>
    </header>
  );
});

export interface SplitLayoutHeaderProps {
  actions?: ReactElement;
}

export const SplitLayoutContext = createContext<SplitLayoutContextModel>({
  isSplit: false,
  setIsSplit: () => {},
  navLinks: [],
});

export interface SplitLayoutContextModel {
  isSplit: boolean;
  setIsSplit: Dispatch<SetStateAction<boolean>>;
  navLinks: Array<SplitLayoutNavLink>;
}

export interface SplitLayoutNavLink {
  label: string;
  path: string;
}

export const SplitLayoutContextProvider = memo(
  ({
    children,
    navLinks,
  }: PropsWithChildren<SplitLayoutContextProviderProps>) => {
    const [isSplit, setIsSplit] = useState(false);
    const { pathname } = useLocation();
    const prevPathname = usePrevious(pathname);

    useEffect(() => {
      if (pathname !== prevPathname) {
        setIsSplit(false);
      }
    }, [pathname, prevPathname, setIsSplit]);

    return (
      <SplitLayoutContext.Provider value={{ isSplit, setIsSplit, navLinks }}>
        {children}
      </SplitLayoutContext.Provider>
    );
  },
);

export interface SplitLayoutContextProviderProps {
  navLinks: Array<SplitLayoutNavLink>;
}
