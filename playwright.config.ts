import { defineConfig, devices } from "@playwright/test";
import { config } from "./vite.config.ts";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: config.CI,
	retries: config.CI ? 2 : 0,
	workers: config.CI ? 1 : undefined,
	reporter: "html",
	use: {
		// biome-ignore lint/style/useNamingConvention: 3-rd party type
		baseURL:
			config.NODE_ENV === "production"
				? "https://subs-savvy.pages.dev"
				: "http://localhost:5173",
		trace: "retain-on-failure",
		...devices["Desktop Chrome"],
	},
	webServer:
		config.NODE_ENV === "production"
			? undefined
			: {
					command: "npm run start:dev",
					url: "http://localhost:5173",
					reuseExistingServer: !config.CI,
				},
});
