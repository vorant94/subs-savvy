import { MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	Navigate,
	RouterProvider,
	createBrowserRouter,
} from "react-router-dom";
import { db } from "./db/globals/db.ts";
import "./index.css";
import { App } from "./app.tsx";
import { recoveryRoute } from "./recovery/types/recovery-route.ts";
import { rootRoute } from "./ui/types/root-route.ts";

window.addEventListener("unhandledrejection", ({ reason }) => {
	if (import.meta.env.DEV && reason instanceof Error) {
		console.error(reason.message);
	}
});

window.addEventListener("error", ({ error }) => {
	if (import.meta.env.DEV && error instanceof Error) {
		console.error(error.message);
	}
});

// setting it to the window so db is easily accessible to populate it with data during e2e tests
window.db = db;

const router = createBrowserRouter([
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
							import("./recovery/pages/recovery-import.page.tsx").then((m) => ({
								// biome-ignore lint/style/useNamingConvention: 3-rd party type
								Component: m.RecoveryImportPage,
							})),
					},
					{
						path: `/${rootRoute.recovery}/${recoveryRoute.export}`,
						lazy: () =>
							import("./recovery/pages/recovery-export.page.tsx").then((m) => ({
								// biome-ignore lint/style/useNamingConvention: 3-rd party type
								Component: m.RecoveryExportPage,
							})),
					},
				],
			},
		],
	},
]);

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found!");
}

createRoot(rootElement).render(
	<StrictMode>
		<MantineProvider>
			<RouterProvider router={router} />
		</MantineProvider>
	</StrictMode>,
);
