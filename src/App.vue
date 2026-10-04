<script setup lang="ts">
import { ref } from 'vue';
import { secondaryProjects as projects, shadowPlay } from './data/site';
const gallery = ref<HTMLElement>();
const screenIndex = ref(0);
const headlineStyle = ref<Record<string, string>>({});
function playWithType(event: PointerEvent) {
 if (event.pointerType !== 'mouse') return;
 const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
 const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
 const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
 headlineStyle.value = {
  '--type-weight': String(Math.round(550 + x * 250)),
  '--type-optical': String(Math.round(12 + y * 84)),
  '--type-color': ['var(--teal)', 'var(--rust)', 'var(--violet)'][Math.min(2, Math.floor(x * 3))]!,
  '--type-origin': `${Math.round(x * 100)}%`
 };
}
function resetType() { headlineStyle.value = {}; }
function showScreen(index: number) {
 const target = gallery.value?.children[index] as HTMLElement | undefined;
 if (!target || !gallery.value) return;
 gallery.value.scrollTo({left: target.offsetLeft - gallery.value.offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
}
function trackScreen() {
 if (gallery.value) screenIndex.value = gallery.value.scrollLeft > gallery.value.clientWidth / 3 ? 1 : 0;
}
</script>
<template>
 <a class="skip-link" href="#main-content">Skip to content</a>
 <div class="portfolio">
  <header class="site-header">
   <a class="site-mark" href="#identity" aria-label="ayon1xw home">AYON1XW<span class="cursor" aria-hidden="true">▍</span></a>
   <nav aria-label="Primary navigation"><a href="#projects">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
  </header>
  <main id="main-content">
   <section id="identity" class="introduction" aria-labelledby="intro-title">
    <div><p class="eyebrow desktop-copy">PERSONAL SOFTWARE / SMALL FRICTIONS</p><p class="eyebrow mobile-copy">STUDENT DEVELOPER · GERMANY</p>
     <h1 id="intro-title" class="playful-type" :class="{ 'is-playing': Object.keys(headlineStyle).length > 0 }" :style="headlineStyle" @pointermove="playWithType" @pointerleave="resetType" @pointercancel="resetType"><span class="desktop-copy">I make software when<br>something <em>annoys me.</em></span><span class="mobile-copy">I make things<br>that <em>bug me.</em></span><span class="headline-cursor" aria-hidden="true">|</span></h1>
     <p class="intro-detail">Local-first apps, small automations, and experiments I want to understand.</p>
    </div>
    <aside class="build-note"><p class="eyebrow">WHY I BUILD</p><p>It usually starts with something annoying—or a question I can’t leave alone.</p><span class="note-corner" aria-hidden="true">↳</span></aside>
   </section>
   <section id="projects" class="featured" aria-labelledby="feature-title">
    <div class="section-label"><p class="eyebrow">01 / FEATURED PROJECT</p><span class="label-line" aria-hidden="true" /></div>
    <div class="feature-card">
     <div class="feature-copy">
      <p class="eyebrow origin"><span aria-hidden="true" />ORIGIN · CLIPS STUCK ON PC</p>
      <h2 id="feature-title">Shadow<span>Play</span><sup aria-hidden="true">↗</sup></h2>
      <p class="feature-description">I built ShadowPlay to get PC clips onto my phone.<span class="desktop-copy"> Browse finished game clips and download the original files over my local network.</span></p>
      <div class="feature-bottom"><div class="stack"><span><b aria-hidden="true">⊞</b> WINDOWS<span class="desktop-copy"> HOST</span></span><span><b aria-hidden="true">◇</b> FLUTTER<span class="desktop-copy"> CLIENT</span></span></div>
       <a class="button" :href="shadowPlay.repository" target="_blank" rel="noopener noreferrer"><span class="desktop-copy">Open the repository</span><span class="mobile-copy">Open repository</span><span aria-hidden="true">↗</span></a>
      </div>
     </div>
     <div class="app-preview">
      <div class="preview-bar" aria-hidden="true"><span class="window-dots"><i /><i /><i /></span><span>shadowplay / app</span><span>↗</span></div>
      <div ref="gallery" class="screens" tabindex="0" aria-label="ShadowPlay app screenshots; scroll to see both screens" @scroll="trackScreen" @keydown.right.prevent="showScreen(1)" @keydown.left.prevent="showScreen(0)">
       <figure><img src="/assets/projects/shadowplay-home-online.png" alt="ShadowPlay mobile home screen connected to a gaming PC" width="912" height="2048" loading="lazy"><figcaption><span>01</span> HOME / ONLINE</figcaption></figure>
       <figure><img src="/assets/projects/shadowplay-clips.png" alt="ShadowPlay mobile clips browser" width="912" height="2048" loading="lazy"><figcaption><span>02</span> CLIP INDEX</figcaption></figure>
      </div>
      <div class="gallery-controls"><p class="eyebrow">SWIPE TO SEE THE CLIPS VIEW</p><div aria-label="Select app screenshot"><button :aria-pressed="screenIndex === 0" aria-label="Show home screen" @click="showScreen(0)">01</button><button :aria-pressed="screenIndex === 1" aria-label="Show clips screen" @click="showScreen(1)">02</button></div></div>
     </div>
    </div>
   </section>
   <section class="other-projects" aria-labelledby="other-title"><p class="eyebrow">02 / SMALLER PROJECTS</p><h2 id="other-title">Other projects<span aria-hidden="true"> /</span></h2>
    <div class="project-list"><a v-for="(project, i) in projects" :key="project.repository" class="project-row" :href="project.repository" target="_blank" rel="noopener noreferrer"><span class="project-number">0{{ i + 1 }}</span><div class="project-detail"><h3>{{ project.title }}</h3><p>{{ project.summary }}</p></div><span class="project-stack">{{ project.technologies }}</span><span class="project-arrow" aria-hidden="true">↗</span></a></div>
   </section>
   <section id="about" class="about" aria-labelledby="about-title"><p class="eyebrow">03 / ABOUT ME</p><div class="about-content"><h2 id="about-title">A bit<br class="desktop-copy"> about me<span>.</span></h2><p>I’m Erdi, a student developer in Germany. I learn by building things I need, fixing little annoyances, and figuring out how they work.</p><span class="about-symbol" aria-hidden="true">*</span></div></section>
   <section id="contact" class="contact" aria-labelledby="contact-title"><div><p class="eyebrow">04 / CONTACT</p><h2 id="contact-title">Questions about something I made?</h2></div><a class="button" href="https://github.com/aoyn1xw" target="_blank" rel="noopener noreferrer">GitHub · @aoyn1xw <span aria-hidden="true">↗</span></a></section>
  </main>
  <footer><a class="site-mark" href="#identity">AYON1XW<span class="cursor" aria-hidden="true">▍</span></a><nav aria-label="Additional links"><a href="https://guns.lol/ayon1xw" target="_blank" rel="noopener noreferrer">Socials ↗</a><a href="/commissions.html">Commissions ↗</a><a href="/commission-terms.html">Terms ↗</a></nav><span class="eyebrow">PERSONAL PROJECTS · 2026</span></footer>
 </div>
</template>
