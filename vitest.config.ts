/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@astrojs/react';
import path from 'path';

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    testTimeout: 20000, // 20 seconds
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, './src/lib'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
    },
  },
});