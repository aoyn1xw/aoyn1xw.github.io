// =============================================================================
// GITHUB API INTEGRATION & CURATION PIPELINE
//
// Combines build-time snapshot data (`github-snapshot.json`), curated overrides
// (`site.ts`), and client-side cached GitHub REST API updates.
// =============================================================================

import { computed, onMounted, ref } from 'vue';
import snapshotData from './github-snapshot.json';
import {
  githubConfig,
  type CuratedProjectConfig,
  type GitHubPortfolioConfig,
  type ProjectCategory,
  type ProjectImage
} from './site';

export interface GitHubRawRepo {
  name: string;
  full_name?: string;
  html_url: string;
  description: string | null;
  homepage?: string | null;
  language: string | null;
  stargazers_count?: number;
  forks_count?: number;
  topics?: string[];
  fork?: boolean;
  archived?: boolean;
  pushed_at?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
}

export interface PortfolioRepo {
  /** Canonical identifier used as v-for key. */
  id: string;
  /** Raw repository name on GitHub. */
  repoName: string;
  /** Display title (curated or formatted repository name). */
  title: string;
  /** Primary one-line summary (never empty; falls back gracefully). */
  summary: string;
  /** Extended context for featured entries. */
  context?: string;
  /** Primary programming language (never empty; falls back gracefully). */
  language: string;
  /** Accent color dot for the primary language. */
  languageColor: string;
  /** Star count from GitHub. */
  stars: number;
  /** Fork count from GitHub. */
  forks: number;
  /** Deduplicated repository topics (lowercase). */
  topics: string[];
  /** Curated or inferred technology stack labels. */
  technologies: string[];
  /** Portfolio category for filtering. */
  category: ProjectCategory;
  /** Short status label (e.g. 'Published', 'Active', 'Archived'). */
  status: string;
  /** Optional status note. */
  statusNote?: string;
  /** Repository URL on GitHub. */
  repositoryUrl: string;
  /** Optional external live/docs URL if distinct from the portfolio itself. */
  homepageUrl: string | null;
  /** Whether the repository is archived on GitHub. */
  archived: boolean;
  /** Whether the repository is a fork. */
  fork: boolean;
  /** Marks the single flagship showcase entry. */
  flagship: boolean;
  /** Marks curated featured entries. */
  featured: boolean;
  /** Ordering rank among featured projects. */
  featuredOrder: number;
  /** ISO timestamp of last push. */
  pushedAt: string | null;
  /** Human-readable month/year label of last activity. */
  updatedLabel: string;
  /** Intelligent composite sort score. */
  score: number;
  /** Optional custom preview image. */
  image?: ProjectImage;
}

export type RepoSortMode = 'smart' | 'recent' | 'stars';

export const GITHUB_CACHE_KEY = 'ayon1xw:github-repos:v1';
export const GITHUB_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
export const GITHUB_CLIENT_PER_PAGE = 100;
export const GITHUB_CLIENT_MAX_PAGES = 3;

const SNAPSHOT_REPOS: GitHubRawRepo[] = Array.isArray(snapshotData.repositories)
  ? (snapshotData.repositories as GitHubRawRepo[])
  : [];

const VERIFIED_SNAPSHOT_NAMES = new Set<string>(
  SNAPSHOT_REPOS.map(repo => (typeof repo?.name === 'string' ? repo.name.toLowerCase() : '')).filter(Boolean)
);

const LANGUAGE_COLORS: Record<string, string> = {
  'C#': '#178600',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Shell: '#89e051',
  Go: '#00ADD8',
  Swift: '#F05138',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Config: '#8b949e',
  Source: '#8b949e'
};

export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? '#4d8eff';
}

/** Format a raw repo slug like "untis-mcp" into a readable title if not curated. */
export function formatRepoTitle(name: string): string {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

/** Format an ISO date string into a concise 'MMM YYYY' label in UTC. */
export function formatRepoDate(iso: string | null | undefined): string {
  if (!iso) return 'Active';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Active';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Normalize a repository URL for strict deduplication. */
function normalizeRepoUrl(url: string): string {
  return url.trim().toLowerCase().replace(/\/+$/, '');
}

/** Validate that a repository URL points to a real GitHub repository path. */
function isValidGitHubRepoUrl(url: string | undefined, username: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'github.com') return false;
    const segments = parsed.pathname.split('/').filter(Boolean);
    return segments.length === 2 && segments[0].toLowerCase() === username.toLowerCase();
  } catch {
    return false;
  }
}

