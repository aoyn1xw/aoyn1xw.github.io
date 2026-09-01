# Design QA

## Comparison target

- Source visual truth: `C:\Users\ayon1xw\Downloads\Codex Image Sep 1, 2026, 09_22_06 AM.png`
- Implementation: `design-qa-artifacts/implementation-desktop-2048x922.png`
- Desktop CSS viewport: 2048 x 922, device scale factor 1
- Source pixels: 2532 x 1170
- Raw implementation capture: 2033 x 916 pixels; the browser capture excludes its scrollbar/chrome edge
- Density normalization: implementation scaled to 2532 x 1170 for visual comparison
- State: identity scene, idle particle wordmark
- Full-view comparison: `design-qa-artifacts/comparison-full.png`
- Focused comparison: `design-qa-artifacts/comparison-focus.png`
- Mobile evidence: `design-qa-artifacts/implementation-mobile-390x844.png` plus live browser checks at 390 x 844

## Findings

No actionable P0, P1, or P2 findings remain.

- Fonts and typography: the implementation preserves the source's extreme hierarchy using a condensed display face, small uppercase mono metadata, vertical labels, and a readable sans for short copy. The first profile pass compressed the two display lines too aggressively; line height and tracking were relaxed on desktop and mobile.
- Spacing and layout rhythm: both full and focused comparisons keep the same dominant centered object, large black field, asymmetric perimeter information, and sparse framing. The implementation deliberately does not reproduce the source sculpture or copy; the particle identity is the requested replacement.
- Colors and tokens: near-black, off-white, muted gray, one blue-violet accent, and thin low-opacity rules are consistently centralized in CSS tokens. There are no decorative gradients, glass surfaces, or multicolor glow systems.
- Image quality and asset fidelity: the identity is a live Canvas 2D system rather than a fake raster asset. The ShadowPlay scene uses the repository's actual Flutter screenshots at their native aspect ratio; no project screenshot was invented.
- Copy and content: identity, location, stack, selected repositories, commission status, and contact links come from the existing site or current local project sources. No metrics, clients, achievements, or testimonials were added.
- Accessibility and behavior: semantic landmarks and headings are present, all navigation is keyboard reachable, visible focus outlines were observed, alternative text is present for project images, reduced motion produces a static readable particle wordmark, and the 390 px layout has no horizontal overflow.
- Interaction: pointer movement visibly disturbs the particle field and the spring/damping system reforms it. Internal navigation, the selected-work anchors, and the commission route were exercised in the browser.
- Console: the application produced no source warnings or errors. One Brave extension connection error appeared during browser control and is unrelated to the page bundle.

## Comparison history

1. Initial desktop capture: P1 — the visible fallback wordmark rendered beneath the transparent particle canvas, producing a doubled solid/dotted identity. Fixed by moving fallback text inside the canvas element so supported browsers display only the particle field.
2. Initial mobile profile capture: P2 — display line height and negative tracking caused `THINGS I / NEED TO USE` to collide. Fixed by increasing line height and reducing negative tracking; the revised 390 x 844 capture is readable while retaining the intended aggressive scale.
3. Post-fix comparison: full and focused comparisons show the source's compositional principles preserved with no remaining P0/P1/P2 mismatch.

## Follow-up polish

- P3: revisit the exact blue-violet hue after viewing on the final physical display; it is intentionally restrained and may read slightly different across panels.
- P3: real Windows desktop screenshots can be added to the ShadowPlay scene later if the project gains curated capture assets.

## Verification evidence

- Browser-rendered desktop: 2048 x 922 identity, profile, ShadowPlay, selected work, and contact scenes inspected.
- Browser-rendered mobile: 390 x 844 identity, profile, ShadowPlay, selected work, and contact scenes inspected.
- Primary interactions: pointer field disturbance/reconstruction, anchor navigation, keyboard focus order, selected project links, and commission page navigation.
- Reduced motion: `prefers-reduced-motion: reduce` emulated and confirmed; canvas remained mounted with readable semantic identity text.
- Browser console: checked for warnings and errors.

## Commission route addendum

### Comparison target

