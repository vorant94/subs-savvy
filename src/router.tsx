import { Navigate, createBrowserRouter } from "react-router-dom";
import { App } from "./app.tsx";
import { devOnlyRoute } from "./dev-only/types/dev-only-route.ts";
import { recoveryRoute } from "./recovery/types/recovery-route.ts";
import { rootRoute } from "./ui/types/root-route.ts";

export const router = createBrowserRouter([
	{
		path: "/",
		// biome-ignore lint/style/useNamingConvention: 3-rd party type
		Component: App,
		children: [
			{
				path: "/",
				element: (
					<Navigate
						to={`/${rootRoute.dashboard}`}
						replace
					/>
				),
			},
			{
				path: `/${rootRoute.dashboard}`,
				lazy: () =>
					import("./dashboard/pages/dashboard.page.tsx").then((m) => ({
						// biome-ignore lint/style/useNamingConvention: 3-rd party type
						Component: m.DashboardPage,
					})),
			},
			{
				path: `/${rootRoute.subscriptions}`,
				lazy: () =>
					import("./subscriptions/pages/subscriptions.page.tsx").then((m) => ({
						// biome-ignore lint/style/useNamingConvention: 3-rd party type
						Component: m.SubscriptionsPage,
					})),
			},
			{
				path: `/${rootRoute.recovery}`,
				lazy: () =>
					import("./recovery/pages/recovery.page.tsx").then((m) => ({
						// biome-ignore lint/style/useNamingConvention: 3-rd party type
						Component: m.RecoveryPage,
					})),
				children: [
					{
						path: `/${rootRoute.recovery}`,
						element: (
							<Navigate to={`/${rootRoute.recovery}/${recoveryRoute.import}`} />
						),
					},
					{
						path: `/${rootRoute.recovery}/${recoveryRoute.import}`,
						lazy: () =>
							import("./recovery/pages/import-recovery.page.tsx").then((m) => ({
								// biome-ignore lint/style/useNamingConvention: 3-rd party type
								Component: m.ImportRecoveryPage,
							})),
					},
					{
						path: `/${rootRoute.recovery}/${recoveryRoute.export}`,
						lazy: () =>
							import("./recovery/pages/export-recovery.page.tsx").then((m) => ({
								// biome-ignore lint/style/useNamingConvention: 3-rd party type
								Component: m.ExportRecoveryPage,
							})),
					},
				],
			},
			{
				path: `/${rootRoute.devOnly}`,
				children: [
					{
						path: `/${rootRoute.devOnly}`,
						element: (
							<Navigate to={`/${rootRoute.devOnly}/${devOnlyRoute.iconList}`} />
						),
					},
					{
						path: `/${rootRoute.devOnly}/${devOnlyRoute.iconList}`,
						lazy: () =>
							import("./dev-only/pages/icon-list.page.tsx").then((m) => ({
								// biome-ignore lint/style/useNamingConvention: 3-rd party type
								Component: m.IconListPage,
							})),
					},
				],
			},
		],
	},
]);
