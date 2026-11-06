import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { after, before, test } from 'node:test';
import { promisify } from 'node:util';
import { chromium } from 'playwright';
import { syncGitHubSnapshot } from '../scripts/sync-github.mjs';

const root = resolve('dist');
let browser;
let server;
let origin;

before(async () => {
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {})
  });
  // Emulate Pages directory indexes and real 404s; never use an SPA fallback.
  server = createServer(async (request, response) => {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = resolve(root, `.${path}`);
    let status = 200;
    try {
      assert.ok(file === root || file.startsWith(root + sep));
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      await stat(file);
    } catch {
      file = resolve(root, '404.html');
      status = 404;
    }
    const types = { html: 'text/html', css: 'text/css', js: 'text/javascript',
      txt: 'text/plain', xml: 'application/xml', md: 'text/markdown', png: 'image/png' };
    response.writeHead(status, { 'Content-Type': types[file.split('.').at(-1)] || 'application/octet-stream' });
    response.end(await readFile(file));
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  origin = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await browser?.close();
  if (server) await new Promise(done => server.close(done));
});

test('raw homepage contains the real portfolio, identity, updated tagline, and sequential headings', async () => {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');
  const markdown = await readFile(resolve(root, 'index.md'), 'utf8');
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('main').count(), 1);
  assert.ok((await page.locator('main').textContent()).trim().length >= 500);
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('.palette-trigger').count(), 0);
  assert.match(await page.locator('h1').textContent(), /ayon1xw developer portfolio/i);
  assert.match(await page.title(), /ayon1xw.*developer portfolio/i);
  assert.equal(await page.locator('.lede').textContent(), 'I build things because I can.');
  assert.equal(
    await page.locator('.sublede').textContent(),
    "Sometimes they're useful. Sometimes they're experiments. Usually both."
  );
  assert.equal(
    await page.locator('.meta').textContent(),
    'Student developer and graphic designer based in Germany.'
  );
  assert.equal(
    await page.locator('.footer-note').textContent(),
    'Made with curiosity and questionable amounts of debugging.'
  );
  assert.ok(markdown.includes('I build things because I can.'));
  assert.ok(!markdown.includes('I make software when something annoys me.'));
  assert.equal(await page.locator('#kivo-title').textContent(), 'Kivo');
  assert.equal(await page.locator('a[href="https://github.com/aoyn1xw/Kivo"]').count(), 1);
  assert.equal(await page.locator('.project-row').count(), 3);
  const levels = await page.locator('h1,h2,h3,h4,h5,h6').evaluateAll(nodes => nodes.map(n => Number(n.tagName[1])));
  for (let i = 1; i < levels.length; i++) assert.ok(levels[i] <= levels[i - 1] + 1);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://aoyn1xw.github.io/');
  await page.close();
});

test('trust pages work without JavaScript and contain substantive content', async () => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  for (const path of ['/about', '/contact', '/privacy']) {
    const response = await page.goto(origin + path);
    assert.equal(response.status(), 200, path);
    assert.equal(await page.locator('h1').count(), 1, path);
    assert.ok((await page.locator('main').innerText()).trim().length >= 500, path);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://aoyn1xw.github.io${path}/`);
    assert.equal(await page.locator('link[rel="alternate"][type="text/markdown"]').count(), 1);
    assert.ok(await page.locator('a[href="/"]').count());
    const markdown = await (await fetch(origin + path + '/index.md')).text();
    for (const paragraph of await page.locator('main section p').allTextContents()) {
      assert.ok(markdown.includes(paragraph), `${path}: Markdown matches public copy`);
    }
  }
  await page.close();
});

