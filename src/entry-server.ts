import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import App from './App.vue';
import { secondaryProjects, shadowPlay } from './data/site';

// Render the same component that the browser hydrates: no duplicate crawler copy.
export function render() {
  return renderToString(createSSRApp(App));
}

export function renderMarkdown() {
  return `# ayon1xw Developer Portfolio

> Erdi, a student developer in Germany building desktop tools, small automations, and local-first experiments. The portfolio name is ayon1xw; the GitHub username is aoyn1xw.

## Why I build

I make software when something annoys me. Local-first apps, small automations, and experiments I want to understand. It usually starts with something annoying—or a question I can’t leave alone.

## ShadowPlay

I built ShadowPlay to get PC clips onto my phone. Browse finished game clips and download the original files over my local network. Windows host, Flutter client.

- [ShadowPlay repository](${shadowPlay.repository})

## Other projects

${secondaryProjects.map(project => `### ${project.title}\n\n${project.summary}\n\n${project.technologies}\n\n- [${project.title} repository](${project.repository})`).join('\n\n')}

## About me

I’m Erdi, a student developer in Germany. I learn by building things I need, fixing little annoyances, and figuring out how they work.

## Contact and site information

- [GitHub](https://github.com/aoyn1xw): Questions about something I made.
- [Socials](https://guns.lol/ayon1xw)
- [About](https://aoyn1xw.github.io/about/index.md)
- [Contact](https://aoyn1xw.github.io/contact/index.md)
- [Privacy](https://aoyn1xw.github.io/privacy/index.md)
- [Commissions](https://aoyn1xw.github.io/commissions.html)
- [Commission terms](https://aoyn1xw.github.io/commission-terms.html)
- [Agent guide](https://aoyn1xw.github.io/llms.txt)
`;
}
