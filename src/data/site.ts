// =============================================================================
// SITE CONTENT & PORTFOLIO CONFIGURATION
//
// Every fact on this page is verifiable in a public repository or in this
// site's own build. Descriptions are written in first person and stay short;
// the repository link is where the details live.
// =============================================================================

export type ProjectCategory =
  | 'Desktop & Mobile'
  | 'DevTools & Containers'
  | 'AI & Automation'
  | 'Web & Design';

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  /** Project name as it appears on the page. */
  title: string;
  /** One line: what the project does. */
  summary: string;
  /** A few sentences: why it exists and how it works. */
  context: string;
  /** Technologies that can be verified in the repository. */
  technologies: string[];
  /** Short status label, e.g. 'Active MVP'. */
  status: string;
  /** One clause explaining the status. */
  statusNote: string;
  repository: string;
  /** Optional category used for filtering and grouping. */
  category?: ProjectCategory;
  /** Optional primary language override or fallback. */
  language?: string;
  /** Optional custom preview image. */
  image?: ProjectImage;
}

export interface CuratedProjectConfig {
  /** GitHub repository name (case-insensitive match). */
  repoName: string;
  /** Alternative repository names on GitHub (e.g. after a repository rename). */
  aliases?: string[];
  /** Optional custom display title. */
  title?: string;
  /** Optional custom description overriding the raw GitHub description. */
  summary?: string;
  /** Longer explanation shown on featured cards. */
  context?: string;
  /** Category for filtering and presentation. */
  category?: ProjectCategory;
  /** Primary language fallback when GitHub returns null. */
  language?: string;
  /** Verified technologies used in the project. */
  technologies?: string[];
  /** Supplemental topics when the GitHub repository has none set. */
  topics?: string[];
  /** Short status label. */
  status?: string;
  /** Status note shown in project footer. */
  statusNote?: string;
  /** Marks the flagship project at the top of the section. */
  flagship?: boolean;
  /** Marks a manually curated featured project. */
  featured?: boolean;
  /** Ordering rank among featured projects (lower numbers appear first). */
  featuredOrder?: number;
  /** Optional custom preview image. */
  image?: ProjectImage;
  /** Optional canonical repository URL override. */
  repositoryUrl?: string;
  /** Allow this repository even if it is a fork. */
  allowFork?: boolean;
}

export interface GitHubPortfolioConfig {
  /** GitHub username to fetch public repositories from. */
  username: string;
  /** Public GitHub profile URL. */
  profileUrl: string;
  /** Direct link to the full public repositories tab. */
  repositoriesUrl: string;
  /**
   * Maximum repositories fetched per client-side API request (GitHub REST API
   * maximum per page is 100). Build-time sync (`scripts/sync-github.mjs`)
   * supports multi-page pagination when needed.
   */
  maxRepositories: number;
  /** Exclude forked repositories by default. */
  excludeForks: boolean;
  /** Exclude archived repositories by default. */
  excludeArchived: boolean;
  /**
   * Case-insensitive list of repository names that should never appear in the
   * portfolio showcase (e.g. profile README or meta configuration repos).
   */
  excludedRepos: string[];
  /**
   * Manually curated project overrides and featured entries.
   * Repositories not listed here are still automatically displayed from GitHub
   * unless excluded above.
   */
  curatedProjects: CuratedProjectConfig[];
}

export interface ContactRoute {
  /** Route name. */
  label: string;
  /** Secondary label, e.g. the handle. */
  detail: string;
  /** Where the route leads. */
  href: string;
  /** Whether the link leaves the site. */
  external: boolean;
  /** One line explaining when to use it. */
  note: string;
}

export const kivo: Project = {
  title: 'Kivo',
  summary:
    'Browse finished game clips from my PC and download the original files to my phone over the local network.',
  context:
    'The NVIDIA App writes .mp4 files into a recordings folder I choose. A small tray app watches that folder, waits until a clip is completely written, and serves it on the local network. The phone pairs over a QR code and pulls the original files — nothing is uploaded, re-encoded, or moved.',
  technologies: ['.NET 8', 'C#', 'WPF', 'ASP.NET Core', 'Flutter', 'Dart'],
  status: 'Active MVP',
  statusNote: 'Windows tray app and Flutter client',
  repository: 'https://github.com/aoyn1xw/Kivo',
  category: 'Desktop & Mobile',
  language: 'C#',
  image: {
    src: '/assets/projects/shadowplay-home-online.png',
    alt: 'Kivo mobile home screen connected to a gaming PC'
  }
};

