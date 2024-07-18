import type { UseDefaultLayout } from './use-default-layout.tsx';

export const useDefaultLayoutMock = {
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
} as const satisfies UseDefaultLayout;
