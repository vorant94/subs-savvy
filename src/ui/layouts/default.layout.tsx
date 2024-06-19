import { useNavLinks } from '@/router/hooks/use-nav-links.tsx';
import { cn } from '@/ui/utils/cn.ts';
import { Affix, AppShell, Burger, Drawer, NavLink } from '@mantine/core';
import { memo, type PropsWithChildren, type ReactElement } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBreakpoint } from '../hooks/use-breakpoint.ts';
import { useDefaultLayout } from '../hooks/use-default-layout.tsx';

export const DefaultLayout = memo(
  ({
    header,
    children,
    drawerContent,
    drawerTitle,
  }: PropsWithChildren<DefaultLayoutProps>) => {
    const { navLinks } = useNavLinks();
    const { isDrawerOpened, isNavOpened, drawer, nav } = useDefaultLayout();
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
    const { isDrawerOpened, isNavOpened } = useDefaultLayout();

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
