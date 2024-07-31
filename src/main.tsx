import { MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { db } from "./db/globals/db.ts";
import "./index.css";
import i18next from "i18next";
import I18NextFetchBackend from "i18next-fetch-backend";
import { HMRPlugin } from "i18next-hmr/plugin";
import { initReactI18next } from "react-i18next";
import { router } from "./router.tsx";

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

const instance = i18next.use(I18NextFetchBackend).use(initReactI18next);
if (import.meta.env.DEV) {
	instance.use(
		new HMRPlugin({
			vite: {
				client: typeof window !== "undefined",
			},
		}),
	);
}

instance.init({
	fallbackLng: "en",
	interpolation: { escapeValue: false },
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
