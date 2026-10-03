import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    /*
     * Пояс поверх настоящей починки, а не вместо неё: компилятор теперь
     * запускается один раз в beforeAll (см. test/strict.test.ts), но сам запуск
     * — это `pnpm exec tsc` отдельным процессом, и на загруженном раннере CI он
     * медленнее, чем на ноутбуке. Дефолтные десять секунд на хук — слишком
     * тонкая граница для гейта, который никому нельзя научить игнорировать.
     */
    hookTimeout: 60_000
  }
})
