import path from "node:path";
import process from "node:process";
import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import { i18nextHMRPlugin } from "i18next-hmr/vite";
import postcssNested from "postcss-nested";
import postcssPresetMantine from "postcss-preset-mantine";
import postcssSimpleVars from "postcss-simple-vars";
import tailwindcss from "tailwindcss";
import tailwindcssNesting from "tailwindcss/nesting";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import dotenvConfig from "./dotenv.config.ts";

export default defineConfig({
	// inlining PostCSS config instead of separate file, because of this
	// https://github.com/vitejs/vite/issues/15869 and this
	// https://github.com/remix-run/react-router/issues/12472
	css: {
		postcss: {
			plugins: [
				tailwindcss,
				autoprefixer,
				cssnano,
				tailwindcssNesting(postcssNested),
				postcssPresetMantine,
				postcssSimpleVars({
					variables: {
						"mantine-breakpoint-xs": "640px",
						"mantine-breakpoint-sm": "768px",
						"mantine-breakpoint-md": "1024px",
						"mantine-breakpoint-lg": "1280px",
						"mantine-breakpoint-xl": "1536px",
					},
				}),
			],
		},
	},
	plugins: [
		dotenvConfig.NODE_ENV !== "test" && reactRouter(),
		svgr(),
		i18nextHMRPlugin({
			localesDir: path.resolve(process.cwd(), "public/locales"),
		}),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				// biome-ignore lint/style/useNamingConvention: 3-rd party type
				theme_color: "white",
			},
		}),
	],
});
