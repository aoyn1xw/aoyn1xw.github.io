// =============================================================================
// SITE CONTENT
//
// Every fact on this page is verifiable in a public repository or in this
// site's own build. Descriptions are written in first person and stay short;
// the repository link is where the details live.
// =============================================================================

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

export const shadowPlay: Project = {
  title: 'ShadowPlay',
  summary:
    'Browse finished game clips from my PC and download the original files to my phone over the local network.',
  context:
    'The NVIDIA App writes .mp4 files into a recordings folder I choose. A small tray app watches that folder, waits until a clip is completely written, and serves it on the local network. The phone pairs over a QR code and pulls the original files — nothing is uploaded, re-encoded, or moved.',
  technologies: ['.NET 8', 'C#', 'WPF', 'ASP.NET Core', 'Flutter', 'Dart'],
  status: 'Active MVP',
  statusNote: 'Windows tray app and Flutter client',
  repository: 'https://github.com/aoyn1xw/ShadowPlay'
};

export const secondaryProjects: Project[] = [
  {
    title: 'Swift Devcontainer',
    summary: 'Build and sign iOS apps on Linux — no Mac, no Xcode.',
    context:
      'I do not own a Mac, so I built the machine I needed: a container with Swift, xtool to cross-compile for iOS, zsign to sign, and Theos for tweaks. It runs from a Codespace, from VS Code, or as a Docker Compose stack with code-server inside.',
    technologies: ['Swift', 'xtool', 'zsign', 'Theos', 'Docker', 'Dev Containers'],
    status: 'Published',
    statusNote: 'Docker Hub image, one-click Codespace',
    repository: 'https://github.com/aoyn1xw/swift-devcontainer'
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
    repository: 'https://github.com/aoyn1xw/ipa-signer'
  },
  {
    title: 'Untis Watcher',
    summary: 'Watch my Untis timetable and get a Telegram message when a lesson changes.',
    context:
      'I did not want to open the timetable app to find out that a room had changed. It polls WebUntis, compares the week against the last snapshot it stored, and only messages me when something actually differs. Credentials are scrubbed out of the logs.',
    technologies: ['Python', 'WebUntis API', 'Telegram Bot API', 'GitHub Models'],
    status: 'Unmaintained',
    statusNote: 'I no longer have Untis access',
    repository: 'https://github.com/aoyn1xw/Untis-watcher'
  }
];

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