/** Validate that an API response payload contains well-formed repository objects. */
export function isValidGitHubPayload(payload: unknown): payload is GitHubRawRepo[] {
  if (!Array.isArray(payload) || payload.length === 0) return false;
  return payload.every(
    item =>
      item !== null &&
      typeof item === 'object' &&
      typeof (item as GitHubRawRepo).name === 'string' &&
      (item as GitHubRawRepo).name.trim().length > 0 &&
      typeof (item as GitHubRawRepo).html_url === 'string' &&
      (item as GitHubRawRepo).html_url.startsWith('https://github.com/')
  );
}

/** Infer a sensible category when a repository has no explicit curated category. */
function inferCategory(raw: GitHubRawRepo, language: string, topics: string[]): ProjectCategory {
  const haystack = `${raw.name} ${raw.description ?? ''} ${topics.join(' ')}`.toLowerCase();
  if (/(mcp|bot|untis|ai|agent|llm|automation|watcher)/.test(haystack)) {
    return 'AI & Automation';
  }
  if (/(docker|devcontainer|container|dotfiles|cli|shell|signer|ios|xcode)/.test(haystack) || language === 'Shell') {
    return 'DevTools & Containers';
  }
  if (/(portfolio|web|site|html|css|vue|ssh)/.test(haystack) || language === 'HTML') {
    return 'Web & Design';
  }
  return 'Desktop & Mobile';
}

/** Look up curated config by repository name or alias (case-insensitive). */
function findCuratedConfig(
  repoName: string,
  curatedList: CuratedProjectConfig[]
): CuratedProjectConfig | undefined {
  const lower = repoName.toLowerCase();
  return curatedList.find(
    item =>
      item.repoName.toLowerCase() === lower ||
      item.aliases?.some(alias => alias.toLowerCase() === lower)
  );
}

/**
 * Compute an intelligent quality & relevance score combining curation, stars,
 * recent activity, metadata completeness, and archive status.
 */
function computeSmartScore(
  raw: GitHubRawRepo,
  curated: CuratedProjectConfig | undefined,
  referenceTimeMs: number
): number {
  let score = 0;

  if (curated?.flagship) score += 1000;
  else if (curated?.featured) score += 500 - (curated.featuredOrder ?? 10) * 20;
  else if (curated) score += 60;

  const stars = raw.stargazers_count ?? 0;
  score += stars * 15;

  const pushedMs = raw.pushed_at ? Date.parse(raw.pushed_at) : 0;
  if (pushedMs > 0 && referenceTimeMs > pushedMs) {
    const ageDays = (referenceTimeMs - pushedMs) / (1000 * 60 * 60 * 24);
    score += Math.max(0, Math.round(80 * Math.exp(-ageDays / 180)));
  }

  if (raw.description || curated?.summary) score += 12;
  if (raw.language || curated?.language) score += 8;
  if ((raw.topics && raw.topics.length > 0) || (curated?.topics && curated.topics.length > 0)) {
    score += 10;
  }

  if (raw.archived) score -= 45;

  return score;
}

/**
 * Transform, filter, deduplicate, and merge raw GitHub repositories with
 * curated portfolio metadata.
 *
 * - Filters forks and excluded repositories *before* applying any repository
 *   count cap so valid repositories are never silently dropped by raw-array slicing.
 * - Deduplicates by canonical name, aliases, and normalized repository URL.
 * - Validates curated fallback entries against the verified build-time snapshot
 *   so nonexistent repositories are never fabricated.
 */
