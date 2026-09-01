export interface Project {
  number: string;
  name: string;
  shortName: string;
  description: string;
  repository: string;
  year: string;
  status: string;
  stack: string[];
}

export const shadowPlay: Project = {
  number: '03',
  name: 'SHADOWPLAY',
  shortName: 'SP',
  description: 'A local-first Windows tray app and Flutter client for pairing with a PC, finding finished game clips, and downloading the original files over your own LAN.',
  repository: 'https://github.com/aoyn1xw/ShadowPlay',
  year: '2026',
  status: 'ACTIVE / MVP',
  stack: ['WINDOWS', 'FLUTTER', '.NET 8', 'LAN']
};

export const secondaryProjects: Project[] = [
  {
    number: '04',
    name: 'SWIFT DEVCONTAINER',
    shortName: 'SD',
    description: 'A ready-to-use Swift development container with the toolchain and dependencies already in place.',
    repository: 'https://github.com/aoyn1xw/swift-devcontainer',
    year: '2026',
    status: 'PUBLIC',
    stack: ['SWIFT', 'DOCKER', 'DEV ENV']
  },
  {
    number: '05',
    name: 'IPA SIGNER',
    shortName: 'IS',
    description: 'A focused Python tool for signing iOS IPA files with custom certificates and provisioning profiles.',
    repository: 'https://github.com/aoyn1xw/ipa-signer',
    year: '2026',
    status: 'PUBLIC',
    stack: ['PYTHON', 'IOS', 'AUTOMATION']
  },
  {
    number: '06',
    name: 'UNTIS WATCHER',
    shortName: 'UW',
    description: 'A small monitoring tool that watches Untis schedule changes and turns them into useful notifications.',
    repository: 'https://github.com/aoyn1xw/Untis-watcher',
    year: '2026',
    status: 'PUBLIC',
    stack: ['PYTHON', 'AUTOMATION', 'NOTIFY']
  }
];

export const scenes = [
  { id: 'identity', number: '01', label: 'IDENTITY' },
  { id: 'profile', number: '02', label: 'PROFILE' },
  { id: 'shadowplay', number: '03', label: 'SHADOWPLAY' },
  { id: 'projects', number: '04–06', label: 'SELECTED WORK' },
  { id: 'contact', number: '07', label: 'CONTACT' }
] as const;
