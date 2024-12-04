import { defineConfig, mergeConfig } from "vitest/config";
import postcss from "./postcss.config.ts";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
	viteConfig,
	defineConfig({
		// can't detect ESM-based postcss config by itself, see here https://github.com/vitejs/vite/issues/15869
		// despite vitest v6 doesn't have this problem, vitest under the hood still uses v5
		css: { postcss },
		test: {
			environment: "happy-dom",
			clearMocks: true,
			root: "./src",
			setupFiles: ["./src/test-setup.ts"],
			coverage: {
				provider: "v8",
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
