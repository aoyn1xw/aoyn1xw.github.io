import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_USERNAME = process.env.GITHUB_USERNAME || 'aoyn1xw';
const DEFAULT_SNAPSHOT_PATH = resolve('src/data/github-snapshot.json');
export const MAX_REPOS_PER_PAGE = 100;
export const DEFAULT_MAX_PAGES = 5;

/**
 * Sanitize raw GitHub API repository payload down to the fields needed by the
 * portfolio. Never writes tokens, headers, or private metadata.
 */
export function sanitizeRepo(raw, username = DEFAULT_USERNAME) {
  return {
    name: String(raw.name ?? ''),
    full_name: String(raw.full_name ?? `${username}/${raw.name ?? ''}`),
    html_url: String(raw.html_url ?? `https://github.com/${username}/${raw.name ?? ''}`),
    description: typeof raw.description === 'string' && raw.description.trim() ? raw.description.trim() : null,
    homepage: typeof raw.homepage === 'string' && raw.homepage.trim() ? raw.homepage.trim() : null,
    language: typeof raw.language === 'string' && raw.language.trim() ? raw.language.trim() : null,
    stargazers_count: typeof raw.stargazers_count === 'number' ? raw.stargazers_count : 0,
    forks_count: typeof raw.forks_count === 'number' ? raw.forks_count : 0,
    topics: Array.isArray(raw.topics) ? raw.topics.map(String) : [],
    fork: Boolean(raw.fork),
    archived: Boolean(raw.archived),
    pushed_at: typeof raw.pushed_at === 'string' ? raw.pushed_at : null,
    updated_at: typeof raw.updated_at === 'string' ? raw.updated_at : null,
    created_at: typeof raw.created_at === 'string' ? raw.created_at : null
  };
}

/**
 * Fetch public repositories for `username` with pagination (up to `maxPages` *
 * `perPage` repositories) and write `src/data/github-snapshot.json`.
 * Falls back safely to the existing snapshot file when offline or rate-limited.
 */
export async function syncGitHubSnapshot(options = {}) {
  const username = options.username ?? DEFAULT_USERNAME;
  const snapshotPath = options.snapshotPath ?? DEFAULT_SNAPSHOT_PATH;
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const perPage = Math.min(Math.max(1, options.perPage ?? MAX_REPOS_PER_PAGE), MAX_REPOS_PER_PAGE);
  const maxPages = Math.max(1, options.maxPages ?? DEFAULT_MAX_PAGES);
  const skipSync = options.skipSync ?? process.env.SKIP_GITHUB_SYNC === '1';

  if (skipSync) {
    const existing = JSON.parse(await readFile(snapshotPath, 'utf8'));
    return { updated: false, fallback: true, count: existing.repositories?.length ?? 0 };
  }

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'aoyn1xw-portfolio-build',
    'X-GitHub-Api-Version': '2022-11-28'
  };

  // Optional build-time token (e.g. in CI) to avoid unauthenticated rate limits.
  // Never embedded in client bundles.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const collected = [];
    for (let page = 1; page <= maxPages; page++) {
      const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&sort=pushed&page=${page}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      let response;
      try {
        response = await fetchImpl(url, { headers, signal: controller.signal });
      } finally {
        clearTimeout(timeout);
      }

      if (!response.ok) {
        throw new Error(`GitHub API responded with HTTP ${response.status}`);
      }

      const payload = await response.json();
      if (!Array.isArray(payload)) {
        throw new Error('Unexpected GitHub API response format');
      }

      collected.push(...payload);
      if (payload.length < perPage) break;
    }

    const byName = new Map();
    for (const raw of collected) {
      const clean = sanitizeRepo(raw, username);
      if (clean.name.length > 0 && !byName.has(clean.name.toLowerCase())) {
        byName.set(clean.name.toLowerCase(), clean);
      }
    }

    const repos = Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name));

    const snapshot = {
      username,
      fetchedAt: new Date().toISOString(),
      repositories: repos
    };

    await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
    return { updated: true, fallback: false, count: repos.length };
  } catch (error) {
    // Ensure offline builds or temporary API rate limits never break the build
    try {
      const existing = JSON.parse(await readFile(snapshotPath, 'utf8'));
      console.warn(
        `[sync-github] Using cached snapshot (${existing.repositories?.length ?? 0} repos): ${error.message}`
      );
      return { updated: false, fallback: true, count: existing.repositories?.length ?? 0 };
    } catch {
      throw error;
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await syncGitHubSnapshot();
}
