export interface Project {
  title: string;
  summary: string;
  technologies: string;
  repository: string;
}

export const shadowPlay = {
  repository: 'https://github.com/aoyn1xw/ShadowPlay'
} as const;

export const secondaryProjects: Project[] = [
  {
    title: 'Swift Devcontainer',
    summary: 'A ready-to-use Swift development setup in a container.',
    technologies: 'SWIFT / DOCKER',
    repository: 'https://github.com/aoyn1xw/swift-devcontainer'
  },
  {
    title: 'IPA Signer',
    summary: 'Signs iOS IPA files with custom certificates and provisioning profiles.',
    technologies: 'PYTHON / IOS',
    repository: 'https://github.com/aoyn1xw/ipa-signer'
  },
  {
    title: 'Untis Watcher',
    summary: 'Checks my Untis timetable for changes and sends notifications.',
    technologies: 'PYTHON / AUTOMATION',
    repository: 'https://github.com/aoyn1xw/Untis-watcher'
  }
];
