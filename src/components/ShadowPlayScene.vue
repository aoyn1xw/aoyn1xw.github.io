<script setup lang="ts">
import type { Project } from '../data/site';
import MetadataLabel from './MetadataLabel.vue';
import SceneShell from './SceneShell.vue';

defineProps<{ project: Project }>();
</script>

<template>
  <SceneShell id="shadowplay" :number="project.number" :label="project.name">
    <div class="project-stage">
      <p class="project-stage__ghost" aria-hidden="true">SHADOW<br>PLAY</p>

      <div class="project-stage__header">
        <MetadataLabel label="SELECTED PROJECT" value="LOCAL SYSTEM / 01" accent />
        <a class="text-link" :href="project.repository" target="_blank" rel="noopener noreferrer">
          VIEW REPOSITORY <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div class="shadowplay-visual" aria-label="Actual ShadowPlay Flutter mobile application screens">
        <div class="shadowplay-visual__origin">
          <span class="technical-kicker">WINDOWS HOST</span>
          <strong>GAME CLIPS</strong>
          <small>READ ONLY / PRIVATE LAN</small>
        </div>
        <div class="shadowplay-visual__route" aria-hidden="true"><span /></div>
        <figure class="device-shot device-shot--primary">
          <img src="/assets/projects/shadowplay-home-online.png" alt="ShadowPlay mobile home screen connected to a gaming PC" width="912" height="2048" loading="lazy" />
          <figcaption>01 / HOME / ONLINE</figcaption>
        </figure>
        <figure class="device-shot device-shot--secondary">
          <img src="/assets/projects/shadowplay-clips.png" alt="ShadowPlay mobile clips browser" width="912" height="2048" loading="lazy" />
          <figcaption>02 / CLIP INDEX</figcaption>
        </figure>
      </div>

      <div class="project-stage__copy">
        <div>
          <p class="scene-number">{{ project.number }} / PRODUCT SYSTEM</p>
          <h2>{{ project.name }}</h2>
        </div>
        <p>{{ project.description }}</p>
      </div>

      <div class="project-stage__meta">
        <MetadataLabel v-for="item in project.stack" :key="item" label="STACK" :value="item" />
        <MetadataLabel label="STATUS" :value="project.status" accent />
        <MetadataLabel label="YEAR" :value="project.year" />
      </div>
    </div>
  </SceneShell>
</template>
