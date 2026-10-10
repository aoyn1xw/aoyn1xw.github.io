import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const origin = new URL(process.argv[2] || 'https://aoyn1xw.github.io/');
if (!['http:', 'https:'].includes(origin.protocol)) throw new Error('Use an HTTP or HTTPS origin');
const text = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const contentPages = ['/', '/about/', '/contact/', '/privacy/', '/commissions.html', '/commission-terms.html'];
const checks = contentPages.map(path => ({ path, accept: 'text/html', verify: response =>
  response.status === 200 && response.type.startsWith('text/html') && text(response.body).length >= 500 }));
for (const path of ['/index.md', '/about/index.md', '/contact/index.md', '/privacy/index.md', '/404.md', '/llms.txt', '/robots.txt', '/sitemap.xml', '/.well-known/discord', '/google1458743846eb87e9.html']) {
  checks.push({ path, accept: '*/*', verify: response => response.status === 200 && response.body.trim().length > 0 });
}
checks.push({ path: '/404.html', accept: 'text/html', verify: response => response.status === 200 && /Page Not Found/i.test(response.body) });
checks.push({ path: '/', accept: 'text/markdown', verify: response => response.status === 200
  && response.type.split(';')[0].trim() === 'text/markdown'
  && response.vary.split(',').some(value => value.trim().toLowerCase() === 'accept')
  && response.body.trim().length > 0 && /^# /m.test(response.body) });
for (const accept of ['text/html', 'text/markdown']) {
  checks.push({ path: '/__agent-readiness-missing/nested/path', accept, verify: response =>
    response.status === 404 && (accept === 'text/html'
      ? response.type.startsWith('text/html') && /not found/i.test(response.body)
      : response.type.split(';')[0].trim() === 'text/markdown' && response.body.trim().length >= 20
        && /\[[^\]]+\]\([^)]*(?:llms\.txt|sitemap|docs)[^)]*\)/.test(response.body)) });
}
checks.push({ path: '/.well-known/mcp', accept: 'application/json', verify: response => {
  // Discovery alone cannot establish a live MCP protocol handshake.
  if (response.status !== 200) return false;
  try { return typeof JSON.parse(response.body) === 'object'; } catch { return false; }
}, note: 'Even if discovery passes, initialize/tools/list/tools/call must be tested against a real Streamable HTTP server.' });

const results = [];
// Bounded batches preserve the configured proxy and avoid flooding the host.
for (let offset = 0; offset < checks.length; offset += 4) {
  results.push(...await Promise.all(checks.slice(offset, offset + 4).map(async check => {
    const directory = await mkdtemp(join(tmpdir(), 'portfolio-check-'));
    try {
      const { stdout } = await run('curl', ['-sS', '-L', '--max-time', '20', '-H', `Accept: ${check.accept}`,
        '-D', join(directory, 'headers'), '-o', join(directory, 'body'), '-w', '%{http_code}',
        new URL(check.path, origin).href]);
      const headers = (await readFile(join(directory, 'headers'), 'utf8')).split(/\r?\n\r?\n/).filter(block => /^HTTP\//.test(block)).at(-1) || '';
      const header = name => headers.split(/\r?\n/).find(line => line.toLowerCase().startsWith(`${name}:`))?.split(':').slice(1).join(':').trim() || '';
      const response = { status: Number(stdout), type: header('content-type'), vary: header('vary'), body: await readFile(join(directory, 'body'), 'utf8') };
      return { path: check.path, accept: check.accept, status: response.status, contentType: response.type,
        vary: response.vary, result: check.verify(response) ? 'PASS' : 'FAIL', ...(check.note ? { note: check.note } : {}) };
    } catch (error) {
      return { path: check.path, accept: check.accept, result: 'UNVERIFIED', error: error.stderr?.trim() || error.message };
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  })));
}
console.log(JSON.stringify({ origin: origin.origin, checkedAt: new Date().toISOString(), results }, null, 2));
if (results.some(result => result.result !== 'PASS')) process.exitCode = 1;
