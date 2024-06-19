import { useDisclosure, usePrevious } from '@mantine/hooks';
import {
  createContext,
  memo,
  useContext,
  useEffect,
  type PropsWithChildren,
} from 'react';
import { useLocation } from 'react-router-dom';
import type { Disclosure } from '../types/disclosure.ts';

export function useDefaultLayout(): UseDefaultLayout {
  return useContext(DefaultLayoutContext);
}

export interface UseDefaultLayout {
  isDrawerOpened: boolean;
  drawer: Disclosure;
  isNavOpened: boolean;
  nav: Disclosure;
}

export const DefaultLayoutProvider = memo(({ children }: PropsWithChildren) => {
  const [isDrawerOpened, drawer] = useDisclosure(false);
  const [isNavOpened, nav] = useDisclosure(false);
  const { pathname } = useLocation();
  const prevPathname = usePrevious(pathname);

  useEffect(() => {
    if (pathname !== prevPathname) {
      nav.close();
    }
  }, [nav, pathname, prevPathname]);

  return (
    <DefaultLayoutContext.Provider
      value={{ isDrawerOpened, drawer, isNavOpened, nav }}>
      {children}
    </DefaultLayoutContext.Provider>
  );
});

const DefaultLayoutContext = createContext<UseDefaultLayout>({
  isDrawerOpened: false,
  drawer: {
    open: () => {},
    close: () => {},
    toggle: () => {},
  },
  isNavOpened: false,
  nav: {
    open: () => {},
    close: () => {},
    toggle: () => {},
  },
});
