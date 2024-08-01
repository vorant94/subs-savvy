import {
	Affix,
	AppShell,
	Burger,
	Drawer,
	NavLink as MantineNavLink,
} from "@mantine/core";
import { type PropsWithChildren, type ReactElement, memo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useBreakpoint } from "../hooks/use-breakpoint.tsx";
import { useDefaultLayout } from "../hooks/use-default-layout.tsx";
import { type NavLink, useNavLinks } from "../hooks/use-nav-links.tsx";
import { cn } from "../utils/cn.ts";

export const DefaultLayout = memo(
	({
		header,
		children,
		drawerContent,
		drawerTitle,
	}: PropsWithChildren<DefaultLayoutProps>) => {
		const { topNavLinks, bottomNavLinks } = useNavLinks();
		const { isDrawerOpened, isNavOpened, drawer, nav } = useDefaultLayout();
		const isMd = useBreakpoint("md");

		return (
			<>
				<AppShell
					header={{ height: 60 }}
					navbar={{
						width: 200,
						breakpoint: "sm",
						collapsed: { mobile: !isNavOpened },
					}}
					padding="xl"
				>
					<AppShell.Header className={cn("flex items-center gap-2 px-4")}>
						<Burger
							opened={isNavOpened}
							onClick={nav.toggle}
							hiddenFrom="sm"
							size="sm"
						/>
						{header}
					</AppShell.Header>

					<AppShell.Navbar p="md">
						<ol className={cn("flex flex-1 flex-col")}>
							{topNavLinks.map((navLink) => (
								<DefaultLayoutNavLink
									key={navLink.path}
									{...navLink}
								/>
							))}

							<div className="flex-1" />

							{bottomNavLinks.map((navLink) => (
								<DefaultLayoutNavLink
									key={navLink.path}
									{...navLink}
								/>
							))}
						</ol>
					</AppShell.Navbar>

					<AppShell.Main className={cn("flex flex-col bg-gray-100")}>
						{children}
					</AppShell.Main>
				</AppShell>

				<Drawer
					offset={8}
					radius="md"
					position={isMd ? "right" : "bottom"}
					onClose={drawer.close}
					opened={isDrawerOpened}
					title={drawerTitle}
				>
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
		const isMd = useBreakpoint("md");
		const { isDrawerOpened, isNavOpened } = useDefaultLayout();

		return (
			<>
				<h1 className={cn("w-[192px]")}>Subs Savvy</h1>
				{children ? <div>{children}</div> : null}
				<div className={cn("flex-1")} />
				{actions ? (
					isMd ? (
						<div>{actions}</div>
					) : !isDrawerOpened && !isNavOpened ? (
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

const DefaultLayoutNavLink = memo(
	({ path, label, icon }: DefaultLayoutNavLinkProps) => {
		const { pathname } = useLocation();
		const { t } = useTranslation();

		return (
			<li>
				<MantineNavLink
					component={Link}
					to={path}
					label={t(label)}
					leftSection={icon}
					active={pathname.startsWith(path)}
				/>
			</li>
		);
	},
);

interface DefaultLayoutNavLinkProps extends NavLink {}
