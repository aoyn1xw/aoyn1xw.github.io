<script setup lang="ts">
import { secondaryProjects as projects, shadowPlay } from '../../data/site';
import ProjectGallery from './ProjectGallery.vue';
</script>

<template>
  <section id="projects" class="section" aria-labelledby="projects-title">
    <h2 id="projects-title" class="section-title">Projects</h2>

    <article class="project" aria-labelledby="shadowplay-title">
      <div class="project-head">
        <span class="project-number" aria-hidden="true">01</span>
        <h3 id="shadowplay-title" class="project-name">ShadowPlay</h3>
        <span class="project-flag">{{ shadowPlay.status }}</span>
      </div>
      <p class="project-summary">{{ shadowPlay.summary }}</p>
      <p class="project-context">{{ shadowPlay.context }}</p>
      <div class="project-foot">
        <span class="project-stack">{{ shadowPlay.technologies.join(' · ') }}</span>
        <a class="project-link" :href="shadowPlay.repository" target="_blank" rel="noopener noreferrer">
          Source <span aria-hidden="true">↗</span>
        </a>
      </div>
      <ProjectGallery />
    </article>

    <div class="project-list">
      <h3 class="project-list-title">Other projects</h3>
      <article
        v-for="(project, i) in projects"
        :key="project.repository"
        class="project-row"
        :aria-labelledby="`project-${i}`"
      >
        <div class="project-row-head">
          <span class="project-number" aria-hidden="true">0{{ i + 2 }}</span>
          <h4 :id="`project-${i}`" class="project-title">
            <a :href="project.repository" target="_blank" rel="noopener noreferrer">
              {{ project.title }}<span class="ext" aria-hidden="true">↗</span>
            </a>
          </h4>
        </div>
        <p class="project-row-summary">{{ project.summary }}</p>
        <p class="project-row-context">{{ project.context }}</p>
        <div class="project-row-foot">
          <span class="project-stack">{{ project.technologies.join(' · ') }}</span>
          <span class="project-status">{{ project.status }} · {{ project.statusNote }}</span>
        </div>
      </article>
    </div>
  </section>
</template>