test('llms.txt follows the published file-list format and gives specific when-to-use guidance', async () => {
  const text = (await readFile(resolve(root, 'llms.txt'), 'utf8')).replace(/\r\n/g, '\n');
  assert.match(text, /^# ayon1xw\n\n> /);
  assert.match(text, /## When to use this/);
  assert.match(text, /Kivo/);
  assert.match(text, /manually|human/i);
  for (const section of text.split(/^## .+$/m).slice(1)) {
    for (const line of section.trim().split('\n').filter(Boolean)) {
      assert.match(line, /^- \[[^\]]+\]\(https:\/\/[^)]+\)(?:: .+)?$/);
    }
  }
});

test('every public content endpoint and machine-readable file is served and internally linked', async () => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  for (const path of ['/', '/about/', '/contact/', '/privacy/', '/commissions.html', '/commission-terms.html', '/404.html']) {
    assert.equal((await page.goto(origin + path)).status(), 200, path);
    const links = await page.locator('a[href],link[href],img[src],script[src]').evaluateAll(nodes => nodes.map(n => n.getAttribute('href') || n.getAttribute('src')));
    for (const link of links.filter(url => url.startsWith('/') && !url.startsWith('//'))) {
      assert.equal((await fetch(origin + link)).status, 200, `${path}: ${link}`);
    }
  }
  for (const path of ['/llms.txt', '/robots.txt', '/sitemap.xml', '/index.md', '/about/index.md', '/contact/index.md', '/privacy/index.md', '/404.md', '/.well-known/discord', '/google1458743846eb87e9.html']) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    assert.ok((await response.text()).trim().length > 0, path);
  }
  const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
  await page.setContent(sitemap, { waitUntil: 'domcontentloaded' });
  for (const path of ['/', '/about/', '/contact/', '/privacy/', '/commissions.html', '/commission-terms.html']) {
    assert.ok(sitemap.includes(`https://aoyn1xw.github.io${path}`), path);
  }
  assert.ok(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
  assert.deepEqual(await page.evaluate(source => {
    const document = new DOMParser().parseFromString(source, 'application/xml');
    return { valid: !document.querySelector('parsererror'), count: document.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'url').length };
  }, sitemap), { valid: true, count: 6 });
  const robots = await (await fetch(origin + '/robots.txt')).text();
  assert.match(robots, /^Sitemap: https:\/\/aoyn1xw\.github\.io\/sitemap\.xml$/m);
  const guide = await (await fetch(origin + '/llms.txt')).text();
  for (const [, path] of guide.matchAll(/\]\(https:\/\/aoyn1xw\.github\.io([^)]*)\)/g)) {
    assert.equal((await fetch(origin + path)).status, 200, `llms.txt: ${path}`);
  }
  await page.close();
});

test('Google ownership verification keeps its existing URL and token', async () => {
  const response = await fetch(origin + '/google1458743846eb87e9.html');
  assert.equal(response.status, 200);
  assert.equal((await response.text()).trim(), 'google-site-verification: google1458743846eb87e9.html');
});

test('public verifier distinguishes static successes from the three hosting blockers', async () => {
  let output;
  try {
    await promisify(execFile)(process.execPath, ['scripts/verify-public.mjs', origin]);
    assert.fail('Static hosting cannot pass Markdown negotiation and MCP discovery');
  } catch (error) {
    assert.equal(error.code, 1);
    output = JSON.parse(error.stdout);
  }
  assert.equal(output.results.length, 21);
  assert.deepEqual(output.results.filter(result => result.result !== 'PASS').map(result => [result.path, result.accept, result.result]), [
    ['/', 'text/markdown', 'FAIL'],
    ['/__agent-readiness-missing/nested/path', 'text/markdown', 'FAIL'],
    ['/.well-known/mcp', 'application/json', 'FAIL']
  ]);
});

test('unknown paths retain a 404 with useful HTML and a separate Markdown recovery document', async () => {
  for (const accept of ['text/html', 'text/markdown']) {
    const response = await fetch(origin + '/missing/nested/path', { headers: { Accept: accept } });
    assert.equal(response.status, 404);
    assert.match(await response.text(), /Page Not Found/);
  }
  // A static .md file is useful recovery content, but does not claim negotiation.
  const error = await readFile(resolve(root, '404.md'), 'utf8');
  assert.ok(error.length >= 20);
  assert.match(error, /\[.+\]\(https:\/\/aoyn1xw\.github\.io\/llms\.txt\)/);
});

