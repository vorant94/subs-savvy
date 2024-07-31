import path from "node:path";
import process from "node:process";
import react from "@vitejs/plugin-react-swc";
import { i18nextHMRPlugin } from "i18next-hmr/vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import postcss from "./postcss.config.js";

export default defineConfig({
	plugins: [
		react(),
		svgr(),
		i18nextHMRPlugin({
			localesDir: path.resolve(process.cwd(), "public/locales"),
		}),
	],
	// can't detect ESM-based postcss config by itself, see here https://github.com/vitejs/vite/issues/15869
	css: { postcss },
});
