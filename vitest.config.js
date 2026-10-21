import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/{unit,integration,smoke}/**/*.test.js'],
    testTimeout: 30_000,
  },
});
