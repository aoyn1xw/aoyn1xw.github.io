# Portfolio editorial review

Reviewed on 16 November 2026 on `feature/portfolio-editorial-improvements`.

This review covers the homepage, all four featured projects, About, Contact, commissions, Privacy, the terms page, the 404 page, metadata, the Markdown alternatives, the agent guide, command palette copy, form guidance, errors, status labels, accessibility labels, and social preview artwork. It is an editorial pass; styles, layout rules, routes, command actions, validation rules, and backend behavior are unchanged.

## Audit findings and decisions

| Area | Specific weakness | Decision |
| --- | --- | --- |
| Hero | Skill labels mix platforms, abbreviations, and broad claims. | Name apps and interfaces plainly; call AI work experiments. Keep the tagline, follow-up, identity, and two hero actions. |
| Projects | Introductory summaries lean on implementation terms. The Swift entry’s “no Xcode” slogan hides an Xcode-archive setup requirement, and its Theos wording suggests it is always preinstalled. | Lead with each tool’s use, retain the personal reason and complete technical detail, and state documented requirements and limitations. |
| Homepage About | Repeats the student/location introduction and almost the same skills inventory. | Use a short personal paragraph about building tools for myself. Keep the two public handles visually emphasized. |
| About route | Repeats the hero verbatim and explains what a portfolio is; the tools paragraph reads like a résumé inventory. | Give the page its own introduction, connect the projects to their uses, and describe learning through them. Keep the personal-project support limitation. |
| Contact | “For the project you mean” sounds dismissive; “fastest way” implies an unverified response comparison. | Give direct next steps, keep the private-information warnings, and align the fallback route with the form’s ambiguous-delivery message. |
| Commissions | “Limited number” implies scarcity even though configuration comments explicitly avoid artificial scarcity. “Confirm before transmission” and abstract brief language sound mechanical. | Invite small, scoped requests in the first person; explain what to include and what each field accepts. Keep every scope restriction, payment model, process step, acknowledgement, and disclosure. |
| Terms | Navigation summaries use formal filler such as “interactive preview examination”; “Standard Clauses” implies a standardized legal document. | Edit navigation and introductory summaries only. Preserve all 17 clause bodies, legal callouts, exceptions, effective dates, support provisions, and legal information. Flag conflicts below. |
| Privacy | Existing disclosures do not explicitly explain the GitHub API refresh or session cache. | Add a paragraph verified against the actual client code. Preserve every existing policy paragraph, provider link, deletion qualification, and retention disclosure. |
| Microcopy | Error messages say “under” limits that are inclusive. A link says “Submit” when it only opens the form. Palette copy varies in specificity and capitalization. | Correct the wording without changing limits or actions; use “Open request form,” “Commands,” “Find a command…,” and “See my PlayStation trophies.” |
| 404 | “Requested resource” and “new route” sound impersonal and assume a reason for the missing page. | Give a plain first-person recovery message, keeping all recovery links. |
| Alternate formats | Copy exists in HTML, Vue, generated Markdown, static Markdown, metadata, and the agent guide. | Synchronize edited copy; share homepage copy through `src/data/site.ts`; add regression checks for project/skills/About parity. |
| Social previews | The homepage PNG still contains “I make software when something annoys me.” | Flag for a separate artwork text update; do not silently redraw an image during a text-only pass. The commissions image already matches the offer. |

## Evidence and accuracy

Only existing personal facts and documented implementation details were used. No professional experience, usage figures, credentials, performance results, or planned features were added. The original project status labels remain: **Active MVP**, **Published**, **Published**, and **Unmaintained**. Existing archived/experimental metadata for other projects was not changed.

Repository documentation checked:

- [Kivo README](https://github.com/aoyn1xw/Kivo/blob/main/README.md), blob `f0fb6a85d7bbb013c99c69b83885c9d68e9c076e`: implemented Windows tray app, completed recordings, QR pairing, original-file LAN downloads, and read-only recording behavior. [Flutter README](https://github.com/aoyn1xw/Kivo/blob/main/flutter/README.md), blob `5505bf5a0780d48a30a2bb5522c132fa3a23bfb7`, confirms the implemented mobile client. No roadmap features were promoted into copy.
- [Swift Devcontainer README](https://github.com/aoyn1xw/swift-devcontainer/blob/main/README.md), blob `cc8435ec4a48db45984d500bba10629cd3dcf1f7`: Swift, xtool, zsign, optional Theos setup, three development environments, Apple Developer account/Xcode archive requirements, and no Simulator/SwiftUI previews.
- [IPA Signer README](https://github.com/aoyn1xw/ipa-signer/blob/main/README.md), blob `f5e44fc55f402ae8da112cc50bc792291cf6f1a7`, and [package manifest](https://github.com/aoyn1xw/ipa-signer/blob/main/package.json), blob `1ed3e5fb82d709f4932ab563a31b7b503900161c`: Node.js/Express, web/API signing, user-supplied credentials, over-the-air installation links, worker-thread signing, and Docker tooling. Avoided the README’s unmeasured speed superlative and did not imply that signing credentials are safe to send to an arbitrary public demo.
- [Untis Watcher repository and README](https://github.com/aoyn1xw/Untis-watcher): the public page describes timetable monitoring and Telegram notifications and says maintenance stopped after Untis access ended. **Limit:** the GitHub connector returned 404, while the web tool supplied an indexed public page last crawled two months earlier. Current repository availability/archive metadata could not be independently confirmed. Kept the existing technical description, source URL, maintenance label, and reason; the summary rewrite adds no new capability. Do not treat this as a fresh runtime verification.
- [Untis MCP README](https://github.com/aoyn1xw/untis-mcp/blob/main/README.md), blob `02e27013ad54463725a7c71ce5f089d274ecaea4`: the agent guide’s existing experimental, unofficial, local/read-only description is supported. Only its displayed name was normalized.

The privacy addition was checked against `src/data/github.ts`: the homepage still refreshes featured project data, keeps public repository responses in session storage, and reuses a fresh response for 15 minutes. The wording does **not** promise deletion after 15 minutes. Commission disclosure wording was checked against `src/commissions/request.js`, `worker/src/index.js`, and `worker/README.md`; no real request was submitted.

## Before and after

The following comparisons describe implemented changes. Repeated HTML/Markdown copies are listed once; their counterparts were synchronized.

### Homepage introduction and About

| Before | After | Why |
| --- | --- | --- |
| Web, desktop & mobile · UI/UX & graphic design · Linux, Docker & self-hosting · AI agents & automation | Web, desktop & mobile apps · Interfaces & graphic design · Linux, Docker & self-hosting · AI & automation experiments | Clarify what the labels refer to and keep experiments honest. |
| I’m Erdi, a student developer and graphic designer based in Germany. I build web, desktop, and mobile applications alongside UI/UX, graphic design, and visual identities. Most of my free time goes into Linux, Docker, cloud, and self-hosting setups, or experimenting with AI agents, automation, and local language models. I use the name ayon1xw here and aoyn1xw on GitHub. | I’m Erdi. I like building tools I can use myself, from getting game clips onto my phone to working on iOS apps from Linux. I go by ayon1xw here and aoyn1xw on GitHub. | Replace repeated biography and skills with existing personal motivations. |
| Longer version | More about me | Name the destination. |

Retained verbatim: “I build things because I can.”, “Sometimes they're useful. Sometimes they're experiments. Usually both.”, the student/designer/location line, “View projects,” “Discuss a project,” “All repositories on GitHub,” and “Made with curiosity and questionable amounts of debugging.”

### Projects and contact routes

| Location | Before | After | Reason |
| --- | --- | --- | --- |
| `src/data/site.ts` | Browse finished game clips from my PC and download the original files to my phone over the local network. | Get the original game clips from my PC onto my phone, without a cloud upload. | Lead with the practical use and keep the local transfer claim supported by Kivo’s README. |
| `src/data/site.ts` | The NVIDIA App writes .mp4 files into a recordings folder I choose. A small tray app watches that folder, waits until a clip is completely written, and serves it on the local network. The phone pairs over a QR code and pulls the original files — nothing is uploaded, re-encoded, or moved. | A Windows tray app watches my NVIDIA recordings folder and shares only completed .mp4 files. The Flutter client pairs by QR code and downloads the originals over the local network. Kivo only reads the recordings; it doesn’t upload, re-encode, or move them. | Keep the personal reason, explain the implemented components, and retain the read-only behavior. |
| `src/data/site.ts` | Build and sign iOS apps on Linux — no Mac, no Xcode. | Build and sign iOS apps from Linux. | Remove an overbroad no-Xcode claim: the documented setup still needs an Xcode archive. |
| `src/data/site.ts` | I do not own a Mac, so I built the machine I needed: a container with Swift, xtool to cross-compile for iOS, zsign to sign, and Theos for tweaks. It runs from a Codespace, from VS Code, or as a Docker Compose stack with code-server inside. | I don’t own a Mac, so I put together a Linux container with Swift, xtool for iOS builds, and zsign for signing. It runs in Codespaces, VS Code, or Docker Compose with code-server. Theos setup for tweaks is optional. The xtool setup still needs an Apple Developer account and an Xcode archive; there’s no Simulator or SwiftUI preview. | Retain the existing personal motivation, distinguish optional setup, and state documented limitations. |
| `src/data/site.ts` | Docker Hub image, one-click Codespace | Docker Hub image and Codespaces setup | Avoid implying that required onboarding and Apple tooling disappear after one click. |
| `src/data/site.ts` | Sign an IPA with your own certificate and provisioning profile, from a browser or the API. | Sign iOS app files from a browser or script, using your own certificate and provisioning profile. | Explain IPA signing in introductory language without changing credential requirements. |
| `src/data/site.ts` | Signing usually means a Mac and Xcode. This is a small Node.js server instead: upload the IPA, a .p12 and a .mobileprovision, and it hands back an OTA install link. zsign runs in a worker thread so the server stays responsive, and the Docker image ships zsign and cyan already inside. | I built this to put IPA signing behind a web form and API. The Node.js server takes an .ipa file, a .p12 certificate, and a .mobileprovision profile, then returns an over-the-air install link. It runs zsign in a worker thread, and the Docker image includes zsign and cyan. Read the repository’s setup and security notes before using it with signing credentials. | Replace a broad claim about signing workflows with the actual implementation and a relevant documentation pointer. |
| `src/data/site.ts` | Watch my Untis timetable and get a Telegram message when a lesson changes. | A Telegram bot I built to catch timetable changes without checking Untis myself. | Make the personal reason clear; preserve the existing unmaintained status and technical detail. |
| `src/data/site.ts` | Direct messages — the fastest way to reach me. | Send me a message directly. | Describe the channel without an unverifiable response-speed comparison. |
| `src/data/site.ts` | Questions about the code. Use the repository and its issues for the project you mean. | Questions or bugs? Start with the relevant repository and its issues. | Give a clear next step without sounding dismissive. |
| `src/data/site.ts` | Read the terms first. Requests are reviewed by hand before anything is agreed. | Have a small project in mind? Read the scope and terms, then send a request. I review each one myself. | Make the invitation warmer while keeping manual review explicit. |
| `src/data/site.ts` | Every route in one place, including how the request form handles data. | More detail on where to ask and what to include in your message. | Explain why the separate contact page is useful rather than repeating the list. |

### About, Contact, and Privacy routes

| Location | Before | After | Reason |
| --- | --- | --- | --- |
| `about/index.html` | I’m Erdi, a student developer and graphic designer based in Germany. I use the name ayon1xw on this portfolio and aoyn1xw on GitHub. I build things because I can: sometimes they’re useful, sometimes they’re experiments, and usually both. This website is my personal developer portfolio, built to explain what I work on, share source repositories, and help people find the right project. | I’m Erdi, a student developer and graphic designer in Germany. I go by ayon1xw here and aoyn1xw on GitHub. I like having a project to try things on, whether that’s an app, a container, or a small automation script. This is where I keep the ones I want to share. | Introduce the person without repeating the hero or explaining what a portfolio is. |
| `about/index.html` | My work spans web, desktop, and mobile applications alongside UI/UX, graphic design, and visual identities. Kivo helps me browse finished game clips from my Windows PC and download the original files to my phone over the local network, using a Flutter client. Other projects include a devcontainer that builds and signs iOS apps on Linux without a Mac, a Node.js server that signs an IPA with my own certificate and provisioning profile, and small AI agent, MCP, and automation experiments. | A lot of my projects start with something I want to use myself. Kivo gets game clips from my PC onto my phone. Swift Devcontainer gives me a Linux environment for iOS builds, and IPA Signer puts signing behind a web form and API. I also work on interfaces, graphic design, and visual identities. The project entries explain what’s implemented and where each tool’s limits are. | Connect the documented projects to existing personal motivations without repeating their technical descriptions. |
| `about/index.html` | I mostly write C# for Windows and the web, TypeScript and JavaScript for the front end and tooling, Python for automation and AI experiments, Dart for mobile clients, and Swift where an Apple toolchain is needed. Linux, Docker, cloud, self-hosting, GitHub Actions, and local language models fill the gaps. Every technology named here shows up in one of my repositories, or in the build of this site. | The projects here use C# and .NET, TypeScript and JavaScript, Python, Dart and Flutter, and Swift tooling. Linux, Docker, and GitHub Actions are part of the setup around them. I also experiment with AI agents, automation, and local language models. I’m still a student, and these projects give me somewhere to learn by building. | Describe demonstrated tools without an unnecessary blanket verification claim or résumé-like inventory. |
| `contact/index.html` | For questions about something I made, start with my GitHub profile and the repository linked from the portfolio. Read the repository’s README and check existing issues before opening a new one, where issues are enabled. Include the project name, what you expected to happen, the steps to reproduce a problem, and relevant version information. Keep passwords, private keys, personal information, and confidential source code out of public issues. | For a question or bug report, start with the relevant repository. Its README and existing issues may already have an answer. If you open an issue, include what you expected, what happened, steps to reproduce it, and the version you’re using. Keep passwords, private keys, personal information, and confidential source code out of public issues. | Give a clear route and practical checklist while preserving the sensitive-information warning. |
| `contact/index.html` | For a small development commission, read the commissions page and commission terms before using the request form. The form asks for a Telegram username, a project description, and optional deadline and reference links. Requests are manually reviewed. Sending a request is not acceptance of the work, confirmation of a delivery date, or agreement to a price; scope, timing, and price are discussed before a commission is accepted. | Have a small project in mind? Read the commissions page and commission terms, then send a request. The form asks for your Telegram username and a project description; a preferred deadline and reference links are optional. I review each request myself. Sending a request is not acceptance of the work, confirmation of a delivery date, or agreement to a price; scope, timing, and price are discussed before a commission is accepted. | Make the invitation personal while preserving the full non-acceptance statement. |
| `contact/index.html` | Telegram @ayon1xw is the direct route and the fastest way to reach me. It is also the fallback if the commission form cannot send your request. My links profile lists the other public profiles. Choose the route that fits your question and send only the information needed to understand it. For a question about information you submitted, contact me on Telegram and identify the request without posting its contents publicly. The privacy page explains how the website and request form handle data. | You can message me directly on Telegram at @ayon1xw. If the form cannot confirm that a request was sent, message me there before retrying so we can avoid a duplicate. My links profile lists my other public profiles. Send only what I need to understand your question. For a question about information you submitted, identify the request privately on Telegram rather than posting its contents publicly. The privacy page explains how the website and form handle data. | Remove an unverified speed claim and align retry guidance with the existing ambiguous-delivery error state. |
| `privacy/index.html` | This page does not claim that visiting a hosted website produces no server logs. | This page does not claim that visiting a hosted website produces no server logs. The homepage may also request public repository data from GitHub’s API. It keeps a copy in session storage and reuses it for up to 15 minutes before trying to refresh it. This cache contains repository data, not commission submissions, and is not used to track visitors. | Disclose the actual GitHub API request and session cache without changing existing privacy commitments. |

### Commissions and terms navigation

| Location | Before | After | Reason |
| --- | --- | --- | --- |
| `commissions.html` | COMMISSION INTAKE | COMMISSIONS | Use the same familiar page name as navigation. |
| `commissions.html` | I take on a limited number of small, clearly scoped programming projects. Send what you need; I’ll check the fit before discussing scope and price. | I take on small programming projects with a clear scope. Tell me what you want to make or fix, and I’ll check whether it’s a good fit before we discuss scope and price. | Make the invitation welcoming without implying artificial scarcity; retain fit review before agreement. |
| `commissions.html` | Describe the outcome, constraints, and what already exists. I’ll reply privately on Telegram if the request is a possible fit. | Tell me what you want to make or fix, what you already have, and any constraints. I’ll reply privately on Telegram if the request looks like a fit. | Replace abstract brief language with useful questions and keep the conditional reply. |
| `commissions.html` | What should be built, what it’s for, and anything already decided. At least 50 characters. | What should it do, who is it for, and what already exists? Include any constraints. At least 50 characters. | Help visitors write a useful request without changing validation. |
| `commissions.html` | Free text. This is preferred, not guaranteed. | A date or rough timeframe is fine. This is a preference, not a guaranteed delivery date. | Explain the free-text field and retain the deadline disclaimer. |
| `commissions.html` | One URL per line, up to five. Files can follow on Telegram. | One full http:// or https:// link per line, up to five. You can send files later on Telegram. | Match the actual URL validation and attachment route. |
| `commissions.html` | Confirm before transmission | Before you send | Replace machine-like wording without changing the acknowledgements. |
| `commissions.html` | SMALL DOES NOT MEAN VAGUE. THE BOUNDARY IS THE BRIEF. | A CLEAR BRIEF HELPS. TELL ME WHAT YOU NEED. | Keep the understated two-line note without sounding confrontational. |
| `commissions.html` | Eight checkpoints. Every accepted job gets a clear scope, an individual EUR quote, and an agreed delivery path before work begins. | Here’s how a request becomes a finished project. Before work begins, we agree on the scope, a quote in EUR, and how I’ll deliver it. | Explain the process naturally while retaining agreement before work begins. |
| `commission-terms.html` | Explore 17 clauses | Read the terms | Describe the destination plainly. |
| `commission-terms.html` | CLAUSE DIRECTORY | TERM INDEX | Use a familiar label for the index. |
| `commission-terms.html` | 17 Standard Clauses | 17 clauses | Remove the unsupported implication that these are standardized legal clauses. |
| `commission-terms.html` | Ground rules governing request evaluation, strict boundary definitions, individualized quotes, payment arrangements, and active development. | How I review requests, agree on the scope and price, and handle payment before work begins. | Replace formal overview language without changing any underlying clause. |
| `commission-terms.html` | Provisions outlining revision allowances, interactive preview examination, file and repository handoff, post-delivery bug fixes, and refund guidelines. | What happens during review, what gets delivered, and how revisions, bug fixes, cancellations, and refunds work. | Use direct language to introduce the same clauses. |
| `commission-terms.html` | Legal definitions governing intellectual property handoff, portfolio showcase rights, mutual responsibilities, third-party limitations, and direct communication. | Ownership, portfolio use, responsibilities, third-party services, and questions about these terms. | Avoid implying a legal opinion in a navigation summary. |
| `commission-terms.html` | If your project fits these parameters and you agree with these conditions, send your requirements through the private intake form. | If your project fits the scope and you agree to these terms, tell me about it through the request form. | Make the invitation readable without changing its prerequisites. |
| `commission-terms.html` | Submit commission request | Open request form | This link opens a form; it does not submit one. |
| `commission-terms.html` | Submit request | Open request form | Describe the index link’s actual action. |

### Microcopy, recovery, and metadata

| Location | Before | After | Reason |
| --- | --- | --- | --- |
| `404.html` | The requested resource could not be found or has been moved to a new route. | I couldn’t find that page. Check the address or head back to the portfolio. | Use a human recovery message and avoid assuming that the page has moved. |
| `404.html` | Commission intake | Commissions | Use the page name visitors see elsewhere. |
| `src/commissions/request.js` | Keep the deadline under 100 characters. | Use 100 characters or fewer for the preferred deadline. | The validator permits exactly 100 characters. |
| `src/commissions/request.js` | Keep each reference link under 500 characters. | Use 500 characters or fewer for each reference link. | The validator permits exactly 500 characters. |
| `src/commissions/request.js` | Keep the combined reference links under 700 characters. | Use 700 characters or fewer across all reference links. | The validator permits exactly 700 characters. |
| `src/commissions/request.js` | Please fix the highlighted fields and try again. | Check the fields with error messages, then try again. | Do not rely on a visual highlight alone to explain recovery. |
| `src/commissions/request.js` | Commissions are currently closed | Commission requests are currently closed | Describe availability as requests rather than already accepted work. |
| `src/shell/commands.ts` | see my playstation trophies lol | See my PlayStation trophies | Keep the personal aside while using consistent sentence case and the correct product name. |
| `src/shell/CommandPalette.vue` | placeholder="Go to…" | placeholder="Find a command…" | Describe the input as a search field. |
| `src/shell/CommandPalette.vue` | >No match | >No matching commands. | Make the empty state explicit. |
| `src/components/layout/SiteHeader.vue` | Go to | Commands | Name what the shortcut button opens. |
| `index.html` | ayon1xw — student developer building desktop tools, automation projects, and local-first experiments. | Apps, small tools, and experiments by ayon1xw, a student developer and graphic designer in Germany. | Keep search, social, and structured descriptions factual and consistent with the visible introduction. |
| `index.html` | Desktop tools, automation projects, and local-first experiments by ayon1xw. | Apps, small tools, and experiments by ayon1xw, a student developer and graphic designer in Germany. | Keep search, social, and structured descriptions factual and consistent with the visible introduction. |
| `index.html` | Student developer building desktop tools, automation projects, and local-first experiments. | Student developer and graphic designer building apps, small tools, and experiments. | Keep search, social, and structured descriptions factual and consistent with the visible introduction. |
| `404.html` | 404Page Not Found | 404 Page Not Found | Separate the number from the title so the visible and accessible heading does not join two words. |

### Agent guide and metadata

- The Swift entry now includes its documented Apple Developer account/Xcode archive requirements and Simulator/SwiftUI-preview limitations.
- The Untis Watcher entry now explicitly says it is unmaintained and the author no longer has Untis access, instead of sounding like an actively supported recommendation.
- “Untis MCP” uses the project’s displayed capitalization; its URL and experimental/unofficial caveats are unchanged.
- The agent introduction and homepage search/social/structured descriptions now consistently describe apps, small tools, and experiments. No titles, canonical URLs, ownership tokens, sitemap entries, or robots directives were changed.
- The original duplicated Kivo lead-in was removed from generated Markdown; project descriptions, skills, and About text are now checked against the rendered HTML.

## Remaining concerns and wording for personal approval

These were deliberately **not** resolved by choosing a policy, inventing a guarantee, or changing functionality.

| Concern | Existing wording or behavior | Proposed decision or wording; not implemented |
| --- | --- | --- |
| Payment conflict | Clause 4 allows full upfront payment or a deposit. Its callout and the commissions page describe no upfront payment for small jobs and a 50/50 split for larger jobs. | Choose the actual policy first. If the two models are authoritative, a possible replacement is: “Small projects need no upfront payment: I show a preview, and you pay in full before delivery. Larger projects use a 50% deposit, with the rest due after the preview and before delivery.” This changes the full-upfront option and needs your approval. |
| Response expectation | The page says “USUALLY < 24H.” Success copy says you normally contact the sender within 24 hours; the form introduction promises a reply only if the request looks like a fit. | Confirm whether every sender receives a reply and whether 24 hours is realistic. If not, consider “I review requests myself and reply on Telegram if the project looks like a fit.” Do not add a new response guarantee without your approval. |
| Revision and ownership summaries | The revision callout is more absolute than the clause’s “Unless otherwise agreed”/“up to” wording. The ownership callout says “Full rights,” while the clause has exceptions and retained materials. | Confirm how you want summaries qualified. They remain unchanged; this review does not determine legal effect or enforceability. |
| Scope lists differ | The terms explicitly list login systems among unsuitable requests; the commissions list mentions payment systems but not login systems. | Confirm the intended restriction before harmonizing the lists. No scope item was added or removed. |
| Homepage social image | `public/og-image.png` still has the previous tagline baked into the PNG. | Replace the embedded sentence with “I build things because I can.” while preserving the artwork. The image is unchanged here; there is no editable source/generator in the repository, and this pass does not redraw assets. |
| Untis Watcher availability | Current connector fetches returned 404, but an indexed public README remains available. | Confirm whether the repository was made private, renamed, or removed before changing its link or asserting a current GitHub archive flag. |
| Palette help | “List available commands” currently closes the palette: the `status` action has no visible handler. | A separate behavior fix could keep/show the command list. The command, aliases, description, and action were left intact to preserve functionality in this editorial pass. |
| Worker README absolute | The developer README says “Nothing is stored,” although the delivered message exists in Telegram and providers process requests. | The public privacy text already uses qualified wording and remains intact. If developer documentation is included in a later pass, use “No submission database is created; delivered messages are stored by Telegram under its policies.” |

The personal identity, student description, location, public handles, and existing “I don’t own a Mac” motivation were retained from supplied copy. No extra personal information was researched or added. No claims of professional experience were introduced.

## Change inventory and preservation

- `src/data/site.ts`: shared homepage copy, project summaries/details, Swift setup status note, and contact guidance. All four project names, source URLs, technology lists, and status labels remain.
- `src/components/home/HeroSection.vue`, `AboutSection.vue`, and `src/entry-server.ts`: render the shared editorial copy and synchronize Markdown. Existing markup structure and emphasis are preserved.
- `about/index.html`, `contact/index.html`, `public/about/index.md`, and `public/contact/index.md`: corresponding paragraphs updated together; support, request-acceptance, privacy, and sensitive-information caveats remain.
- `privacy/index.html` and `public/privacy/index.md`: one matching factual cache/API disclosure added; all original policy paragraphs remain unchanged.
- `commissions.html`: offer, form hints, legend, and non-contractual process introduction edited. Validation constraints, acknowledgements, scope lists, payment models, all process steps, delivery/revision/support rules, and privacy disclosure remain.
- `commission-terms.html`: index labels, section-introduction summaries, and form-navigation wording edited. All 17 clause articles, including every legal callout, remain byte-for-byte unchanged. Effective/updated dates are unchanged.
- `404.html` and `public/404.md`: aligned recovery sentence and clearer commissions link.
- `src/commissions/request.js`: message strings only; inclusive-limit wording and nonvisual error recovery. Submission logic, validation, limits, payload, rate limiting, delivery, and success/failure behavior are unchanged.
- `src/shell/commands.ts`, `CommandPalette.vue`, and `src/components/layout/SiteHeader.vue`: display strings only; names, aliases, targets, keyboard behavior, and actions are unchanged.
- `index.html` and `public/llms.txt`: factual metadata and agent guidance aligned with the reviewed descriptions.
- `tests/site.test.mjs`: existing test extended to check project/skills/About Markdown parity, Swift setup caveat, and the unmaintained label. The suite remains at 35 tests.
- Stylesheets, design tokens, project screenshots, social artwork, dependencies, backend, deployment configuration, route URLs, source links, and unrelated working-tree edits were not changed by this editorial pass.

## Validation

- `corepack pnpm typecheck`: passed.
- `corepack pnpm build`: passed. The GitHub snapshot refresh used its documented offline fallback; the pre-existing snapshot edits were preserved byte-for-byte.
- `corepack pnpm test`: **35 passed, 0 failed** (15 site tests and 20 Worker tests with mocked Telegram responses).
- `git diff --check` and JavaScript syntax check: passed.
- Final Playwright checks: all seven public routes at **320, 390, 768, and 1440px** fit without horizontal overflow. Expanded project descriptions, palette navigation and empty-state copy, and form error guidance were checked. No browser errors or commission-form submissions occurred.
- Preservation checks: all **17 contract clause articles and their callouts** are byte-for-byte unchanged; all original privacy paragraphs and public HTML link destinations are unchanged. AST-based comparison confirms the commission client edits change string values only.
- Styles, tokens, dependencies, backend, deployment configuration, public routes, and existing project status labels were not changed in this pass. No merge, commit, push, or deployment was performed.

Desktop and mobile screenshots were captured and inspected locally, including expanded project details. These temporary verification artifacts are not included in the repository.
