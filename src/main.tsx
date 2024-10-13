import { MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { db } from "./shared/lib/db.ts";
import "./style.css";
import {
	browserTracingIntegration,
	replayIntegration,
	init as sentryInit,
} from "@sentry/react";
import i18next from "i18next";
import I18NextFetchBackend from "i18next-fetch-backend";
import { HMRPlugin } from "i18next-hmr/plugin";
import { initReactI18next } from "react-i18next";
import { router } from "./app/router/router.tsx";
import { supportedLanguages } from "./features/i18n/model/use-language.ts";

if (import.meta.env.DEV) {
	window.addEventListener("unhandledrejection", ({ reason }) => {
		if (reason instanceof Error) {
			console.error(reason.message);
		}
	});

	window.addEventListener("error", ({ error }) => {
		if (error instanceof Error) {
			console.error(error.message);
		}
	});
}

// setting it to the window so db is easily accessible to populate it with data during e2e tests
window.db = db;

const i18n = i18next.use(I18NextFetchBackend).use(initReactI18next);
if (import.meta.env.DEV) {
	i18n.use(
		new HMRPlugin({
			vite: {
				client: typeof window !== "undefined",
			},
		}),
	);
}

i18n.init({
	fallbackLng: "en-US",
	supportedLngs: supportedLanguages,
	interpolation: { escapeValue: false },
});

sentryInit({
	dsn: "https://585522e72addbde0c551bdb732f3ceea@o4508115159154688.ingest.de.sentry.io/4508115166494800",
	integrations: [browserTracingIntegration(), replayIntegration()],
	tracesSampleRate: 1.0,
	tracePropagationTargets: ["localhost", /^https:\/\/subs-savvy.vorant94\.io/],
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,
	enabled: !import.meta.env.DEV,
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
