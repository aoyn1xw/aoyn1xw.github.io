import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import App from './App.vue';
import { contactRoutes, secondaryProjects, shadowPlay } from './data/site';

// Render the same component that the browser hydrates: no duplicate crawler copy.
export function render() {
  return renderToString(createSSRApp(App));
}

export function renderMarkdown() {
  const site = 'https://aoyn1xw.github.io';
  // Site-internal routes are absolute in the Markdown version so a reader
  // following a link from another site still lands on the right page.
  const absolute = (href: string) => (href.startsWith('/') ? `${site}${href}` : href);

  const featured = `I built ShadowPlay to get PC clips onto my phone. ${shadowPlay.summary}\n\n${shadowPlay.context}\n\n${shadowPlay.technologies.join(' · ')} — ${shadowPlay.status}: ${shadowPlay.statusNote}.\n\n- [ShadowPlay repository](${shadowPlay.repository})`;

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

> Erdi, a student developer in Germany building desktop tools, small automations, and local-first experiments. The portfolio name is ayon1xw; the GitHub username is aoyn1xw.

## Why I build

I make software when something annoys me. Local-first apps, small automations, and experiments I want to understand. It usually starts with something annoying—or a question I can’t leave alone.

## ShadowPlay

${featured}

## Other projects

${others}

## About me

I’m Erdi, a student developer in Germany. I learn by building things I need, fixing little annoyances, and figuring out how they work. I use the name ayon1xw here and aoyn1xw on GitHub.

## Contact and site information

${contact}

- [About](https://aoyn1xw.github.io/about/index.md)
- [Privacy](https://aoyn1xw.github.io/privacy/index.md)
- [Commissions](https://aoyn1xw.github.io/commissions.html)
- [Commission terms](https://aoyn1xw.github.io/commission-terms.html)
- [Agent guide](https://aoyn1xw.github.io/llms.txt)
`;
}
