import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import postcss from './postcss.config.js';

export default defineConfig({
  plugins: [react(), svgr()],
  // can't detect ESM-based postcss config by itself, see here https://github.com/vitejs/vite/issues/15869
  css: { postcss },
});
