import {
  createContext,
  memo,
  useContext,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import type { Route } from '../types/route.ts';

export function useNavLinks(): UseNavLinks {
  return useContext(NavLinksContext);
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
      <NavLinksContext.Provider value={{ navLinks }}>
        {children}
      </NavLinksContext.Provider>
    );
  },
);

export interface NavLinksProviderProps {
  navLinks: Array<NavLink>;
}

const NavLinksContext = createContext<UseNavLinks>({
  navLinks: [],
});