/** Legacy alias retained for backward compatibility with older references. */
export const shadowPlay: Project = kivo;

export const secondaryProjects: Project[] = [
  {
    title: 'Swift Devcontainer',
    summary: 'Build and sign iOS apps on Linux — no Mac, no Xcode.',
    context:
      'I do not own a Mac, so I built the machine I needed: a container with Swift, xtool to cross-compile for iOS, zsign to sign, and Theos for tweaks. It runs from a Codespace, from VS Code, or as a Docker Compose stack with code-server inside.',
    technologies: ['Swift', 'xtool', 'zsign', 'Theos', 'Docker', 'Dev Containers'],
    status: 'Published',
    statusNote: 'Docker Hub image, one-click Codespace',
    repository: 'https://github.com/aoyn1xw/swift-devcontainer',
    category: 'DevTools & Containers',
    language: 'Shell'
  },
  {
    title: 'IPA Signer',
    summary:
      'Sign an IPA with your own certificate and provisioning profile, from a browser or the API.',
    context:
      'Signing usually means a Mac and Xcode. This is a small Node.js server instead: upload the IPA, a .p12 and a .mobileprovision, and it hands back an OTA install link. zsign runs in a worker thread so the server stays responsive, and the Docker image ships zsign and cyan already inside.',
    technologies: ['Node.js', 'Express', 'zsign', 'Docker'],
    status: 'Published',
    statusNote: 'Docker image on GitHub Container Registry',
    repository: 'https://github.com/aoyn1xw/ipa-signer',
    category: 'DevTools & Containers',
    language: 'JavaScript'
  },
  {
    title: 'Untis Watcher',
    summary: 'Watch my Untis timetable and get a Telegram message when a lesson changes.',
    context:
      'I did not want to open the timetable app to find out that a room had changed. It polls WebUntis, compares the week against the last snapshot it stored, and only messages me when something actually differs. Credentials are scrubbed out of the logs.',
    technologies: ['Python', 'WebUntis API', 'Telegram Bot API', 'GitHub Models'],
    status: 'Unmaintained',
    statusNote: 'I no longer have Untis access',
    repository: 'https://github.com/aoyn1xw/Untis-watcher',
    category: 'AI & Automation',
    language: 'Python'
  }
];

/**
 * Central configuration for GitHub repository integration, featured project
 * curation, custom copy overrides, and repository exclusions.
 */
