import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, sep } from 'node:path';
import { after, before, test } from 'node:test';
import { chromium } from 'playwright';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

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

test('raw homepage contains the real portfolio, identity, and sequential headings', async () => {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('main').count(), 1);
  assert.ok((await page.locator('main').textContent()).trim().length >= 500);
  assert.equal(await page.locator('h1').count(), 1);
  assert.match(await page.locator('h1').textContent(), /ayon1xw developer portfolio/i);
  assert.match(await page.title(), /ayon1xw.*developer portfolio/i);
  assert.equal(await page.locator('a[href="https://github.com/aoyn1xw/ShadowPlay"]').count(), 1);
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
  assert.match(text, /ShadowPlay/);
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
