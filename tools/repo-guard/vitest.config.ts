import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tools/repo-guard/**/*.test.ts'],
    root: process.cwd()
  }
})