test('hydration preserves typography interaction, mobile gallery, and responsive layout', async () => {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (/hydration/i.test(message.text())) errors.push(message.text()); });
    await page.goto(origin + '/');
    await page.locator('h1').hover();
    await page.waitForFunction(() => document.querySelector('h1').classList.contains('is-playing'));
    assert.equal(await page.locator('main').count(), 1);
    assert.equal(await page.locator('.project-row').count(), 3);
    if (viewport.width < 810) {
      await page.getByRole('button', { name: 'Show clips screen' }).click();
      await page.waitForFunction(() => document.querySelector('[aria-label="Show clips screen"]').getAttribute('aria-pressed') === 'true');
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    await page.close();
  }
});

test('header and keyboard shortcuts open the same palette and navigate to homepage sections', async () => {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    page.setDefaultTimeout(5000);
    await page.goto(origin + '/');
    await page.locator('.palette-trigger').waitFor({ state: 'attached' });
    if (viewport.width >= 810) await page.locator('.palette-trigger').click();
    else await page.keyboard.press('Control+k');
    const dialog = page.getByRole('dialog', { name: 'Command palette' });
    const input = page.getByRole('textbox', { name: 'Search commands' });
    await input.waitFor({ state: 'visible' });
    await page.waitForFunction(() => document.activeElement?.id === 'palette-filter');
    await input.fill('contact');
    assert.equal(await dialog.locator('.palette__row').count(), 1);
    await input.press('Enter');
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(await page.locator('#contact').evaluate(element => element === document.activeElement), true);

    // Verify legacy 'shadowplay' alias resolves to the flagship Kivo command
    await page.keyboard.press('Control+k');
    await dialog.waitFor({ state: 'visible' });
    assert.equal(await input.inputValue(), '');
    await input.fill('shadowplay');
    assert.equal(await dialog.locator('.palette__name').first().textContent(), 'kivo');
    await input.fill('');
    await input.press('ArrowDown');
    assert.equal(await dialog.locator('.palette__row').nth(1).getAttribute('aria-selected'), 'true');
    await input.press('ArrowUp');
    assert.equal(await dialog.locator('.palette__row').first().getAttribute('aria-selected'), 'true');
    await input.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    await page.close();
  }
});

test('gallery keyboard controls select both screenshots with reduced motion', async () => {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    page.setDefaultTimeout(5000);
    await page.goto(origin + '/');
    // The trigger confirms hydration has installed the page's event handlers.
    await page.locator('.palette-trigger').waitFor({ state: 'attached' });
    const gallery = page.getByLabel('Kivo app screenshots; scroll to see both screens');
    await gallery.focus();
    await gallery.press('ArrowRight');
    await page.waitForFunction(() => document.querySelector('[aria-label="Show clips screen"]').getAttribute('aria-pressed') === 'true');
    await gallery.press('ArrowLeft');
    await page.waitForFunction(() => document.querySelector('[aria-label="Show home screen"]').getAttribute('aria-pressed') === 'true');
    await page.close();
  }
});

