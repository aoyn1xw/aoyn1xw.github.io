# Agent readiness on GitHub Pages

The deployment remains GitHub Pages, as requested. No hosting migration, live
deployment, commission API change, or MCP service is included in this patch.

## Implemented and checked in the production artifact

- The homepage is rendered from `src/App.vue` at build time, then hydrated by
  Vue in the browser. The same projects, layout, images, and interactions remain.
  Raw HTML contains meaningful content, one H1 with the portfolio identity, and
  sequential headings. Production SSR uses the same hashed assets as the client.
- The title and social metadata name the **ayon1xw developer portfolio**, desktop
  tools, and automation. The existing canonical domain and identity aliases stay
  intact. Better markup does not establish a top-ten search ranking.
- `/llms.txt` follows the published [llms.txt proposal](https://github.com/AnswerDotAI/llms-txt/blob/main/nbs/index.qmd):
  H1, summary blockquote, introductory guidance, and H2 sections containing linked
  file lists. “When to use this” names specific projects and jobs, explains HTTP
  retrieval, and directs commission inquiries to human review.
- `/about/`, `/contact/`, and `/privacy/` each contain more than 500 characters of
  meaningful main content without JavaScript. Directory indexes also support
  `/about`, `/contact`, and `/privacy` on Pages. They are linked in the footer and
  sitemap and share the existing design tokens.
- `/index.md`, `/about/index.md`, `/contact/index.md`, and `/privacy/index.md` are
  linked with `rel="alternate" type="text/markdown"`. `/index.md` is generated
  during the build and uses the project data from `src/data/site.ts`. Keep trust
  page Markdown in sync with its HTML; tests compare their paragraphs.
- The HTML 404 keeps its existing design and adds a site guide. Its icons use
  absolute paths so nested missing URLs can load them. `/404.md` provides an
  explicit Markdown recovery document. The Google verification file is retained
  in the build for the existing search ownership verification.

## Hosting blockers and product decisions

### Markdown 404 responses and homepage negotiation

GitHub Pages serves static files. It cannot select a body by the request's
`Accept` header or configure `Content-Type: text/markdown` and `Vary: Accept` for
the scanned homepage. An explicit `.md` document is useful to agents, but does
**not** satisfy either negotiation requirement. Unknown paths must retain HTTP
404, rather than redirecting to a 200 document or an SPA fallback.

Passing those checks requires a server or edge layer on the audited origin that
can serve HTML for `Accept: text/html`, nonempty Markdown with
`Content-Type: text/markdown` and `Vary: Accept` for `Accept: text/markdown`, and a
Markdown error body with a guide link and final HTTP 404 for missing paths.
GitHub owns `github.io`; a separately deployed Worker cannot intercept requests
to `aoyn1xw.github.io`. Choose a custom domain and dynamic hosting/edge provider
if these checks become a requirement. This requires domain and hosting account
access. Retest the actual canonical domain after any approved migration.

### MCP

This codebase has no public product API. Its only backend is a commission form
relay to a private Telegram chat. A generic GitHub MCP registry entry does not
establish that this portfolio runs that service. No `/.well-known/mcp` manifest
is published pointing to an unrelated or nonexistent server.

First choose a useful tool scope, authentication and consent rules, and a dynamic
host. Read-only portfolio/project lookup is a possible scope; automatic commission
submission is a separate product decision. A real implementation must follow the
[MCP Streamable HTTP specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)
and verify `initialize`, `notifications/initialized`, `tools/list`, and a real
`tools/call`. Discovery JSON alone cannot establish protocol support. GitHub
Pages cannot run the transport. Hosting credentials and any API credentials are
needed only once an approved service design is selected.

### Brand ranking and privacy operations

Use the existing Google ownership verification to submit the updated sitemap in
Search Console, check indexing and canonical selection, and build legitimate
links to the portfolio. These steps need the owner's search account access;
search rankings and external mentions cannot be guaranteed by a code change.
Decide a retention period for delivered commission messages if one is desired;
the privacy page accurately states that the code has no automatic deletion timer.

## Verification

Implementation verification passed: the production build and type check, all 27
tests, sitemap XML validation, linked asset checks, and JavaScript-disabled pages.
The homepage has 1,140 meaningful characters at the desktop viewport and 960 at
the mobile viewport. About, Contact, and Privacy have 1,427, 1,571, and 2,225
characters respectively. Desktop (1440px) and mobile (390px) screenshots matched
the original pixels above the footer; the footer now includes the trust links.

```sh
corepack pnpm build
corepack pnpm exec playwright install chromium
corepack pnpm test
corepack pnpm verify:public
```

For a preinstalled Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` on the test
command. CI builds before testing and installs the required browser. The tests
serve the production files with directory indexes and genuine 404s, rather than
Vite's SPA fallback. They check public pages, linked assets, all machine-readable
files, llms.txt format and links, sitemap XML, Markdown copy parity, hydration,
typography interaction, mobile gallery navigation, and commission regressions.

`verify:public` uses curl with the configured proxy, follows redirects, and checks
the **final** response headers and body. It checks 21 request variants and exits
nonzero for failures or unavailable network access. Optional argument:
`corepack pnpm verify:public -- https://your-approved-domain.example/`.
MCP discovery is checked for presence only; it cannot replace a handshake test.

The known dynamic checks should fail on GitHub Pages. This is not evidence that
those features were implemented. Verify the final production 404 and MIME types
after the owner's normal deployment. Local Pages emulation cannot establish the
production host's headers or status behavior.

The managed workspace denied HTTP access to the public site and Is Agentic API
through its destination policy during implementation. Live results and a fresh
score therefore remain unverified. The provided 61/100 report is the baseline;
do not infer a new score from local tests. Request a new audit after deployment
and confirm its `scanned_at` is newer than the changes.

Manual checks for any future approved dynamic origin:

```sh
curl -sS -L -i -H 'Accept: text/markdown' https://aoyn1xw.github.io/
curl -sS -L -i -H 'Accept: text/html' https://aoyn1xw.github.io/
curl -sS -L -i -H 'Accept: text/markdown' https://aoyn1xw.github.io/some-path-that-does-not-exist
```
