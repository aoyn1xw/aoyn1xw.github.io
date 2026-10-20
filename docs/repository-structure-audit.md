# Repository structure audit

Audit date: 2026-10-21. This audit covers the working tree after the homepage
component split. That existing split, the pre-existing README edit, and the
untracked editor settings were preserved.

## Findings and changes

| Finding | Evidence | Change and impact |
| --- | --- | --- |
| Google ownership verification had a special build-copy step. | The root verification file was copied manually by `scripts/prerender.mjs`; other unchanged public files already live in `public/`. | Moved it to `public/google1458743846eb87e9.html` and removed the special copy step. Its contents and deployed root URL are unchanged. |
| Vite client types were configured twice. | `src/env.d.ts` contained only a `vite/client` reference, already supplied by `tsconfig.app.json` through `compilerOptions.types`. | Removed the redundant declaration file. Type checking still uses the explicit browser types configuration. |
| Three legacy assets were unreferenced. | Repository reference searches found no consumers; none appeared in the baseline production output. | Removed the files listed below. This reduces source clutter; the deployed bundle was already excluding them. |
| The site-test script switched package managers. | `package.json` pins pnpm, but `test:site` invoked `npm run build`. | Changed the nested build command to `pnpm build`, retaining the same build and test steps. |
| The source map described removed features and assets. | `AGENTS.md` still listed stack/now data, fonts, a background video, and root-level verification. | Updated the source map and README to describe the current files and test commands. |

The removed assets total 6,604,674 bytes (about 6.3 MiB):

| Former source path | Bytes |
| --- | ---: |
| `assets/video/background.mp4` | 6,532,508 |
| `assets/fonts/ndot-57-aligned.ttf` | 71,008 |
| `assets/cursor/cursor-small.png` | 1,158 |

SHA-256 comparison found no duplicate file contents across `assets/`, `public/`,
and the historical research images. The research captures remain linked from
`docs/research/redesign/handoff.md` and were retained. Removing source files does
not remove their existing Git history.

## Direct dependency usage

All seven direct dependencies have active uses. No dependency or lockfile
changes were needed.

| Dependency | Consumer |
| --- | --- |
| `vue` | Homepage components, command-palette state, browser mounting, and server rendering. |
| `@types/node` | `tsconfig.node.json` and Node imports in the Vite configuration. |
| `@vitejs/plugin-vue` | Vue component compilation in `vite.config.ts`. |
| `playwright` | Chromium browser checks in `tests/site.test.mjs`. |
| `typescript` | Compiler and type-checking support for TypeScript, Vue, and configuration files. |
| `vite` | Development, production builds, previews, and the prerender script's SSR build. |
| `vue-tsc` | The `build` and `typecheck` scripts. |

This is a usage audit of direct dependencies, not a vulnerability or transitive
dependency audit.

## Intentional separation retained

- The root HTML entry points and `about/`, `contact/`, and `privacy/` stay where
  they are. Moving them would add build complexity to preserve established URLs.
- `public/` contains files copied unchanged to the site root; `assets/` contains
  images processed and fingerprinted by Vite. These directories have different
  build responsibilities.
- The static trust-page HTML and Markdown documents are alternative public
  representations. Existing tests compare their paragraphs to prevent drift.
- `tsconfig.app.json` and `tsconfig.node.json` share several compiler settings
  but target different environments. Their browser/Node type boundaries and
  build caches remain separate; a shared base adds little value for two targets.
- The site origin appears in static metadata, crawler documents, scripts, and
  the Worker allowlist. These have different consumers. Generating every file
  from a new configuration layer would exceed this cleanup's scope.
- The Worker remains under `worker/` with its own deployment configuration,
  ignored development secrets, documentation, and mocked tests.
- The homepage and commission styles share design tokens but have separate
  layouts. Combining their styles would introduce visual risk without improving
  the repository's directory structure.
- Explicit build paths and GitHub Pages workflow settings remain unchanged.

If more static pages or TypeScript targets are added, revisit a shared static
layout or compiler-settings base. Their current duplication does not justify
introducing another generator or configuration layer.

## Preservation and validation

The seven HTML build entry points remain `/`, `/commissions.html`,
`/commission-terms.html`, `/404.html`, `/about/`, `/contact/`, and `/privacy/`.
Directory-index access and genuine missing-page 404s are covered by the site
tests. Crawler files, social previews, Markdown alternatives, Discord ownership
verification, and `/google1458743846eb87e9.html` remain available.

The production build includes type checking. The suite checks the built pages,
canonical URLs, sitemap, internal assets, JavaScript-disabled rendering,
hydration, desktop/mobile layout, keyboard interactions, reduced-motion gallery
controls, and mocked commission delivery. A focused regression check now
asserts the exact Google verification token at its existing URL.

The local validation commands are:

```sh
corepack pnpm typecheck
corepack pnpm test:site
corepack pnpm test:worker
git diff --check
```

Results: type checking and the production build passed, along with all 10 site
tests and all 20 mocked Worker tests. The baseline combined suite also passed
before file moves. After cleanup, all 28 production files have the same paths
and SHA-256 hashes as the baseline, including the Google verification file,
HTML pages, styles, scripts, Markdown documents, and crawler metadata. The
whitespace check passed. No lint command is defined in `package.json`.

The GitHub Pages deployment workflow, Worker deployment configuration, and
`pnpm-lock.yaml` are unchanged. Local artifact checks do not establish the live
host's current state; no deployment or external form submission is part of this
audit.
