import process from "node:process";
import { defineConfig, devices } from "@playwright/test";
import { z } from "zod";

export const envSchema = z.object({
	// biome-ignore lint/style/useNamingConvention: env variables have different convention
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	// biome-ignore lint/style/useNamingConvention: env variables have different convention
	CI: z.coerce.boolean().default(false),
});

const env = envSchema.parse(process.env);

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: env.CI,
	retries: env.CI ? 2 : 0,
	workers: env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		// biome-ignore lint/style/useNamingConvention: 3-rd party type
		baseURL: "http://localhost:5173",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: "npm run start:dev",
		url: "http://localhost:5173",
		reuseExistingServer: !env.CI,
	},
});
