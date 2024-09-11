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
					"**/*.stub.ts",
					"**/*.stub.tsx",
					"**/__mocks__/*",
					"**/types/*",
					"**/globals/*",
					"**/models/*.model.ts",
					"**/models/*.model.tsx",
					"**/pages/*.pom.ts",
					"**/pages/*.pom.tsx",
					"**/components/*.com.ts",
					"**/components/*.com.tsx",
					"**/utils/*.matchers.ts",
					"db/utils/populate-db.ts", // utility function for tests only
					"db/utils/clean-up-db.ts", // utility function for tests only
					"ui/utils/cn.ts", // a simple wrapper to unify two external libs
					"main.tsx", // main setup file
					"router.tsx", // part of main file, standalone only because this one is big on its own
					"dev-only/*", // internal dev-only modules
				],
			},
		},
	}),
);
