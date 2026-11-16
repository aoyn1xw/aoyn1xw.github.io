import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import App from './App.vue';
import { contactRoutes, githubConfig, heroActions, homepageCopy, kivo, secondaryProjects } from './data/site';

// Render the same component that the browser hydrates: no duplicate crawler copy.
export function render() {
  return renderToString(createSSRApp(App));
}

export function renderMarkdown() {
  const site = 'https://aoyn1xw.github.io';
  // Site-internal routes are absolute in the Markdown version so a reader
  // following a link from another site still lands on the right page.
  const absolute = (href: string) => (href.startsWith('/') ? `${site}${href}` : href);

  const featured = `${kivo.summary}\n\n${kivo.context}\n\n${kivo.technologies.join(' · ')} — ${kivo.status}: ${kivo.statusNote}.\n\n- [Kivo repository](${kivo.repository})`;

  const others = secondaryProjects
    .map(
      project =>
        `### ${project.title}\n\n${project.summary}\n\n${project.context}\n\n${project.technologies.join(' · ')} — ${project.status}: ${project.statusNote}.\n\n- [${project.title} repository](${project.repository})`
    )
    .join('\n\n');

  const contact = contactRoutes
    .map(route => `- [${route.label} · ${route.detail}](${absolute(route.href)}): ${route.note}`)
    .join('\n');

  return `# ayon1xw Developer Portfolio

> Erdi, a student developer and graphic designer based in Germany. The portfolio name is ayon1xw; the GitHub username is aoyn1xw.

## Why I build

${homepageCopy.lede} ${homepageCopy.sublede}

${homepageCopy.meta}

${homepageCopy.skills.join(' · ')}

${heroActions.map(action => `- [${action.label}](${action.href.startsWith('#') ? site + '/' + action.href : absolute(action.href)})`).join('\n')}

## Kivo

${featured}

## Featured projects

${others}

- [All repositories on GitHub](${githubConfig.repositoriesUrl})

## About me

${homepageCopy.about} I go by ayon1xw here and aoyn1xw on GitHub.

## Contact and site information

${contact}

- [About](https://aoyn1xw.github.io/about/index.md)
- [Privacy](https://aoyn1xw.github.io/privacy/index.md)
- [Agent guide](https://aoyn1xw.github.io/llms.txt)
`;
}
