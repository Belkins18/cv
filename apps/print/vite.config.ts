import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolveCvPhone } from './cv-phone'

const src = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig(({ mode }) => ({
  // base "./" so the built page opens both from a subfolder and from the preview server.
  base: './',
  plugins: [react()],
  resolve: { alias: { '@': src } },
  build: { assetsInlineLimit: 0 },
  // The phone number arrives under one external name, CV_PHONE; the VITE_-prefixed
  // name is derived from it right here and never leaves this file. Details in
  // cv-phone.ts.
  define: {
    'import.meta.env.VITE_CV_PHONE': JSON.stringify(resolveCvPhone(mode))
  }
}))
