import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'happy-dom',
      root: './src',
      setupFiles: ['./src/test-setup.ts'],
      coverage: {
        reportsDirectory: '../coverage',
        reporter: ['text', 'html'],
        exclude: [
          '**/*.spec.*',
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
          'date/utils/date-matchers.ts', // test matchers, that are used in tests only
          'db/utils/populate-db.ts', // utility function for tests only
          'db/utils/clean-up-db.ts', // utility function for tests only
          'ui/hooks/use-breakpoint.ts', // a simple wrapper with mapped arguments
          'ui/utils/cn.ts', // a simple wrapper to unify two external libs
          'main.tsx', // main setup file
        ],
      },
    },
  }),
);
