import process from "node:process";
import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";
import { z } from "zod";

const dotenv = config();

const envSchema = z.object({
	// biome-ignore lint/style/useNamingConvention: env variables have different convention
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	// biome-ignore lint/style/useNamingConvention: env variables have different convention
	CI: z.coerce.boolean().default(false),
});

const env = envSchema.parse(dotenv.error ? process.env : dotenv.parsed);

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: env.CI,
	retries: env.CI ? 2 : 0,
	workers: env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		// biome-ignore lint/style/useNamingConvention: 3-rd party type
		baseURL:
			env.NODE_ENV === "production"
				? "https://subs-savvy.vorant94.io"
				: "http://localhost:5173",
		trace: "retain-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer:
		env.NODE_ENV === "production"
			? null
			: {
					command: "npm run start:dev",
					url: "http://localhost:5173",
					reuseExistingServer: !env.CI,
				},
});