export function buildPortfolioRepos(
  rawRepos: GitHubRawRepo[] = [],
  config: GitHubPortfolioConfig = githubConfig
): PortfolioRepo[] {
  const maxLimit = Math.max(1, config.maxRepositories || GITHUB_CLIENT_PER_PAGE);
  const excludedSet = new Set(config.excludedRepos.map(name => name.toLowerCase()));
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();

  // Deterministic reference timestamp based on the newest pushed_at in the dataset
  // so SSR and client hydration calculate identical scores.
  const maxPushedMs = rawRepos.reduce((max, r) => {
    const t = r?.pushed_at ? Date.parse(r.pushed_at) : 0;
    return t > max ? t : max;
  }, Date.UTC(2026, 10, 1));

  const results: PortfolioRepo[] = [];

  for (const raw of rawRepos) {
    if (!raw || typeof raw.name !== 'string' || !raw.name.trim()) continue;
    const rawName = raw.name.trim();
    const lowerName = rawName.toLowerCase();

    if (excludedSet.has(lowerName)) continue;

    const curated = findCuratedConfig(rawName, config.curatedProjects);
    if (curated && excludedSet.has(curated.repoName.toLowerCase())) continue;

    if (config.excludeForks && raw.fork && !curated?.allowFork) continue;
    if (config.excludeArchived && raw.archived && !curated?.featured) continue;

    const canonicalName = curated?.repoName ?? rawName;
    const canonicalLower = canonicalName.toLowerCase();
    const repositoryUrl = curated?.repositoryUrl ?? raw.html_url;
    const normalizedUrl = normalizeRepoUrl(repositoryUrl);

    if (seenIds.has(canonicalLower) || seenIds.has(lowerName) || seenUrls.has(normalizedUrl)) {
      continue;
    }

    seenIds.add(canonicalLower);
    seenIds.add(lowerName);
    for (const alias of curated?.aliases ?? []) {
      seenIds.add(alias.toLowerCase());
    }
    seenUrls.add(normalizedUrl);

    const language = curated?.language || raw.language || 'Source';
    const rawTopics = Array.isArray(raw.topics) ? raw.topics : [];
    const mergedTopics = Array.from(
      new Set([...rawTopics, ...(curated?.topics ?? [])].map(t => t.toLowerCase().trim()).filter(Boolean))
    );

    const category = curated?.category ?? inferCategory(raw, language, mergedTopics);
    const summary =
      curated?.summary?.trim() ||
      raw.description?.trim() ||
      `${language} repository in ${category.toLowerCase()} — see the repository README for setup and details.`;

    const technologies =
      curated?.technologies && curated.technologies.length > 0
        ? curated.technologies
        : [language, ...mergedTopics.slice(0, 3)].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

    const archived = Boolean(raw.archived);
    const status = curated?.status ?? (archived ? 'Archived' : 'Public');

    const homepageRaw = raw.homepage?.trim() || null;
    const homepageUrl =
      homepageRaw && homepageRaw !== 'https://aoyn1xw.github.io/' && homepageRaw !== 'https://aoyn1xw.github.io'
        ? homepageRaw
        : null;

    results.push({
      id: canonicalLower,
      repoName: canonicalName,
      title: curated?.title ?? formatRepoTitle(canonicalName),
      summary,
      context: curated?.context,
      language,
      languageColor: getLanguageColor(language),
      stars: typeof raw.stargazers_count === 'number' ? raw.stargazers_count : 0,
      forks: typeof raw.forks_count === 'number' ? raw.forks_count : 0,
      topics: mergedTopics,
      technologies,
      category,
      status,
      statusNote: curated?.statusNote,
      repositoryUrl,
      homepageUrl,
      archived,
      fork: Boolean(raw.fork),
      flagship: Boolean(curated?.flagship),
      featured: Boolean(curated?.featured),
      featuredOrder: curated?.featuredOrder ?? 99,
      pushedAt: raw.pushed_at ?? null,
      updatedLabel: formatRepoDate(raw.pushed_at ?? raw.updated_at),
      score: computeSmartScore(raw, curated, maxPushedMs),
      image: curated?.image
    });
  }

  // Fallback for curated projects when rawRepos does not include them (e.g.
  // during offline fallback or partial payloads). Only include curated entries
  // that are verified in the build-time snapshot or are explicitly featured
  // with a valid GitHub repository URL.
  for (const curated of config.curatedProjects) {
    const canonicalLower = curated.repoName.toLowerCase();
    if (excludedSet.has(canonicalLower) || seenIds.has(canonicalLower)) continue;

    const repositoryUrl =
      curated.repositoryUrl ?? `https://github.com/${config.username}/${curated.repoName}`;
    const normalizedUrl = normalizeRepoUrl(repositoryUrl);
    if (seenUrls.has(normalizedUrl)) continue;

    const existsInSnapshot =
      VERIFIED_SNAPSHOT_NAMES.has(canonicalLower) ||
      Boolean(curated.aliases?.some(alias => VERIFIED_SNAPSHOT_NAMES.has(alias.toLowerCase())));
    const isVerifiedFeatured =
      Boolean(curated.flagship || curated.featured) &&
      isValidGitHubRepoUrl(repositoryUrl, config.username);

    if (!existsInSnapshot && !isVerifiedFeatured) continue;

    seenIds.add(canonicalLower);
    for (const alias of curated.aliases ?? []) {
      seenIds.add(alias.toLowerCase());
    }
    seenUrls.add(normalizedUrl);

    const language = curated.language ?? 'Source';
    const topics = (curated.topics ?? []).map(t => t.toLowerCase());
    const category = curated.category ?? 'Desktop & Mobile';

    results.push({
      id: canonicalLower,
      repoName: curated.repoName,
      title: curated.title ?? formatRepoTitle(curated.repoName),
      summary:
        curated.summary ??
        `${language} project — see the GitHub repository for source code and documentation.`,
      context: curated.context,
      language,
      languageColor: getLanguageColor(language),
      stars: 0,
      forks: 0,
      topics,
      technologies: curated.technologies ?? [language],
      category,
      status: curated.status ?? 'Published',
      statusNote: curated.statusNote,
      repositoryUrl,
      homepageUrl: null,
      archived: curated.status === 'Archived',
      fork: false,
      flagship: Boolean(curated.flagship),
      featured: Boolean(curated.featured),
      featuredOrder: curated.featuredOrder ?? 99,
      pushedAt: null,
      updatedLabel: 'Active',
      score: curated.flagship ? 1000 : curated.featured ? 500 - (curated.featuredOrder ?? 10) * 20 : 50,
      image: curated.image
    });
  }

  return sortPortfolioRepos(results, 'smart').slice(0, maxLimit);
}

