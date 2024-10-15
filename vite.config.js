import path from "node:path";
import process from "node:process";
import react from "@vitejs/plugin-react-swc";
import { i18nextHMRPlugin } from "i18next-hmr/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import postcss from "./postcss.config.js";

export default defineConfig({
	plugins: [
		react(),
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
	// can't detect ESM-based postcss config by itself, see here https://github.com/vitejs/vite/issues/15869
	css: { postcss },
});
