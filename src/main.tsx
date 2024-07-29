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
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { appEn } from "./app.i18n.ts";
import { App } from "./app.tsx";
import { expensesByCategoryEn } from "./dashboard/components/expenses-by-category.i18n.tsx";
import { devOnlyRoute } from "./dev-only/types/dev-only-route.ts";
import { recoveryRoute } from "./recovery/types/recovery-route.ts";
import { addSubscriptionButtonEn } from "./subscriptions/components/add-subscription-button.i18n.ts";
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

i18next.use(initReactI18next).init({
	fallbackLng: "en",
	interpolation: { escapeValue: false },
	resources: {
		en: {
			translation: {
				...addSubscriptionButtonEn,
				...appEn,
				...expensesByCategoryEn,
			},
		},
	},
});

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
