import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: '.',
  base: '/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        commissionTerms: resolve(import.meta.dirname, 'commission-terms.html'),
        notFound: resolve(import.meta.dirname, '404.html')
      }
    }
  }
});
