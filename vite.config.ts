import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/',
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['terminal.local']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        commissions: resolve(import.meta.dirname, 'commissions.html'),
        commissionTerms: resolve(import.meta.dirname, 'commission-terms.html'),
        notFound: resolve(import.meta.dirname, '404.html')
      }
    }
  }
});