test('More on GitHub section deduplicates featured projects, excludes forks/meta repos, clarifies counts, and supports filtering', async () => {
  const page = await browser.newPage();
  await page.goto(origin + '/');
  await page.locator('.palette-trigger').waitFor({ state: 'attached' });

  assert.equal(await page.locator('#github-repos-title').textContent(), 'More on GitHub');

  const totalCards = await page.locator('.repo-card').count();
  assert.equal(totalCards, 5, `Expected 5 non-featured discovered repos in grid, got ${totalCards}`);

  // Verify repository count label when viewing all categories
  const allCountText = (await page.locator('.repo-count').textContent()).trim();
  assert.equal(allCountText, `${totalCards} repositories`);

  const titles = (await page.locator('.repo-card__title').allTextContents()).map(t =>
    t.replace('↗', '').trim()
  );

  // Flagship and Featured projects must not be duplicated in "More on GitHub"
  assert.ok(!titles.includes('Kivo'));
  assert.ok(!titles.includes('Swift Devcontainer'));
  assert.ok(!titles.includes('IPA Signer'));
  assert.ok(!titles.includes('Untis Watcher'));

  // Excluded meta repos and forks must not appear
  assert.ok(!titles.some(t => /^\.github/i.test(t)));
  assert.ok(!titles.some(t => /^aoyn1xw$/i.test(t)));
  assert.ok(!titles.some(t => /OpenJarvis|spoti\.pw|free-llm/i.test(t)));

  // Archived repository (SSH Portfolio) is present and clearly labeled
  const archivedCard = page.locator('.repo-card', { hasText: 'SSH Portfolio' });
  assert.equal(await archivedCard.count(), 1);
  assert.equal(await archivedCard.locator('.repo-badge').textContent(), 'Archived');

  // Every card must have a non-empty summary and language label
  const summaries = await page.locator('.repo-card__summary').allTextContents();
  for (const summary of summaries) {
    assert.ok(summary.trim().length >= 15);
  }
  const languages = await page.locator('.repo-card .repo-lang').allTextContents();
  for (const lang of languages) {
    assert.ok(lang.trim().length > 0);
  }

  // Category filter narrows the grid, updates the counter, and 'All' restores it
  await page.getByRole('button', { name: 'AI & Automation' }).click();
  const aiCount = await page.locator('.repo-card').count();
  assert.equal(aiCount, 1);
  const filteredCountText = (await page.locator('.repo-count').textContent()).trim();
  assert.equal(filteredCountText, `${aiCount} of ${totalCards} repositories`);

  await page.getByRole('button', { name: 'All' }).click();
  assert.equal(await page.locator('.repo-card').count(), totalCards);

  // Link to view all repositories on GitHub is present
  assert.equal(
    await page.locator('a.repo-all-link[href="https://github.com/aoyn1xw?tab=repositories"]').count(),
    1
  );

  await page.close();
});

