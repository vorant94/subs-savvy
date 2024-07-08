import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import postcss from './postcss.config.js';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // can't detect ESM-based postcss config by itself, see here https://github.com/vitejs/vite/issues/15869
  css: { postcss },
  test: {
    environment: 'happy-dom',
    root: './src',
    setupFiles: ['./src/test-setup.ts'],
    mockReset: true,
    coverage: {
      reportsDirectory: '../coverage',
      reporter: ['text', 'html'],
      exclude: [
        '**/types/*',
        '**/globals/*',
        '**/models/*.model.ts',
        '**/models/*.model.tsx',
        '**/models/*.mock.ts',
        '**/models/*.mock.tsx',
        '**/pages/*.pom.ts',
        '**/pages/*.pom.tsx',
        '**/components/*.com.ts',
        '**/components/*.com.tsx',
        'db/utils/populate-db.ts', // utility function for tests only
        'db/utils/clean-up-db.ts', // utility function for tests only
        'ui/hooks/use-breakpoint.ts', // a simple wrapper with mapped arguments
        'ui/utils/cn.ts', // a simple wrapper to unify two external libs
        'main.tsx', // main setup file
      ],
    },
  },
});
