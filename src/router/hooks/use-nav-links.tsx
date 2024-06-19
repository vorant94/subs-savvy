import {
  createContext,
  memo,
  useContext,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import type { Route } from '../types/route.ts';

export function useNavLinks(): UseNavLinks {
  return useContext(navLinksContext);
}

export interface UseNavLinks {
  navLinks: Array<NavLink>;
}

export interface NavLink {
  label: string;
  path: Route | string;
  icon: ReactNode;
}

export const NavLinksProvider = memo(
  ({ children, navLinks }: PropsWithChildren<NavLinksProviderProps>) => {
    return (
      <navLinksContext.Provider value={{ navLinks }}>
        {children}
      </navLinksContext.Provider>
    );
  },
);

export interface NavLinksProviderProps {
  navLinks: Array<NavLink>;
}

const navLinksContext = createContext<UseNavLinks>({
  navLinks: [],
});
