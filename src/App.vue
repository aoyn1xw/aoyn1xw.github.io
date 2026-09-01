<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { COMMISSION_STATUS, COMMISSION_STATUS_META } from '../config.js';
import MetadataLabel from './components/MetadataLabel.vue';
import ParticleWordmark from './components/ParticleWordmark.vue';
import ProjectIndexScene from './components/ProjectIndexScene.vue';
import SceneShell from './components/SceneShell.vue';
import ShadowPlayScene from './components/ShadowPlayScene.vue';
import TechnicalFrame from './components/TechnicalFrame.vue';
import { scenes, secondaryProjects, shadowPlay } from './data/site';

const currentScene = ref<(typeof scenes)[number]>(scenes[0]);
const commissionLabel = computed(() => COMMISSION_STATUS_META[COMMISSION_STATUS]?.label ?? 'Availability by request');
let sceneObserver: IntersectionObserver | undefined;

onMounted(() => {
  const elements = [...document.querySelectorAll<HTMLElement>('[data-scene]')];
  sceneObserver = new IntersectionObserver(entries => {
    const candidate = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!candidate) return;
    const found = scenes.find(scene => scene.id === candidate.target.id);
    if (found) currentScene.value = found;
  }, { rootMargin: '-38% 0px -38% 0px', threshold: [0, 0.25, 0.5, 0.75] });
  elements.forEach(element => sceneObserver?.observe(element));
});

onBeforeUnmount(() => sceneObserver?.disconnect());
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <TechnicalFrame :scene-number="currentScene.number" :scene-label="currentScene.label" />

  <header class="site-header">
    <a class="site-mark" href="#identity" aria-label="ayon1xw home">
      <span>AYN</span><span>/01</span>
    </a>
    <nav aria-label="Primary navigation">
      <a href="#projects">PROJECTS</a>
      <a href="#profile">ABOUT</a>
      <a href="#contact">CONTACT</a>
      <a href="https://github.com/aoyn1xw" target="_blank" rel="noopener noreferrer">GITHUB ↗</a>
    </nav>
  </header>

  <main id="main-content">
    <SceneShell id="identity" number="01" label="IDENTITY">
      <div class="hero-composition">
        <h1 class="visually-hidden">ayon1xw — student developer</h1>

        <div class="hero-composition__location">
          <MetadataLabel label="ORIGIN" value="GERMANY / UTC+1" vertical />
        </div>

        <div class="hero-composition__status">
          <MetadataLabel label="STATUS" value="BUILDING" accent />
          <span class="status-pulse" aria-hidden="true" />
        </div>

        <div class="hero-composition__identity">
          <ParticleWordmark />
          <p class="interaction-note"><span>INTERACTION /</span> MOVE THROUGH THE FIELD</p>
        </div>

        <p class="hero-composition__statement">
          Student developer building desktop tools,<br>
          automation projects, and AI experiments.
        </p>

        <div class="hero-composition__stack">
          <span>.NET</span><span>FLUTTER</span><span>VUE</span><span>LOCAL-FIRST</span>
        </div>

        <a class="hero-composition__advance" href="#profile">
          <span>ENTER / 02</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </SceneShell>

    <SceneShell id="profile" number="02" label="PROFILE">
      <div class="profile-scene">
        <p class="profile-scene__ghost" aria-hidden="true">BUILD</p>
        <p class="scene-number">02 / PROFILE</p>
        <div class="profile-scene__headline">
          <span>I BUILD</span>
          <strong>THINGS I<br>NEED TO USE.</strong>
        </div>
        <div class="profile-scene__copy">
          <p>Desktop apps. Mobile clients. Automation. Small systems that stay out of the way.</p>
          <p>Most projects begin as “I need this” and become something other people can use too.</p>
        </div>
        <div class="profile-scene__axis" aria-hidden="true">
          <span>DESKTOP</span><i /><span>MOBILE</span><i /><span>WEB</span>
        </div>
        <MetadataLabel class="profile-scene__meta" label="OPERATING MODE" value="CURIOUS / PRACTICAL / SHIPPING" accent />
      </div>
    </SceneShell>

    <ShadowPlayScene :project="shadowPlay" />
    <ProjectIndexScene :projects="secondaryProjects" />

    <SceneShell id="contact" number="07" label="CONTACT">
      <div class="contact-scene">
        <div class="contact-scene__topline">
          <MetadataLabel label="CHANNEL" value="DIRECT / OPEN" accent />
          <MetadataLabel label="COMMISSIONS" :value="commissionLabel.toUpperCase()" />
        </div>

        <div class="contact-scene__title">
          <p>HAVE A SMALL,<br>SHARP PROBLEM?</p>
          <h2>LET’S<br><span>TALK.</span></h2>
        </div>

        <nav class="contact-scene__links" aria-label="Contact and social links">
          <a href="https://github.com/aoyn1xw" target="_blank" rel="noopener noreferrer"><span>01</span> GITHUB <b>↗</b></a>
          <a href="https://guns.lol/ayon1xw" target="_blank" rel="noopener noreferrer"><span>02</span> SOCIALS <b>↗</b></a>
          <a href="/commissions.html"><span>03</span> COMMISSIONS <b>→</b></a>
          <a href="/commission-terms.html"><span>04</span> TERMS <b>→</b></a>
        </nav>

        <footer class="contact-scene__footer">
          <span>AYON1XW</span>
          <span>GERMANY / UTC+1</span>
          <span>2026 / BUILT BY AYON1XW</span>
        </footer>
      </div>
    </SceneShell>
  </main>
</template>
