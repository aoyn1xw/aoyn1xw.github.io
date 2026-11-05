import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import App from './App.vue';
import { initialPortfolioRepos } from './data/github';
import { contactRoutes, githubConfig, kivo, secondaryProjects } from './data/site';

// Render the same component that the browser hydrates: no duplicate crawler copy.
export function render() {
  return renderToString(createSSRApp(App));
}

export function renderMarkdown() {
  const site = 'https://aoyn1xw.github.io';
  // Site-internal routes are absolute in the Markdown version so a reader
  // following a link from another site still lands on the right page.
  const absolute = (href: string) => (href.startsWith('/') ? `${site}${href}` : href);

  const featured = `I built Kivo to get PC clips onto my phone. ${kivo.summary}\n\n${kivo.context}\n\n${kivo.technologies.join(' · ')} — ${kivo.status}: ${kivo.statusNote}.\n\n- [Kivo repository](${kivo.repository})`;

  const others = secondaryProjects
    .map(
      project =>
        `### ${project.title}\n\n${project.summary}\n\n${project.context}\n\n${project.technologies.join(' · ')} — ${project.status}: ${project.statusNote}.\n\n- [${project.title} repository](${project.repository})`
    )
    .join('\n\n');

  const githubIndex = initialPortfolioRepos
    .map(repo => {
      const stars = repo.stars > 0 ? ` · ★ ${repo.stars}` : '';
      return `- [${repo.title}](${repo.repositoryUrl}) (${repo.language} · ${repo.category}${stars}): ${repo.summary}`;
    })
    .join('\n');

  const contact = contactRoutes
    .map(route => `- [${route.label} · ${route.detail}](${absolute(route.href)}): ${route.note}`)
    .join('\n');

  return `# ayon1xw Developer Portfolio

> Erdi, a student developer and graphic designer in Germany building desktop and mobile tools, UI/UX designs, Linux and Docker containers, and AI automation experiments. The portfolio name is ayon1xw; the GitHub username is aoyn1xw.

## Why I build

I make software when something annoys me. Local-first apps, small automations, and experiments I want to understand. It usually starts with something annoying—or a question I can’t leave alone.

## Kivo

${featured}

## Featured projects

${others}

## GitHub repositories (@${githubConfig.username})

${githubIndex}

- [View all repositories on GitHub](${githubConfig.repositoriesUrl})

## About me

I’m Erdi, a student developer and graphic designer based in Germany. I learn by building things I need, fixing little annoyances, and figuring out how they work — across desktop and mobile apps, UI/UX and graphic design, Linux and Docker self-hosting, and AI automation experiments. I use the name ayon1xw here and aoyn1xw on GitHub.

## Contact and site information

${contact}

- [About](https://aoyn1xw.github.io/about/index.md)
- [Privacy](https://aoyn1xw.github.io/privacy/index.md)
- [Commissions](https://aoyn1xw.github.io/commissions.html)
- [Commission terms](https://aoyn1xw.github.io/commission-terms.html)
- [Agent guide](https://aoyn1xw.github.io/llms.txt)
`;
}
