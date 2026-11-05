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
export const GITHUB_CLIENT_MAX_REPOS = 100;

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
    // Up to +80 points for very recent activity, decaying smoothly over a year
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
 * Transform, filter, and merge raw GitHub repositories with curated portfolio
 * metadata. Enforces the configured repository limit (`config.maxRepositories`,
 * capped at `GITHUB_CLIENT_MAX_REPOS` = 100) and stays safe to run in Node
 * (SSR/build) and in the browser.
 */
export function buildPortfolioRepos(
  rawRepos: GitHubRawRepo[] = [],
  config: GitHubPortfolioConfig = githubConfig
): PortfolioRepo[] {
  const maxLimit = Math.min(
    Math.max(1, config.maxRepositories || GITHUB_CLIENT_MAX_REPOS),
    GITHUB_CLIENT_MAX_REPOS
  );
  const boundedInput = rawRepos.slice(0, maxLimit);
  const excludedSet = new Set(config.excludedRepos.map(name => name.toLowerCase()));
  const matchedCuratedNames = new Set<string>();

  // Use a deterministic reference timestamp based on the newest pushed_at in the dataset
  // so SSR and client hydration calculate identical scores.
  const maxPushedMs = boundedInput.reduce((max, r) => {
    const t = r.pushed_at ? Date.parse(r.pushed_at) : 0;
    return t > max ? t : max;
  }, Date.UTC(2026, 10, 1));

  const results: PortfolioRepo[] = [];

  for (const raw of boundedInput) {
    if (!raw || !raw.name) continue;
    const lowerName = raw.name.toLowerCase();

    if (excludedSet.has(lowerName)) continue;

    const curated = findCuratedConfig(raw.name, config.curatedProjects);
    if (curated && excludedSet.has(curated.repoName.toLowerCase())) continue;

    if (config.excludeForks && raw.fork && !curated?.allowFork) continue;
    if (config.excludeArchived && raw.archived && !curated?.featured) continue;

    const canonicalName = curated?.repoName ?? raw.name;
    const canonicalLower = canonicalName.toLowerCase();
    if (matchedCuratedNames.has(canonicalLower)) continue;
    matchedCuratedNames.add(canonicalLower);

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
      repositoryUrl: curated?.repositoryUrl ?? raw.html_url,
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

  // Ensure any curated project is still present even if the GitHub API / snapshot
  // is empty or unavailable.
  for (const curated of config.curatedProjects) {
    const canonicalLower = curated.repoName.toLowerCase();
    if (excludedSet.has(canonicalLower) || matchedCuratedNames.has(canonicalLower)) continue;

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
      repositoryUrl: curated.repositoryUrl ?? `https://github.com/${config.username}/${curated.repoName}`,
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

/** Initial repositories built from the build-time snapshot and curated config. */
export const initialPortfolioRepos: PortfolioRepo[] = buildPortfolioRepos(
  (snapshotData.repositories as GitHubRawRepo[]) ?? []
);

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

  /** Non-flagship repositories shown in the GitHub repository index grid. */
  const gridRepos = computed(() => repos.value.filter(repo => !repo.flagship));

  const filteredGridRepos = computed(() => {
    const pool =
      selectedCategory.value === 'All'
        ? gridRepos.value
        : gridRepos.value.filter(repo => repo.category === selectedCategory.value);
    return sortPortfolioRepos(pool, sortMode.value);
  });

  const totalStars = computed(() => repos.value.reduce((sum, repo) => sum + repo.stars, 0));

  async function refreshFromGitHub(forceNetwork = false) {
    if (typeof window === 'undefined') return;

    if (!forceNetwork) {
      try {
        const cachedRaw = window.sessionStorage.getItem(GITHUB_CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw) as { timestamp: number; data: GitHubRawRepo[] };
          if (
            typeof cached.timestamp === 'number' &&
            Date.now() - cached.timestamp < GITHUB_CACHE_TTL_MS &&
            Array.isArray(cached.data) &&
            cached.data.length > 0
          ) {
            repos.value = buildPortfolioRepos(cached.data);
            syncState.value = 'cache';
            return;
          }
        }
      } catch {
        // Ignore sessionStorage read errors
      }
    }

    // In automated WebDriver test runs without a pre-seeded sessionStorage cache or
    // explicit forceNetwork request, avoid unrequested external internet traffic unless
    // window.__ALLOW_GITHUB_FETCH__ is set for network interception tests.
    if (
      navigator.webdriver &&
      !forceNetwork &&
      !(window as unknown as { __ALLOW_GITHUB_FETCH__?: boolean }).__ALLOW_GITHUB_FETCH__
    ) {
      return;
    }

    try {
      const perPage = Math.min(githubConfig.maxRepositories || GITHUB_CLIENT_MAX_REPOS, GITHUB_CLIENT_MAX_REPOS);
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 5000);
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(githubConfig.username)}/repos?per_page=${perPage}&sort=pushed`,
        {
          headers: { Accept: 'application/vnd.github+json' },
          signal: controller.signal
        }
      );
      window.clearTimeout(timer);

      if (!response.ok) {
        syncState.value = 'fallback';
        return;
      }

      const data = (await response.json()) as GitHubRawRepo[];
      if (Array.isArray(data) && data.length > 0) {
        const bounded = data.slice(0, perPage);
        repos.value = buildPortfolioRepos(bounded);
        syncState.value = 'live';
        try {
          window.sessionStorage.setItem(
            GITHUB_CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data: bounded })
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
    gridRepos,
    filteredGridRepos,
    categories,
    selectedCategory,
    sortMode,
    syncState,
    totalStars,
    refreshFromGitHub,
    config: githubConfig
  };
}
