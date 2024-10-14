import { Card, Tabs } from "@mantine/core";
import { IconDownload, IconUpload } from "@tabler/icons-react";
import { memo, useCallback, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { recoveryRoute } from "../../../shared/lib/route.ts";
import { rootRoute } from "../../../shared/lib/route.ts";
import { cn } from "../../../shared/ui/cn.ts";
import {
	DefaultLayout,
	DefaultLayoutHeader,
} from "../../../shared/ui/default.layout.tsx";
import { Icon } from "../../../shared/ui/icon.tsx";

export const RecoveryPage = memo(() => {
	const { pathname } = useLocation();
	const activeTab = useMemo(() => {
		return pathname.split("/").at(-1);
	}, [pathname]);

	const navigate = useNavigate();
	const navigateToTab = useCallback(
		(tab: string | null) => navigate(`/${rootRoute.recovery}/${tab}`),
		[navigate],
	);

	return (
		<DefaultLayout header={<DefaultLayoutHeader />}>
			<Card>
				<div className={cn("flex flex-col gap-2")}>
					<Tabs
						value={activeTab}
						onChange={navigateToTab}
					>
						<Tabs.List>
							<Tabs.Tab
								value={recoveryRoute.import}
								leftSection={<Icon icon={IconUpload} />}
							>
								Import
							</Tabs.Tab>
							<Tabs.Tab
								value={recoveryRoute.export}
								leftSection={<Icon icon={IconDownload} />}
							>
								Export
							</Tabs.Tab>
						</Tabs.List>
					</Tabs>

					<Outlet />
				</div>
			</Card>
		</DefaultLayout>
	);
});