/** Sort portfolio repositories by the selected mode. */
export function sortPortfolioRepos(repos: PortfolioRepo[], mode: RepoSortMode = 'smart'): PortfolioRepo[] {
  return [...repos].sort((a, b) => {
    if (mode === 'recent') {
      const timeA = a.pushedAt ? Date.parse(a.pushedAt) : 0;
      const timeB = b.pushedAt ? Date.parse(b.pushedAt) : 0;
      if (timeB !== timeA) return timeB - timeA;
    } else if (mode === 'stars') {
      if (b.stars !== a.stars) return b.stars - a.stars;
      const timeA = a.pushedAt ? Date.parse(a.pushedAt) : 0;
      const timeB = b.pushedAt ? Date.parse(b.pushedAt) : 0;
      if (timeB !== timeA) return timeB - timeA;
    }
    if (b.score !== a.score) return b.score - a.score;
    return a.title.localeCompare(b.title);
  });
}

/**
 * Merge live or cached raw repositories with the build-time snapshot so a
 * partial API response never wipes out known snapshot repositories.
 */
function mergeWithSnapshot(incoming: GitHubRawRepo[]): GitHubRawRepo[] {
  const byName = new Map<string, GitHubRawRepo>();
  for (const item of incoming) {
    if (item && typeof item.name === 'string' && item.name.trim()) {
      byName.set(item.name.trim().toLowerCase(), item);
    }
  }
  for (const snap of SNAPSHOT_REPOS) {
    const key = snap.name.toLowerCase();
    if (!byName.has(key)) {
      byName.set(key, snap);
    }
  }
  return Array.from(byName.values());
}

/** Initial repositories built from the build-time snapshot and curated config. */
export const initialPortfolioRepos: PortfolioRepo[] = buildPortfolioRepos(SNAPSHOT_REPOS);

/**
 * Reactive composable for the homepage Projects section.
 * Starts with prerendered snapshot data (preventing hydration mismatch or CLS)
 * and performs a rate-limit-aware cached refresh on the client.
 */
