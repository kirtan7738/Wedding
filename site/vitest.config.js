import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}', 'scripts/**/*.test.{js,mjs}'],
    exclude: ['e2e/**', 'node_modules/**'],
    testTimeout: 30000,
    setupFiles: ['./src/test/setup.js'],
  },
});
