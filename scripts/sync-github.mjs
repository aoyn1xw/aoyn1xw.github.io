import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const USERNAME = process.env.GITHUB_USERNAME || 'aoyn1xw';
const SNAPSHOT_PATH = resolve('src/data/github-snapshot.json');
const API_URL = `https://api.github.com/users/${encodeURIComponent(USERNAME)}/repos?per_page=100&sort=pushed`;

/**
 * Sanitize raw GitHub API repository payload down to the fields needed by the
 * portfolio. Never writes tokens, headers, or private metadata.
 */
function sanitizeRepo(raw) {
  return {
    name: String(raw.name ?? ''),
    full_name: String(raw.full_name ?? `${USERNAME}/${raw.name ?? ''}`),
    html_url: String(raw.html_url ?? `https://github.com/${USERNAME}/${raw.name ?? ''}`),
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

export async function syncGitHubSnapshot() {
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(API_URL, { headers, signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`GitHub API responded with HTTP ${response.status}`);
    }

    const payload = await response.json();
    if (!Array.isArray(payload)) {
      throw new Error('Unexpected GitHub API response format');
    }

    const repos = payload
      .map(sanitizeRepo)
      .filter(repo => repo.name.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name));

    const snapshot = {
      username: USERNAME,
      fetchedAt: new Date().toISOString(),
      repositories: repos
    };

    await writeFile(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
    return { updated: true, count: repos.length };
  } catch (error) {
    // Ensure offline builds or temporary API rate limits never break the build
    try {
      const existing = JSON.parse(await readFile(SNAPSHOT_PATH, 'utf8'));
      console.warn(`[sync-github] Using cached snapshot (${existing.repositories?.length ?? 0} repos): ${error.message}`);
      return { updated: false, count: existing.repositories?.length ?? 0 };
    } catch {
      throw error;
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await syncGitHubSnapshot();
}