test('syncGitHubSnapshot paginates across pages and falls back safely to existing snapshot on failure', async () => {
  const tempDir = await mkdtemp(join(tmpdir(), 'portfolio-sync-test-'));
  const snapshotPath = join(tempDir, 'github-snapshot.json');

  try {
    const pages = {
      1: [
        { name: 'repo-beta', html_url: 'https://github.com/aoyn1xw/repo-beta', description: 'Beta tool', language: 'TypeScript', stargazers_count: 4 },
        { name: 'repo-alpha', html_url: 'https://github.com/aoyn1xw/repo-alpha', description: 'Alpha tool', language: 'Go', stargazers_count: 9 }
      ],
      2: [
        { name: 'repo-gamma', html_url: 'https://github.com/aoyn1xw/repo-gamma', description: null, language: null, stargazers_count: 1 }
      ]
    };

    const requestedUrls = [];
    const successResult = await syncGitHubSnapshot({
      username: 'aoyn1xw',
      snapshotPath,
      perPage: 2,
      maxPages: 4,
      fetchImpl: async url => {
        requestedUrls.push(url);
        const pageNum = Number(new URL(url).searchParams.get('page') || '1');
        return {
          ok: true,
          status: 200,
          json: async () => pages[pageNum] ?? []
        };
      }
    });

    assert.equal(successResult.updated, true);
    assert.equal(successResult.fallback, false);
    assert.equal(successResult.count, 3);
    assert.equal(requestedUrls.length, 2, 'Should request page 1 (full) and page 2 (partial) then stop');

    const written = JSON.parse(await readFile(snapshotPath, 'utf8'));
    assert.deepEqual(
      written.repositories.map(r => r.name),
      ['repo-alpha', 'repo-beta', 'repo-gamma']
    );

    // Simulate an API failure (e.g. HTTP 403 rate limit) and verify safe fallback
    const fallbackResult = await syncGitHubSnapshot({
      username: 'aoyn1xw',
      snapshotPath,
      fetchImpl: async () => ({
        ok: false,
        status: 403,
        json: async () => ({ message: 'API rate limit exceeded' })
      })
    });

    assert.equal(fallbackResult.updated, false);
    assert.equal(fallbackResult.fallback, true);
    assert.equal(fallbackResult.count, 3);

    const preserved = JSON.parse(await readFile(snapshotPath, 'utf8'));
    assert.equal(preserved.repositories.length, 3);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('client GitHub integration uses fresh sessionStorage cache, merges live responses without losing snapshot repos, and falls back on API error', async () => {
  const context = await browser.newContext();
  const page = await context.newPage();

  let apiRequests = 0;
  let mockStatus = 200;
  let mockPayload = [
    {
      name: 'live-api-experiment',
      html_url: 'https://github.com/aoyn1xw/live-api-experiment',
      description: 'Fetched dynamically from the mocked GitHub API',
      language: 'TypeScript',
      stargazers_count: 42,
      topics: ['automation', 'experiment'],
      fork: false,
      archived: false,
      pushed_at: '2026-11-05T12:00:00Z'
    }
  ];

  await page.route('https://api.github.com/users/aoyn1xw/repos*', async route => {
    apiRequests++;
    await route.fulfill({
      status: mockStatus,
      contentType: 'application/json',
      body: JSON.stringify(mockStatus === 200 ? mockPayload : { message: 'Service Unavailable' })
    });
  });

  // 1. Fresh sessionStorage cache should be used without making any API request
  await page.addInitScript(() => {
    window.__ALLOW_GITHUB_FETCH__ = true;
  });
  await page.goto(origin + '/');
  await page.evaluate(() => {
    window.sessionStorage.setItem(
      'ayon1xw:github-repos:v1',
      JSON.stringify({
        timestamp: Date.now(),
        data: [
          {
            name: 'cached-local-tool',
            html_url: 'https://github.com/aoyn1xw/cached-local-tool',
            description: 'Loaded from sessionStorage cache without network fetch',
            language: 'Rust',
            stargazers_count: 19,
            topics: ['cache-test'],
            fork: false,
            archived: false,
            pushed_at: '2026-11-05T10:00:00Z'
          }
        ]
      })
    );
  });

  apiRequests = 0;
  await page.reload();
  await page.locator('.repo-card', { hasText: 'Cached Local Tool' }).waitFor({ state: 'visible' });
  assert.equal(apiRequests, 0, 'Fresh sessionStorage cache must prevent redundant GitHub API requests');
  // Partial cache payload is merged with the build-time snapshot so known repos are never wiped out
  assert.equal(await page.locator('.repo-card', { hasText: 'Untis MCP' }).count(), 1);

  // 2. Expired cache triggers live API request, merges new repo with snapshot, and updates sessionStorage
  await page.evaluate(() => {
    window.sessionStorage.setItem(
      'ayon1xw:github-repos:v1',
      JSON.stringify({ timestamp: 0, data: [] })
    );
  });
  await page.reload();
  await page.locator('.repo-card', { hasText: 'Live Api Experiment' }).waitFor({ state: 'visible' });
  assert.equal(apiRequests, 1, 'Expired cache should trigger one GitHub API request');
  assert.equal(await page.locator('.repo-card', { hasText: 'Untis MCP' }).count(), 1);

  // Verify star sorting places the newly fetched 42-star repo first
  await page.getByRole('button', { name: 'Stars' }).click();
  const firstCardStars = await page.locator('.repo-card').first().locator('.repo-star').textContent();
  assert.match(firstCardStars, /★\s*42/);

  const storedCache = await page.evaluate(() =>
    JSON.parse(window.sessionStorage.getItem('ayon1xw:github-repos:v1') || 'null')
  );
  assert.ok(storedCache && Array.isArray(storedCache.data) && storedCache.data[0].name === 'live-api-experiment');

  // 3. When GitHub API fails (503) and cache is cleared, page falls back gracefully to snapshot
  mockStatus = 503;
  await page.evaluate(() => window.sessionStorage.clear());
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.reload();
  await page.locator('.palette-trigger').waitFor({ state: 'attached' });
  assert.equal(apiRequests, 2);
  assert.equal(await page.locator('.repo-card').count(), 5, 'Snapshot fallback should stay rendered on API 503');
  assert.deepEqual(errors, []);

  await context.close();
});
