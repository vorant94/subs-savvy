import { Navigate, createBrowserRouter } from "react-router-dom";
import { recoveryRoute } from "../../shared/lib/route.ts";
import { rootRoute } from "../../shared/lib/route.ts";
import { App } from "../ui/app.tsx";

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
					import("../../pages/dashboard/ui/dashboard.page.tsx").then((m) => ({
						// biome-ignore lint/style/useNamingConvention: 3-rd party type
						Component: m.DashboardPage,
					})),
			},
			{
				path: `/${rootRoute.subscriptions}`,
				lazy: () =>
					import("../../pages/subscription/ui/subscriptions.page.tsx").then(
						(m) => ({
							// biome-ignore lint/style/useNamingConvention: 3-rd party type
							Component: m.SubscriptionsPage,
						}),
					),
			},
			{
				path: `/${rootRoute.recovery}`,
				lazy: () =>
					import("../../pages/recovery/ui/recovery.page.tsx").then((m) => ({
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
							import("../../pages/recovery/ui/import-recovery.page.tsx").then(
								(m) => ({
									// biome-ignore lint/style/useNamingConvention: 3-rd party type
									Component: m.ImportRecoveryPage,
								}),
							),
					},
					{
						path: `/${rootRoute.recovery}/${recoveryRoute.export}`,
						lazy: () =>
							import("../../pages/recovery/ui/export-recovery.page.tsx").then(
								(m) => ({
									// biome-ignore lint/style/useNamingConvention: 3-rd party type
									Component: m.ExportRecoveryPage,
								}),
							),
					},
				],
			},
		],
	},
]);
