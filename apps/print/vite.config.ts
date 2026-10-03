import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolveCvPhone } from './cv-phone'

const src = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig(({ mode }) => ({
  // base "./" — чтобы собранная страница открывалась и из подпапки, и из preview-сервера.
  base: './',
  plugins: [react()],
  resolve: { alias: { '@': src } },
  build: { assetsInlineLimit: 0 },
  // Телефон приходит под одним внешним именем CV_PHONE; имя с префиксом VITE_
  // выводится из него здесь и наружу не выходит. Подробности — в cv-phone.ts.
  define: {
    'import.meta.env.VITE_CV_PHONE': JSON.stringify(resolveCvPhone(mode))
  }
}))
