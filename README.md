
# ayon1xw

This is my website.

If you want the actual thing, just open it here:

https://aoyn1xw.github.io

## What is this?

Mostly a small portfolio / link hub for my projects, experiments, and whatever I am working on.

Nothing too deep. I just wanted one place that shows who I am, what I build, and where to find my stuff.

## What it uses

- Vue 3
- TypeScript
- Custom CSS and an interactive wordmark
- HTML and CSS for the commission pages
- Vite
- GitHub Pages
- Cloudflare Worker for the commission form (see `worker/README.md`)

## Commissions

The commission form on `/commissions.html` sends requests through a small
Cloudflare Worker to my private Telegram chat. To set that up (Telegram bot,
secrets, deploy), follow `worker/README.md`.

## Source layout

- `src/App.vue`: homepage composition and shared command-palette state.
- `src/components/layout/`: site header and footer.
- `src/components/home/`: homepage sections and the screenshot gallery, with interactions kept beside their markup.
- `src/shell/`: command palette, command registry, and keyboard navigation runtime.
- `src/data/site.ts`: project copy and repository links.
- `src/styles/`: shared design tokens, homepage styles, and commission styles.
- `src/commissions/`: request form logic and availability/endpoint configuration.
- Root HTML files: Vite entry points for the homepage, commissions, terms, and 404.
- `worker/`: Telegram delivery backend and its tests.
- `about/`, `contact/`, `privacy/`: static trust pages using the shared design tokens.
- `src/entry-server.ts` and `scripts/prerender.mjs`: build-time homepage HTML and Markdown.
- `public/`: crawler guidance, sitemap, ownership verification, social previews, and Markdown documents copied unchanged into the build.
- `assets/`: favicon and project screenshots processed by Vite.
- `tests/site.test.mjs`: production artifact, endpoint, and browser regression checks.

Use `corepack pnpm dev` for the local preview and `corepack pnpm build` for the
production build and type check. After building, run `corepack pnpm exec playwright
install chromium` once, then `corepack pnpm test` for site and backend tests.
`corepack pnpm test:site` builds and tests the site. `corepack pnpm verify:public`
checks final response headers and bodies on the public domain.

## Notes

This site is still changing whenever I feel like improving it.

Right now the goal is simple: make it look like me, show my projects, and not overcomplicate it.
