import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

// Use a production SSR bundle so image URLs match the hashed client assets.
const ssrDirectory = resolve('node_modules/.cache/portfolio-ssr');
await build({
  build: {
    ssr: resolve('src/entry-server.ts'),
    outDir: ssrDirectory,
    emptyOutDir: true,
    rollupOptions: { input: resolve('src/entry-server.ts') }
  }
});
const { render, renderMarkdown } = await import(pathToFileURL(resolve(ssrDirectory, 'entry-server.js')).href);
const file = resolve('dist/index.html');
const html = await readFile(file, 'utf8');
const placeholder = '<div id="app"></div>';
if (!html.includes(placeholder)) throw new Error('Homepage render placeholder is missing');
await writeFile(file, html.replace(placeholder, `<div id="app">${await render()}</div>`));
await writeFile(resolve('dist/index.md'), renderMarkdown());
