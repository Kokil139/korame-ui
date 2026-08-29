import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  /**
   * The SSR build (`vite build --ssr src/entry-server.jsx`) exists only to
   * feed scripts/prerender.mjs. It is written to `.ssr/`, imported once per
   * route in Node, and deleted by the pre-render script when it finishes.
   *
   * `noExternal` matters: by default Vite leaves dependencies out of an SSR
   * bundle and lets Node resolve them, which fails for packages that only
   * publish browser-targeted ESM. Bundling these three keeps the pre-render
   * step working regardless of how each package declares its exports.
   */
  ssr: {
    noExternal: ['motion', 'motion-dom', 'react-router-dom', 'react-router'],
  },
  build: {
    // Slightly above the default so the one-bundle warning reflects reality.
    chunkSizeWarningLimit: 700,
  },
})
