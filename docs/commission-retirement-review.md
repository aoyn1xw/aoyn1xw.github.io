# Commission retirement: public site and follow-up review

The public site is now a personal developer portfolio. This change removes the offering without deleting or moving its implementation or historical terms.

## Public behavior

- The homepage hero says **Get in touch** and links to `#contact`. Telegram and GitHub remain available; all four featured projects, screenshots, technical details, About, and the design are preserved.
- Commission/terms navigation, contact invitations, palette commands (including the `hire` alias), generated Markdown links, agent-guide entries, and sitemap entries are removed.
- `/commissions.html` and `/commission-terms.html` still resolve, but show a shared **retirement notice** with `noindex, follow`. There is no form, price, payment policy, historical contract text, availability promotion, or request script on either public page. These are static HTTP 200 notices, not redirects or HTTP 410 responses.
- `vite.config.ts` replaces only these two HTML inputs before Vite processes their imports, in both development and production. All existing HTML entry points remain configured. Their original source files remain intact for review. The notice uses the existing document styles.
- The commission request JavaScript is not bundled into the public build. `scripts/prerender.mjs` excludes the generated copy of `og-commissions.png`; the original image remains in `public/` for review.
- The sitemap now lists only `/`, `/about/`, `/contact/`, and `/privacy/`. Retired URLs are not linked from active public pages or advertised in SEO metadata or `llms.txt`. `robots.txt` still permits crawling so crawlers can read their noindex notices.
- Privacy continues to explain GitHub Pages, Google Fonts, external services, the repository-data session cache, past submission handling, provider storage, and how to ask about previously submitted information. The former form disclosure is explicitly historical; it does not claim past messages were deleted or the Worker was decommissioned.
- `scripts/verify-public.mjs` checks that the old routes serve notices, not live intake pages. Existing static-hosting limitations for Markdown negotiation and MCP discovery remain unchanged.

## Preserved implementation: separate archival/removal review

No items in this inventory were deleted or moved. Retained source files are not an active public offer.

| Item | Current role | Decision for a separate review |
| --- | --- | --- |
| `commissions.html` | Original form, scope lists, process, payment models, and disclosures; replaced before rendering publicly. | Keep as historical source, or move to an explicitly named archive after reviewing references. |
| `commission-terms.html` | Original historical terms, including all 17 clauses; replaced before rendering publicly. | Decide how historical agreements should be retained or made available to affected people. Do not discard automatically. |
| `src/commissions/config.js` | Preserved availability values and Worker endpoint configuration. It is no longer imported by public pages. | Decide whether to archive with the form or remove after the backend decision. The old `open` value is historical source, not displayed availability. |
| `src/commissions/request.js` | Preserved browser validation and submission implementation; not in the public JavaScript build. | Archive or remove with the form after approval. |
| `worker/` | Original Cloudflare Worker, deployment configuration, tests, and documentation. | Review the deployed service separately before disabling it, changing secrets, or removing bindings. None of those actions is performed here. |
| `src/styles/commission.css` | Shared historical page styles; **still required by the 404 page**. | Separate the 404 styles before considering removal; do not delete this file wholesale. |
| Commission aliases in `src/styles/tokens.css` | Compatibility tokens for retained styles. | Review only after dependent styles are archived/refactored. |
| `public/og-commissions.png` | Historical promotional image preserved in source and excluded from production output. | Archive or delete only after a separate decision. |
| `worker/test/worker.test.mjs`, Worker test scripts, CI test step | Continue to verify the retained backend using mocks. | Keep while the backend remains; change only together with an approved retirement plan. |
| `docs/editorial-review.md` | Historical record of the earlier copy review. | Its commission-related suggestions apply to preserved historical source, not the current public offer. Retain as context unless otherwise requested. |

The Worker may still be deployed and reachable by old clients or callers. Removing the website form does **not** disable an external service or erase prior submissions. This task does not deploy, alter live backend state, revoke credentials, or delete messages.

## Validation

- `corepack pnpm typecheck`: passed.
- `corepack pnpm build`: passed, including SSR/prerendering. GitHub sync used its documented offline snapshot fallback; prior snapshot edits are unchanged.
- `corepack pnpm test`: **35 passed, 0 failed**, covering the production site and retained Worker with mocked Telegram responses. Affected tests now assert Contact navigation, retired page content/noindex, absent promotional links/metadata, the four-entry sitemap, and no published commission social image.
- `git diff --check`: passed.
- Playwright verified all seven public HTML URLs at **320, 390, 768, and 1440px**, with no horizontal overflow or browser errors. The hero Contact jump, Telegram/GitHub links, Ctrl+K section navigation, and removal of the `hire` command were checked.
- Direct development-server checks confirm both retained HTML inputs render retirement notices, not the original form or terms.
- Byte-for-byte preservation checks passed for the original commission HTML, historical terms, form configuration and JavaScript, and all four featured project definitions. No dependencies, shared styles, backend, or deployment workflow were changed in this task.
- No merge, deployment, live service mutation, or commission-form submission was performed.

Desktop and mobile screenshots were captured and inspected locally. Temporary screenshots and detailed browser output are not included in the repository.
