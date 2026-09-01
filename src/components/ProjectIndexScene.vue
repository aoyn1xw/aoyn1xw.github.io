<script setup lang="ts">
import type { Project } from '../data/site';
import MetadataLabel from './MetadataLabel.vue';
import SceneShell from './SceneShell.vue';

defineProps<{ projects: Project[] }>();
</script>

<template>
  <SceneShell id="projects" number="04–06" label="SELECTED WORK">
    <div class="project-index">
      <header class="project-index__header">
        <p class="scene-number">04–06 / OTHER SYSTEMS</p>
        <h2>SELECTED<br><span>WORK</span></h2>
        <p>Smaller tools with narrow jobs. Built because they needed to exist.</p>
      </header>

      <ol class="project-index__list">
        <li v-for="project in projects" :key="project.name" class="project-row">
          <a :href="project.repository" target="_blank" rel="noopener noreferrer">
            <span class="project-row__number">{{ project.number }}</span>
            <span class="project-row__name">{{ project.name }}</span>
            <span class="project-row__details">
              <span>{{ project.description }}</span>
              <span>{{ project.stack.join(' / ') }}</span>
            </span>
            <span class="project-row__arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      </ol>

      <div class="project-index__foot">
        <MetadataLabel label="ARCHIVE" value="GITHUB / AOYN1XW" accent />
        <MetadataLabel label="MODE" value="BUILD / TEST / REPEAT" />
      </div>
    </div>
  </SceneShell>
</template>
