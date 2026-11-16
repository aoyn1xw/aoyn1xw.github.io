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
  for (const copy of await page.locator('.project-summary, .project-row-summary, .project-context, .project-row-context, .tags li').allTextContents()) {
    assert.ok(markdown.includes(copy.trim()), 'Project and skill copy matches the Markdown alternative');
  }
  const aboutCopy = (await page.locator('#about .prose p').textContent()).replace(/\s+/g, ' ').trim();
  assert.ok(markdown.includes(aboutCopy), 'The personal About copy matches the Markdown alternative');
  const swift = page.locator('.project-row', { hasText: 'Swift Devcontainer' });
  assert.match(await swift.locator('.project-row-context').textContent(), /Apple Developer account and an Xcode archive/);
  assert.match(await page.locator('.project-row', { hasText: 'Untis Watcher' }).textContent(), /Unmaintained/);
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
  assert.match(text, /contact methods/i);
  assert.doesNotMatch(text, /commission|\/commission-terms/i);
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
  for (const path of ['/', '/about/', '/contact/', '/privacy/']) {
    assert.ok(sitemap.includes(`https://aoyn1xw.github.io${path}`), path);
  }
  assert.ok(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
  assert.deepEqual(await page.evaluate(source => {
    const document = new DOMParser().parseFromString(source, 'application/xml');
    return { valid: !document.querySelector('parsererror'), count: document.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'url').length };
  }, sitemap), { valid: true, count: 4 });
  assert.doesNotMatch(sitemap, /commission/i);
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

    for (const [command, target] of [['projects', 'projects'], ['about', 'about'], ['top', 'identity']]) {
      await page.keyboard.press('Control+k');
      await input.waitFor({ state: 'visible' });
      await input.fill(command);
      await input.press('Enter');
      await dialog.waitFor({ state: 'hidden' });
      assert.equal(await page.locator(`#${target}`).evaluate(element => element === document.activeElement), true);
    }

    await page.keyboard.press('Control+k');
    await dialog.waitFor({ state: 'visible' });
    const names = await dialog.locator('.palette__name').allTextContents();
    assert.ok(!names.includes('commissions') && !names.includes('terms'));
    await input.fill('hire');
    assert.equal(await dialog.locator('.palette__row').count(), 0);
    await input.press('Escape');
    await dialog.waitFor({ state: 'hidden' });

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

