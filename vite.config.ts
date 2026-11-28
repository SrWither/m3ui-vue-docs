import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [vue(), tailwindcss()],
  // Loaded only when a signed PDF is saved (a dynamic import inside the linked library): pre-bundled up front, or the
  // dev server finds it late and the first save fails on a stale chunk
  optimizeDeps: { include: ['pdf-lib'] },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
