import {
  createContext,
  memo,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

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

export const NavLinksContext = createContext<{
  navLinks: Array<NavLink>;
}>({
  navLinks: [],
});

export interface NavLink {
  label: string;
  path: string;
  icon: ReactNode;
}
