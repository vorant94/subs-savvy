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
  topNavLinks: Array<NavLink>;
  bottomNavLinks: Array<NavLink>;
}

export interface NavLink {
  label: string;
  path: Route | string;
  icon: ReactNode;
}

export const NavLinksProvider = memo(
  ({
    children,
    topNavLinks,
    bottomNavLinks,
  }: PropsWithChildren<NavLinksProviderProps>) => {
    return (
      <navLinksContext.Provider value={{ topNavLinks, bottomNavLinks }}>
        {children}
      </navLinksContext.Provider>
    );
  },
);

export interface NavLinksProviderProps {
  topNavLinks: Array<NavLink>;
  bottomNavLinks: Array<NavLink>;
}

const navLinksContext = createContext<UseNavLinks>({
  topNavLinks: [],
  bottomNavLinks: [],
});
