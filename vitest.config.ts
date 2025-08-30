import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['tests/e2e/**'],
    coverage: {
      reporter: ['text', 'html'],
      statements: 0.8,
      branches: 0.8,
      functions: 0.8,
      lines: 0.8,
      include: [
        'lib/privacy/**',
        'lib/policy*.ts',
        'app/api/leads2/**',
        'app/api/telemetry2/**',
      ],
    },
  },
});
