import { NavLinksContext } from '@/router/components/nav-links.provider.tsx';
import { cn } from '@/ui/utils/cn.ts';
import { AppShell, Burger, Drawer, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  createContext,
  memo,
  useContext,
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
    const { isDrawerOpened, drawer } = useContext(DefaultLayoutContext);
    const [isNavOpened, nav] = useDisclosure();
    const { pathname } = useLocation();

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
          <AppShell.Header>
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
          position="right"
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
    return (
      <div className={cn(`flex h-16 flex-row items-center gap-4`)}>
        <h1 className={cn(`min-w-[200px] pl-8`)}>Subs Savvy</h1>
        {children ? <div>{children}</div> : null}
        <div className={cn(`flex-1`)} />
        {actions ? <div className={cn('pr-8')}>{actions}</div> : null}
      </div>
    );
  },
);

export interface DefaultLayoutHeaderProps {
  actions?: ReactElement;
}

export const DefaultLayoutContext = createContext<DefaultLayoutContextModel>({
  isDrawerOpened: false,
  drawer: {
    open: () => {},
    close: () => {},
    toggle: () => {},
  },
});

export interface DefaultLayoutContextModel {
  isDrawerOpened: boolean;
  drawer: {
    open: () => void;
    close: () => void;
    toggle: () => void;
  };
}

export const DefaultLayoutContextProvider = memo(
  ({ children }: PropsWithChildren) => {
    const [isDrawerOpened, drawer] = useDisclosure(false);

    return (
      <DefaultLayoutContext.Provider value={{ isDrawerOpened, drawer }}>
        {children}
      </DefaultLayoutContext.Provider>
    );
  },
);
