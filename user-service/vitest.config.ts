import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/tests/**/*.ts'],
    exclude: ['src/tests/config/server-config-tests.ts']
  },
})