export function useGitHubRepos() {
  const repos = ref<PortfolioRepo[]>(initialPortfolioRepos);
  const selectedCategory = ref<ProjectCategory | 'All'>('All');
  const sortMode = ref<RepoSortMode>('smart');
  const syncState = ref<'snapshot' | 'cache' | 'live' | 'fallback'>('snapshot');

  const flagshipRepo = computed(
    () => repos.value.find(repo => repo.flagship) ?? initialPortfolioRepos.find(repo => repo.flagship)!
  );

  const featuredSecondaryRepos = computed(() =>
    repos.value
      .filter(repo => repo.featured && !repo.flagship)
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
  );

  const categories = computed<Array<ProjectCategory | 'All'>>(() => [
    'All',
    'Desktop & Mobile',
    'DevTools & Containers',
    'AI & Automation',
    'Web & Design'
  ]);

  /**
   * Automatically discovered repositories shown under "More on GitHub" —
   * excludes the flagship Kivo entry and the featured projects above so no
   * project is duplicated on the page.
   */
  const discoveredRepos = computed(() =>
    repos.value.filter(repo => !repo.flagship && !repo.featured)
  );

  const filteredGridRepos = computed(() => {
    const pool =
      selectedCategory.value === 'All'
        ? discoveredRepos.value
        : discoveredRepos.value.filter(repo => repo.category === selectedCategory.value);
    return sortPortfolioRepos(pool, sortMode.value);
  });

  async function refreshFromGitHub(forceNetwork = false) {
    if (typeof window === 'undefined') return;

    if (!forceNetwork) {
      try {
        const cachedRaw = window.sessionStorage.getItem(GITHUB_CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw) as { timestamp: number; data: unknown };
          if (
            typeof cached.timestamp === 'number' &&
            Date.now() - cached.timestamp < GITHUB_CACHE_TTL_MS &&
            isValidGitHubPayload(cached.data)
          ) {
            repos.value = buildPortfolioRepos(mergeWithSnapshot(cached.data));
            syncState.value = 'cache';
            return;
          }
        }
      } catch {
        // Ignore sessionStorage read errors
      }
    }

    if (
      navigator.webdriver &&
      !forceNetwork &&
      !(window as unknown as { __ALLOW_GITHUB_FETCH__?: boolean }).__ALLOW_GITHUB_FETCH__
    ) {
      return;
    }

    try {
      const collected: GitHubRawRepo[] = [];
      for (let page = 1; page <= GITHUB_CLIENT_MAX_PAGES; page++) {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), 5000);
        let response: Response;
        try {
          response = await fetch(
            `https://api.github.com/users/${encodeURIComponent(githubConfig.username)}/repos?per_page=${GITHUB_CLIENT_PER_PAGE}&sort=pushed&page=${page}`,
            {
              headers: { Accept: 'application/vnd.github+json' },
              signal: controller.signal
            }
          );
        } finally {
          window.clearTimeout(timer);
        }

        if (!response.ok) {
          if (page === 1) {
            syncState.value = 'fallback';
            return;
          }
          break;
        }

        const pageData: unknown = await response.json();
        if (!isValidGitHubPayload(pageData)) {
          if (page === 1) {
            syncState.value = 'fallback';
            return;
          }
          break;
        }

        collected.push(...pageData);
        if (pageData.length < GITHUB_CLIENT_PER_PAGE) break;
      }

      if (collected.length > 0) {
        const merged = mergeWithSnapshot(collected);
        repos.value = buildPortfolioRepos(merged);
        syncState.value = 'live';
        try {
          window.sessionStorage.setItem(
            GITHUB_CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data: collected })
          );
        } catch {
          // Ignore storage quota or privacy errors
        }
      } else {
        syncState.value = 'fallback';
      }
    } catch {
      syncState.value = 'fallback';
    }
  }

  onMounted(() => {
    void refreshFromGitHub();
  });

  return {
    repos,
    flagshipRepo,
    featuredSecondaryRepos,
    discoveredRepos,
    filteredGridRepos,
    categories,
    selectedCategory,
    sortMode,
    syncState,
    refreshFromGitHub,
    config: githubConfig
  };
}
