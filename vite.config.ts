import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/',
  plugins: [
    vue(),
    {
      name: 'retired-commission-pages',
      // Keep the original implementation and terms in source for review, but
      // replace their public entry points before Vite follows scripts/assets.
      transformIndexHtml: {
        order: 'pre',
        handler(html, context) {
          const retiredPages = ['commissions.html', 'commission-terms.html']
            .map(page => resolve(import.meta.dirname, page));
          if (!retiredPages.includes(context.filename)) return html;
          return readFileSync(resolve(import.meta.dirname, 'src/retired-page.html'), 'utf8');
        }
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['terminal.local']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        commissions: resolve(import.meta.dirname, 'commissions.html'),
        commissionTerms: resolve(import.meta.dirname, 'commission-terms.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
        about: resolve(import.meta.dirname, 'about/index.html'),
        contact: resolve(import.meta.dirname, 'contact/index.html'),
        privacy: resolve(import.meta.dirname, 'privacy/index.html')
      }
    }
  }
});