- Source visual truth: `C:\Users\ayon1xw\Downloads\Codex Image Sep 1, 2026, 09_22_06 AM.png`
- Existing-route source capture: `design-qa-artifacts/commission-before-desktop.png`
- Final desktop implementation: `design-qa-artifacts/commission-implementation-hero-final.png`
- Desktop CSS viewport and implementation pixels: 1440 x 900, device scale factor 1
- Mobile evidence: `design-qa-artifacts/commission-mobile-hero-v3.png`, `design-qa-artifacts/commission-mobile-process-v2.png`, and `design-qa-artifacts/commission-mobile-form-ready.png`
- Mobile CSS viewport and implementation pixels: 390 x 844, device scale factor 1
- Density normalization: source and desktop implementation were each fit inside a 720 x 450 black canvas for an equal-size comparison.
- State: commission intake hero, limited availability
- Full-view comparison: `design-qa-artifacts/commission-reference-comparison.png`
- Focused evidence: `design-qa-artifacts/commission-scene-process.png`, `design-qa-artifacts/commission-scene-payment.png`, and `design-qa-artifacts/commission-scene-request.png`

### Commission findings

No actionable P0, P1, or P2 findings remain.

- Fonts and typography: the commission page uses the portfolio's condensed display, neutral body, and mono technical families. The source reference's extreme scale contrast and perimeter typography are present without copying its artwork. Display wrapping remains deliberate and readable at 1440 px and 390 px.
- Spacing and layout rhythm: the former narrow stacked document is replaced by four composed scenes. The desktop hero preserves the source's central mass, negative space, asymmetry, frame, and edge metadata. Mobile uses a separate one-column process track and vertically recomposed request scene.
- Colors and tokens: the route reuses the same near-black, off-white, muted gray, blue-violet accent, border opacity, timing, and easing values as the portfolio. The light payment panel is a deliberate high-contrast editorial interruption rather than an additional color system.
- Image quality and asset fidelity: this route does not require product imagery. No artwork, screenshots, logos, icons, or fake product assets were introduced. The requested technical framing is drawn by the shared layout system.
- Copy and content: the existing real commission scope, exclusions, payment models, revisions, delivery methods, status, privacy note, and acknowledgement language remain represented. No prices, clients, metrics, achievements, or acceptance claims were invented.
- Accessibility and behavior: one semantic H1, labelled sections, keyboard-accessible navigation, visible focus states, high-contrast inputs, error regions, disabled submit behavior, and reduced-motion CSS are present. The existing form names, IDs, validation, status binding, honeypot, endpoint, and Telegram handoff remain unchanged.
- Interaction: internal Process and Request navigation, live status labels, invalid username and short-description errors, character counting, acknowledgements, and the valid enabled state were exercised in Brave. The final Telegram submission was intentionally not sent.
- Console: no page-source warnings or errors were observed during desktop or mobile commission-route checks.

### Commission comparison history

1. Baseline capture: P1 — the route was a long, narrow series of ordinary stacked sections and did not share the portfolio's scene-based composition. Fixed by reorganizing the same content into identity, scope, protocol/payment, and private-intake scenes.
2. Initial mobile request capture: P2 — the fixed registration label crossed form content, and the description hint could collide with its counter. Fixed by simplifying mobile frame density and assigning the counter its own row.
3. Initial mobile hero capture: P2 — the vertical edge label crossed the body copy and the main display word cropped too aggressively. Fixed by removing that secondary mobile label and tightening the mobile display scale.
4. Post-fix comparison: the combined source/implementation image and revised desktop/mobile captures show no remaining P0/P1/P2 mismatch.

### Commission follow-up polish

- P3: the final blue-violet intensity can be tuned after viewing the page on the target physical display.
- P3: the complete terms route intentionally retains its existing document treatment; it can receive a separate art-directed pass if requested.

### Commission verification evidence

- Browser-rendered desktop: hero, scope, eight-step process, payment split, project details, and request scene inspected at 1440 x 900.
- Browser-rendered mobile: hero, process, request form, acknowledgements, ready-to-submit state, and footer inspected at 390 x 844.
- Primary interactions: internal anchors, field validation, character counter, acknowledgement checkboxes, disabled/enabled submit state, scroll progress, and scene metadata changes.
- Privacy boundary: synthetic local form data was used and no request was submitted to the Telegram Worker.
- Production verification: Vite production build passed and emitted `dist/commissions.html`; all 17 Worker tests passed; `dist/.well-known/discord` remains present.

final result: passed
