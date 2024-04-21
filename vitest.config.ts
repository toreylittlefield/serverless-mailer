import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // ...
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    // TODO: add test database connection
    env: {
      NODE_ENV: 'test',
    },
  },
});