test('hero actions and complete project details work without JavaScript and with a keyboard', async () => {
  const noScript = await browser.newPage({ javaScriptEnabled: false });
  await noScript.goto(origin + '/');
  assert.equal(await noScript.getByRole('link', { name: 'View projects' }).getAttribute('href'), '#projects');
  assert.equal(await noScript.getByRole('link', { name: 'Get in touch' }).getAttribute('href'), '#contact');
  assert.equal(await noScript.locator('.project-technical').count(), 4);
  for (const details of await noScript.locator('.project-technical').all()) {
    assert.ok((await details.textContent()).length > 150, 'Complete descriptions remain in the HTML');
    await details.locator('summary').focus();
    await noScript.keyboard.press('Enter');
    assert.equal(await details.getAttribute('open'), '');
    assert.ok(await details.locator('.project-stack').isVisible());
  }
  await noScript.close();

  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(origin + '/');
    await page.getByRole('link', { name: 'View projects' }).click();
    assert.equal(new URL(page.url()).hash, '#projects');
    for (const summary of await page.locator('.project-technical summary').all()) {
      await summary.focus();
      await summary.press('Enter');
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Homepage at ${width}px`);
    const screenshotLinks = page.locator('.shots figure a');
    assert.equal(await screenshotLinks.count(), 2);
    for (const link of await screenshotLinks.all()) {
      const image = link.locator('img');
      assert.equal(await link.getAttribute('href'), await image.getAttribute('src'));
      assert.equal((await fetch(origin + await link.getAttribute('href'))).status, 200);
    }
    await page.getByRole('link', { name: 'Get in touch' }).click();
    assert.equal(new URL(page.url()).hash, '#contact');
    assert.ok(await page.locator('#contact').isVisible());
    await page.close();
  }
});

test('retired public routes have no offering, form, payment content, or indexed discovery links', async () => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  for (const path of ['/commissions.html', '/commission-terms.html']) {
    assert.equal((await page.goto(origin + path)).status(), 200);
    assert.match(await page.locator('h1').innerText(), /retired/);
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, follow');
    assert.equal(await page.locator('form, input, textarea, .term-card, .terms-panel').count(), 0);
    assert.doesNotMatch(await page.locator('body').innerText(), /PayPal|50%|EUR|Open for commissions/);
    assert.equal(await page.locator('script[src*="request"]').count(), 0);
    assert.ok(await page.locator('a[href="https://t.me/ayon1xw"]').count());
    assert.ok(await page.locator('a[href="https://github.com/aoyn1xw"]').count());
  }
  for (const path of ['/', '/about/', '/contact/', '/privacy/', '/404.html']) {
    await page.goto(origin + path);
    assert.equal(await page.locator('a[href*="commissions.html"], a[href*="commission-terms.html"], form').count(), 0, path);
    for (const content of await page.locator('meta[content]').all()) {
      assert.doesNotMatch(await content.getAttribute('content'), /commissions|commission request/i);
    }
  }
  const markdown = await readFile(resolve(root, 'index.md'), 'utf8');
  assert.doesNotMatch(markdown, /commission/i);
  assert.ok(markdown.includes('[Get in touch](https://aoyn1xw.github.io/#contact)'));
  // Historical source stays available for a separate archival decision.
  assert.match(await readFile('commissions.html', 'utf8'), /id="commission-form"/);
  assert.match(await readFile('commission-terms.html', 'utf8'), /id="term-17"/);
  await assert.rejects(stat(resolve(root, 'og-commissions.png')), { code: 'ENOENT' });
  await page.close();
});

test('featured projects lead directly to one GitHub index link, About, and Contact without a repository browser', async () => {
  for (const javaScriptEnabled of [false, true]) {
    const page = await browser.newPage({ javaScriptEnabled });
    await page.goto(origin + '/');
    assert.equal(await page.locator('#kivo-title').textContent(), 'Kivo');
    assert.deepEqual((await page.locator('.project-title').allTextContents()).map(title => title.replace('↗', '').trim()), [
      'Swift Devcontainer', 'IPA Signer', 'Untis Watcher'
    ]);
    assert.equal(await page.locator('.project-link').count(), 4);
    assert.equal(await page.locator('.project-technical').count(), 4);
    assert.equal(await page.locator('.shots img').count(), 2);
    assert.equal(await page.locator('.repo-card, .repo-sort, .repo-filters, #github-repos-title').count(), 0);
    assert.equal(await page.getByRole('group', { name: 'Sort repositories' }).count(), 0);
    assert.equal(await page.getByRole('group', { name: 'Filter repositories by category' }).count(), 0);
    const link = page.getByRole('link', { name: 'All repositories on GitHub', exact: true });
    assert.equal(await link.count(), 1);
    assert.equal(await link.getAttribute('href'), 'https://github.com/aoyn1xw?tab=repositories');
    assert.equal((await link.textContent()).trim(), 'All repositories on GitHub ↗');
    assert.equal(await page.locator('#github-repositories a').count(), 1, 'Legacy repository anchor reaches the replacement link');
    assert.equal(await page.locator('#projects + #about').count(), 1);
    assert.ok((await page.locator('#about').innerText()).includes('I’m Erdi'));
    assert.ok((await page.locator('#contact').innerText()).includes('Telegram'));
    await page.close();
  }
  const markdown = await readFile(resolve(root, 'index.md'), 'utf8');
  assert.ok(!markdown.includes('## More on GitHub'));
  assert.ok(!markdown.includes('Untis MCP'));
  assert.ok(markdown.includes('[All repositories on GitHub](https://github.com/aoyn1xw?tab=repositories)'));
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

test('featured projects survive cached, partial live, and failed GitHub refreshes without restoring the browser', async () => {
  const context = await browser.newContext();
  const page = await context.newPage();
  let apiRequests = 0;
  let mockStatus = 200;
  const mockPayload = [{
    name: 'live-api-experiment',
    html_url: 'https://github.com/aoyn1xw/live-api-experiment',
    description: 'Fetched dynamically from the mocked GitHub API',
    language: 'TypeScript'
  }];
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.route('https://api.github.com/users/aoyn1xw/repos*', async route => {
    apiRequests++;
    await route.fulfill({
      status: mockStatus,
      contentType: 'application/json',
      body: JSON.stringify(mockStatus === 200 ? mockPayload : { message: 'Service Unavailable' })
    });
  });
  await page.addInitScript(() => { window.__ALLOW_GITHUB_FETCH__ = true; });
  await page.goto(origin + '/');
  await page.waitForFunction(() => window.sessionStorage.getItem('ayon1xw:github-repos:v1'));

  // A fresh cache must avoid redundant requests while preserving all featured content.
  apiRequests = 0;
  await page.reload();
  await page.locator('.palette-trigger').waitFor({ state: 'attached' });
  assert.equal(apiRequests, 0);
  assert.equal(await page.locator('.project, .project-row').count(), 4);
  assert.equal(await page.locator('.repo-card').count(), 0);

  // An expired cache refreshes and stores a partial live result; featured fallbacks remain.
  await page.evaluate(() => window.sessionStorage.setItem(
    'ayon1xw:github-repos:v1', JSON.stringify({ timestamp: 0, data: [] })
  ));
  await page.reload();
  await page.waitForFunction(() => JSON.parse(window.sessionStorage.getItem('ayon1xw:github-repos:v1')).timestamp > 0);
  assert.equal(apiRequests, 1);
  assert.equal(await page.locator('.project, .project-row').count(), 4);
  const stored = await page.evaluate(() => JSON.parse(window.sessionStorage.getItem('ayon1xw:github-repos:v1')));
  assert.equal(stored.data[0].name, 'live-api-experiment');
  assert.equal(await page.locator('.repo-card').count(), 0);

  // API failure must leave the full prerendered featured work and navigation intact.
  mockStatus = 503;
  await page.evaluate(() => window.sessionStorage.clear());
  await Promise.all([
    page.waitForResponse(response => response.url().includes('api.github.com') && response.status() === 503),
    page.reload()
  ]);
  assert.equal(apiRequests, 2);
  assert.equal(await page.locator('.project, .project-row').count(), 4);
  assert.equal(await page.locator('.project-technical').count(), 4);
  assert.equal(await page.locator('.repo-card').count(), 0);
  assert.deepEqual(errors, []);
  await context.close();
});
