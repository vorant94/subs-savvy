import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: "happy-dom",
			clearMocks: true,
			root: "./src",
			setupFiles: ["./src/test-setup.ts"],
			coverage: {
				reportsDirectory: "../coverage",
				reporter: ["text", "html"],
				exclude: [
					"**/*.d.ts",
					"**/*.spec.ts",
					"**/*.spec.tsx",
					"**/__mocks__/*",
					"**/*.model.ts",
					"**/*.model.tsx",
					"shared/test/**",
					"shared/ui/cn.ts",
					"main.tsx",
					"app/router/router.tsx",
					"app/ui/app.tsx",
				],
			},
		},
	}),
);
