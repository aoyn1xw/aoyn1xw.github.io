# Repository instructions

## Project

Personal portfolio and commission website for ayon1xw. The homepage uses Vue 3 and TypeScript with build-time prerendering (SSR) to HTML and Markdown; trust pages (`about/`, `contact/`, `privacy/`) and commission pages use static HTML, CSS, and JavaScript. Vite builds the static site for GitHub Pages. A separate Cloudflare Worker forwards commission requests to a private Telegram chat.

## Source map

- `src/App.vue`: homepage composition and shared command-palette state.
- `src/components/layout/`: site header and footer.
- `src/components/home/`: homepage sections and screenshot gallery; section-specific interactions live in their components.
- `src/shell/`: command palette (`CommandPalette.vue`), command registry (`commands.ts`), and keyboard navigation runtime (`useShell.ts`).
- `src/data/site.ts`: project and contact copy with repository links.
- `src/main.ts`: homepage client entry point (hydrates prerendered markup in production or mounts in development).
- `src/entry-server.ts` and `scripts/prerender.mjs`: SSR entry point and post-build script that prerender `dist/index.html` and generate `dist/index.md` from `src/data/site.ts`.
- `src/styles/tokens.css`: shared design tokens.
- `src/styles/main.css`, `src/styles/document.css`, and `src/styles/commission.css`: homepage, long-form document (`about/`, `contact/`, `privacy/`, `404.html`), and commission page styles.
- `src/commissions/config.js`: commission availability, submission endpoint, and fallback contact.
- `src/commissions/request.js`: commission form behavior.
- Root HTML files: homepage, commissions, commission terms, and 404 entry points.
- `about/`, `contact/`, `privacy/`: static trust HTML entry points with their existing directory routes.
- `public/`: static files copied unchanged into the build, including `llms.txt`, `robots.txt`, `sitemap.xml`, Markdown alternatives (`about/index.md`, `contact/index.md`, `privacy/index.md`, `404.md`), ownership verification (`google1458743846eb87e9.html`, `.well-known/discord`), and social preview assets.
- `assets/`: favicon and project screenshots processed by Vite.
- `tests/site.test.mjs`: Playwright and Node regression tests for the production build (`dist/`), routes, `llms.txt`, sitemap, Markdown copy parity, hydration, command palette, and keyboard navigation.
- `scripts/verify-public.mjs`: live origin verification script (`corepack pnpm verify:public`). Note that static GitHub Pages hosting cannot pass dynamic `Accept: text/markdown` negotiation or `/.well-known/mcp` discovery.
- `worker/src/index.js`: commission submission backend.
- `worker/test/worker.test.mjs`: backend tests with mocked Telegram responses.
- `worker/README.md`: backend setup, secrets, and deployment instructions.
- `.github/workflows/deploy.yml`: build, Playwright site verification, Worker tests, and GitHub Pages deployment on pushes to `main`.

## Development and validation

Use the pnpm version declared in `package.json` and preserve `pnpm-lock.yaml`.

- Install dependencies: `corepack pnpm install --frozen-lockfile`.
- Start the site: `corepack pnpm dev` (configured port: 3000).
- Check types: `corepack pnpm typecheck`.
- Build for production: `corepack pnpm build` (runs `vue-tsc -b`, `vite build`, and `scripts/prerender.mjs`).
- Install Playwright browser once before site tests: `corepack pnpm exec playwright install chromium` (or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`).
- Run all tests after building: `corepack pnpm test` (runs both Worker and Playwright site tests against `dist/`).
- Build and run site tests: `corepack pnpm test:site`.
- Run backend tests alone: `corepack pnpm test:worker`.
- Verify live public origin: `corepack pnpm verify:public`.
- Preview the production build: `corepack pnpm preview`.

Run the production build and site tests for frontend, content, or build configuration changes. Run backend tests for changes to the Worker or submission behavior. For visual changes, inspect the affected pages at desktop and mobile sizes and check relevant keyboard interactions. Documentation-only edits do not require a build or backend tests. Report checks run and any checks that could not be completed.

## Change conventions

- Follow the formatting and patterns of the files being edited.
- Keep project and contact copy in `src/data/site.ts`, shared design tokens in `src/styles/tokens.css`, and commission configuration in `src/commissions/config.js`.
- Keep homepage SSR and client hydration aligned (`src/App.vue`, `src/entry-server.ts`, `src/main.ts`), and keep trust page HTML (`about/`, `contact/`, `privacy/`), their Markdown counterparts (`public/*/index.md`), and `public/llms.txt` in sync (`tests/site.test.mjs` checks paragraph parity and links).
- Preserve all Vite HTML entry points (`index.html`, `commissions.html`, `commission-terms.html`, `404.html`, `about/index.html`, `contact/index.html`, `privacy/index.html`) and their routes when changing build configuration.
- Edit source files; `dist/` and `node_modules/` are generated and ignored.
- Keep changes focused on the request and preserve unrelated user edits.
- Maintain responsive layouts, semantic HTML, visible keyboard focus, and reduced-motion behavior when changing interactions.

## Commission backend

Read `worker/README.md` before changing backend configuration or deployment setup. Keep frontend validation and backend validation consistent; the backend must validate submissions independently.

Preserve origin restrictions, request method and body size checks, honeypot handling, generic error responses, and rate limiting that fails closed when the binding is unavailable. Keep Telegram delivery as plain text and use mocked responses in tests. Do not submit real commission requests during validation.

Never commit Telegram credentials or local environment secrets. Keep credentials in Worker secrets or ignored local environment files. Keep the frontend endpoint and Worker origin configuration consistent when either changes.

## Current documentation

<!-- context7 -->
Use Context7 MCP to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service -- even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer -- your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

### Steps

1. Always start with `resolve-library-id` using the library name and the user's question, unless the user provides an exact library ID in `/org/project` format.
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question). Use version-specific IDs when the user mentions a version.
3. `query-docs` with the selected library ID and the user's full question (not single words).
4. Answer using the fetched docs.
<!-- context7 -->
