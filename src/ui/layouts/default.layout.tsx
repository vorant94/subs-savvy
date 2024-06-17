import { NavLinksContext } from '@/router/providers/nav-links.provider.tsx';
import { useBreakpoint } from '@/ui/hooks/use-breakpoint.ts';
import type { Disclosure } from '@/ui/types/disclosure.ts';
import { cn } from '@/ui/utils/cn.ts';
import { Affix, AppShell, Burger, Drawer, NavLink } from '@mantine/core';
import { useDisclosure, usePrevious } from '@mantine/hooks';
import {
  createContext,
  memo,
  useContext,
  useEffect,
  type PropsWithChildren,
  type ReactElement,
} from 'react';
import { Link, useLocation } from 'react-router-dom';

export const DefaultLayout = memo(
  ({
    header,
    children,
    drawerContent,
    drawerTitle,
  }: PropsWithChildren<DefaultLayoutProps>) => {
    const { navLinks } = useContext(NavLinksContext);
    const { isDrawerOpened, isNavOpened, drawer, nav } =
      useContext(DefaultLayoutContext);
    const { pathname } = useLocation();
    const isMd = useBreakpoint('md');

    return (
      <>
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 200,
            breakpoint: 'sm',
            collapsed: { mobile: !isNavOpened },
          }}
          padding="md">
          <AppShell.Header className={cn(`flex items-center gap-2 px-4`)}>
            <Burger
              opened={isNavOpened}
              onClick={nav.toggle}
              hiddenFrom="sm"
              size="sm"
            />
            {header}
          </AppShell.Header>

          <AppShell.Navbar p="md">
            <ol>
              {navLinks.map((navLink) => (
                <li key={navLink.path}>
                  <NavLink
                    component={Link}
                    to={navLink.path}
                    label={navLink.label}
                    leftSection={navLink.icon}
                    active={pathname.startsWith(navLink.path)}
                  />
                </li>
              ))}
            </ol>
          </AppShell.Navbar>

          <AppShell.Main className={cn(`flex flex-col`)}>
            {children}
          </AppShell.Main>
        </AppShell>

        <Drawer
          offset={8}
          radius="md"
          position={isMd ? 'right' : 'bottom'}
          onClose={drawer.close}
          opened={isDrawerOpened}
          title={drawerTitle}>
          {drawerContent}
        </Drawer>
      </>
    );
  },
);

export interface DefaultLayoutProps {
  header: ReactElement<ReturnType<typeof DefaultLayoutHeader>>;
  drawerTitle?: string;
  drawerContent?: ReactElement | null;
}

export const DefaultLayoutHeader = memo(
  ({ actions, children }: PropsWithChildren<DefaultLayoutHeaderProps>) => {
    const isMd = useBreakpoint('md');
    const { isDrawerOpened, isNavOpened } = useContext(DefaultLayoutContext);

    return (
      <>
        <h1 className={cn(`w-[192px]`)}>Subs Savvy</h1>
        {children ? <div>{children}</div> : null}
        <div className={cn(`flex-1`)} />
        {actions ? (
          isMd ? (
            <div>{actions}</div>
          ) : typeof isMd !== 'undefined' && !isDrawerOpened && !isNavOpened ? (
            <Affix position={{ bottom: 20, right: 20 }}>
              <div>{actions}</div>
            </Affix>
          ) : null
        ) : null}
      </>
    );
  },
);

export interface DefaultLayoutHeaderProps {
  actions?: ReactElement;
}

export const DefaultLayoutContext = createContext<{
  isDrawerOpened: boolean;
  drawer: Disclosure;
  isNavOpened: boolean;
  nav: Disclosure;
}>({
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

export const DefaultLayoutContextProvider = memo(
  ({ children }: PropsWithChildren) => {
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
  },
);
