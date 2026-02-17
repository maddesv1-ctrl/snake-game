import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  base: '/snake-game/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Copy public assets to dist
    copyPublicDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});