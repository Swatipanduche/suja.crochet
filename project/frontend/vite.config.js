import { defineConfig } from 'vite';

// Plain static-site config. The site is vanilla HTML/CSS/JS (no framework
// build step needed) — Vite is used purely for a fast local dev server with
// hot reload, and to bundle the assets for production via `npm run build`.
export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Forwards /api requests to the backend during local development so
      // the frontend can call the same relative paths in dev and prod.
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
