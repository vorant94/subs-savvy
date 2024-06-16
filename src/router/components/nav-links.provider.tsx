import {
  createContext,
  memo,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

export const NavLinksContext = createContext<NavLinksContextModel>({
  navLinks: [],
});

export interface NavLinksContextModel {
  navLinks: Array<NavLink>;
}

export interface NavLink {
  label: string;
  path: string;
  icon: ReactNode;
}

export const NavLinksContextProvider = memo(
  ({ children, navLinks }: PropsWithChildren<NavLinksContextProviderProps>) => {
    return (
      <NavLinksContext.Provider value={{ navLinks }}>
        {children}
      </NavLinksContext.Provider>
    );
  },
);

export interface NavLinksContextProviderProps {
  navLinks: Array<NavLink>;
}
