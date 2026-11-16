<script setup lang="ts">
import { useGitHubRepos } from '../../data/github';
import ProjectGallery from './ProjectGallery.vue';

const { flagshipRepo, featuredSecondaryRepos, config } = useGitHubRepos();
</script>

<template>
  <section id="projects" class="section" aria-labelledby="projects-title">
    <h2 id="projects-title" class="section-title">Projects</h2>

    <article class="project" aria-labelledby="kivo-title">
      <div class="project-head">
        <span class="project-number" aria-hidden="true">01</span>
        <h3 id="kivo-title" class="project-name">{{ flagshipRepo.title }}</h3>
        <span class="project-flag">{{ flagshipRepo.status }}</span>
      </div>
      <p class="project-summary">{{ flagshipRepo.summary }}</p>
      <div class="project-foot">
        <span class="project-status">{{ flagshipRepo.statusNote }}</span>
        <a
          class="project-link"
          :href="flagshipRepo.repositoryUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source <span aria-hidden="true">↗</span>
        </a>
      </div>
      <ProjectGallery />
      <details class="project-technical">
        <summary>Technical details<span class="sr-only"> for {{ flagshipRepo.title }}</span></summary>
        <p v-if="flagshipRepo.context" class="project-context">{{ flagshipRepo.context }}</p>
        <p class="project-stack">{{ flagshipRepo.technologies.join(' · ') }}</p>
      </details>
    </article>

    <div class="project-list">
      <h3 class="project-list-title">Featured projects</h3>
      <article
        v-for="(project, i) in featuredSecondaryRepos"
        :key="project.repositoryUrl"
        class="project-row"
        :aria-labelledby="`project-${i}`"
      >
        <div class="project-row-head">
          <span class="project-number" aria-hidden="true">0{{ i + 2 }}</span>
          <h4 :id="`project-${i}`" class="project-title">
            <a :href="project.repositoryUrl" target="_blank" rel="noopener noreferrer">
              {{ project.title }}<span class="ext" aria-hidden="true">↗</span>
            </a>
          </h4>
        </div>
        <p class="project-row-summary">{{ project.summary }}</p>
        <div class="project-row-foot">
          <span class="project-status">
            {{ project.status }}<template v-if="project.statusNote"> · {{ project.statusNote }}</template>
          </span>
          <a class="project-link" :href="project.repositoryUrl" target="_blank" rel="noopener noreferrer">
            Source<span class="sr-only"> for {{ project.title }}</span> <span aria-hidden="true">↗</span>
          </a>
        </div>
        <details class="project-technical">
          <summary>Technical details<span class="sr-only"> for {{ project.title }}</span></summary>
          <p v-if="project.context" class="project-row-context">{{ project.context }}</p>
          <p class="project-stack">{{ project.technologies.join(' · ') }}</p>
        </details>
      </article>
    </div>

    <p id="github-repositories" class="project-repositories-link">
      <a :href="config.repositoriesUrl" target="_blank" rel="noopener noreferrer">
        All repositories on GitHub <span aria-hidden="true">↗</span>
      </a>
    </p>
  </section>
</template>
