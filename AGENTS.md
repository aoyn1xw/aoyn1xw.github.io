# Repository instructions

## Project

Personal portfolio and commission website for ayon1xw. The homepage uses Vue 3 and TypeScript; commission pages use HTML, CSS, and JavaScript. Vite builds the static site for GitHub Pages. A separate Cloudflare Worker forwards commission requests to a private Telegram chat.

## Source map

- `src/App.vue`: homepage layout and interactions.
- `src/data/site.ts`: project, stack, "now", and contact copy with repository links.
- `src/main.ts`: homepage entry point.
- `src/styles/tokens.css`: shared design tokens.
- `src/styles/main.css` and `src/styles/commission.css`: page styles.
- `src/commissions/config.js`: commission availability, submission endpoint, and fallback contact.
- `src/commissions/request.js`: commission form behavior.
- Root HTML files: homepage, commissions, commission terms, 404, and site verification.
- `public/`: static files copied into the build, including SEO and social preview assets.
- `assets/`: fonts, cursors, project images, and background video.
- `worker/src/index.js`: commission submission backend.
- `worker/test/worker.test.mjs`: backend tests with mocked Telegram responses.
- `worker/README.md`: backend setup, secrets, and deployment instructions.
- `.github/workflows/deploy.yml`: tests, production build, and GitHub Pages deployment on pushes to `main`.
- `docs/research/`: historical redesign research and reference captures.

## Development and validation

Use the pnpm version declared in `package.json` and preserve `pnpm-lock.yaml`.

- Install dependencies: `corepack pnpm install --frozen-lockfile`.
- Start the site: `corepack pnpm dev` (configured port: 3000).
- Check types: `corepack pnpm typecheck`.
- Build for production: `corepack pnpm build` (includes type checking).
- Run backend tests: `corepack pnpm test`.
- Preview the production build: `corepack pnpm preview`.

Run the production build for frontend or build configuration changes. Run backend tests for changes to the Worker or submission behavior. For visual changes, inspect the affected pages at desktop and mobile sizes and check relevant keyboard interactions. Documentation-only edits do not require a build or backend tests. Report checks run and any checks that could not be completed.

## Change conventions

- Follow the formatting and patterns of the files being edited.
- Keep project copy in `src/data/site.ts`, shared design tokens in `src/styles/tokens.css`, and commission configuration in `src/commissions/config.js`.
- Preserve all Vite HTML entry points and their routes when changing build configuration.
- Edit source files; `dist/` and `node_modules/` are generated and ignored.
- Keep changes focused on the request and preserve unrelated user edits.
- Maintain responsive layouts, semantic HTML, visible keyboard focus, and reduced-motion behavior when changing interactions.
- Keep historical research distinct from current implementation guidance.

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