export const githubConfig: GitHubPortfolioConfig = {
  username: 'aoyn1xw',
  profileUrl: 'https://github.com/aoyn1xw',
  repositoriesUrl: 'https://github.com/aoyn1xw?tab=repositories',
  maxRepositories: 100,
  excludeForks: true,
  excludeArchived: false,
  excludedRepos: ['.github', 'aoyn1xw'],
  curatedProjects: [
    {
      repoName: 'Kivo',
      aliases: ['ShadowPlay'],
      title: kivo.title,
      summary: kivo.summary,
      context: kivo.context,
      category: 'Desktop & Mobile',
      language: 'C#',
      technologies: kivo.technologies,
      topics: ['dotnet', 'flutter', 'local-first', 'windows'],
      status: kivo.status,
      statusNote: kivo.statusNote,
      flagship: true,
      featured: true,
      featuredOrder: 1,
      image: kivo.image,
      repositoryUrl: kivo.repository
    },
    {
      repoName: 'swift-devcontainer',
      title: secondaryProjects[0].title,
      summary: secondaryProjects[0].summary,
      context: secondaryProjects[0].context,
      category: 'DevTools & Containers',
      language: 'Shell',
      technologies: secondaryProjects[0].technologies,
      status: secondaryProjects[0].status,
      statusNote: secondaryProjects[0].statusNote,
      featured: true,
      featuredOrder: 2,
      repositoryUrl: secondaryProjects[0].repository
    },
    {
      repoName: 'ipa-signer',
      title: secondaryProjects[1].title,
      summary: secondaryProjects[1].summary,
      context: secondaryProjects[1].context,
      category: 'DevTools & Containers',
      language: 'JavaScript',
      technologies: secondaryProjects[1].technologies,
      status: secondaryProjects[1].status,
      statusNote: secondaryProjects[1].statusNote,
      featured: true,
      featuredOrder: 3,
      repositoryUrl: secondaryProjects[1].repository
    },
    {
      repoName: 'Untis-watcher',
      title: secondaryProjects[2].title,
      summary: secondaryProjects[2].summary,
      context: secondaryProjects[2].context,
      category: 'AI & Automation',
      language: 'Python',
      technologies: secondaryProjects[2].technologies,
      status: secondaryProjects[2].status,
      statusNote: secondaryProjects[2].statusNote,
      featured: true,
      featuredOrder: 4,
      repositoryUrl: secondaryProjects[2].repository
    },
    {
      repoName: 'untis-mcp',
      title: 'Untis MCP',
      summary:
        'Local, read-only Model Context Protocol server exposing WebUntis timetable and homework data to AI agents.',
      category: 'AI & Automation',
      language: 'TypeScript',
      technologies: ['TypeScript', 'MCP', 'Node.js', 'WebUntis'],
      topics: ['mcp', 'ai-agents', 'typescript', 'webuntis'],
      status: 'Experimental'
    },
    {
      repoName: 'dotfiles',
      title: 'Dotfiles',
      summary:
        'Personal Linux shell, terminal, and development environment configuration scripts.',
      category: 'DevTools & Containers',
      language: 'Shell',
      technologies: ['Shell', 'Linux', 'CLI'],
      topics: ['dotfiles', 'linux', 'shell'],
      status: 'Active'
    },
    {
      repoName: 'Vanilla-Refined',
      title: 'Vanilla Refined',
      summary:
        'Carefully curated Fabric modpack enhancing Minecraft performance and visuals while preserving the vanilla feel.',
      category: 'Desktop & Mobile',
      language: 'Config',
      technologies: ['Fabric', 'Minecraft', 'Modpack'],
      topics: ['minecraft', 'fabric', 'modpack'],
      status: 'Published'
    },
    {
      repoName: 'aoyn1xw.github.io',
      title: 'Portfolio & Commissions',
      summary:
        'Minimal, static-prerendered personal portfolio and Telegram-backed commission site built with Vue 3 and Vite.',
      category: 'Web & Design',
      language: 'TypeScript',
      technologies: ['Vue 3', 'TypeScript', 'Vite', 'Cloudflare Workers'],
      topics: ['portfolio', 'vue3', 'ssr', 'design-system'],
      status: 'Live'
    },
    {
      repoName: 'ssh-portfolio',
      title: 'SSH Portfolio',
      summary:
        'Terminal-native portfolio accessible directly over SSH, built in Go for browsing projects from the command line.',
      category: 'Web & Design',
      language: 'Go',
      technologies: ['Go', 'SSH', 'TUI'],
      status: 'Archived'
    }
  ]
};

/** Contact routes, most direct first. */
export const contactRoutes: ContactRoute[] = [
  {
    label: 'Telegram',
    detail: '@ayon1xw',
    href: 'https://t.me/ayon1xw',
    external: true,
    note: 'Direct messages — the fastest way to reach me.'
  },
  {
    label: 'GitHub',
    detail: '@aoyn1xw',
    href: 'https://github.com/aoyn1xw',
    external: true,
    note: 'Questions about the code. Use the repository and its issues for the project you mean.'
  },
  {
    label: 'Commissions',
    detail: 'small, scoped work',
    href: '/commissions.html',
    external: false,
    note: 'Read the terms first. Requests are reviewed by hand before anything is agreed.'
  },
  {
    label: 'Socials',
    detail: 'guns.lol',
    href: 'https://guns.lol/ayon1xw',
    external: true,
    note: 'My other public profiles.'
  },
  {
    label: 'Contact page',
    detail: 'all routes',
    href: '/contact/',
    external: false,
    note: 'Every route in one place, including how the request form handles data.'
  }
];
