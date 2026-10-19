<script setup lang="ts">
import { ref } from 'vue';
import { contactRoutes, secondaryProjects as projects, shadowPlay } from './data/site';
import { useShell } from './shell/useShell';
import CommandPalette from './components/CommandPalette.vue';

const shell = useShell();

// Pointer position only drives the direction the wordmark's underline grows
// from, so it never fires for keyboard or touch users.
const markStyle = ref<Record<string, string>>({});
function trackMark(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return;
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
  markStyle.value = { '--mark-origin': `${Math.round(x * 100)}%` };
}
function resetMark() {
  markStyle.value = {};
}

const shots = ref<HTMLElement>();
const shotIndex = ref(0);

function showShot(index: number) {
  // Set the selection first: on viewports where the pair fits without
  // scrolling there is no scroll event to correct it from.
  shotIndex.value = index;
  const track = shots.value;
  const target = track?.children[index] as HTMLElement | undefined;
  if (!track || !target) return;
  const max = track.scrollWidth - track.clientWidth;
  if (max <= 0) return;
  track.scrollTo({
    left: Math.min(target.offsetLeft - track.offsetLeft, max),
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  });
}

// Nearest-figure detection rather than a fixed scroll threshold, so the
// selection survives any change to figure width.
function trackShot() {
  const track = shots.value;
  if (!track) return;
  const centre = track.scrollLeft + track.clientWidth / 2;
  let nearest = 0;
  let best = Infinity;
  Array.from(track.children).forEach((child, index) => {
    const element = child as HTMLElement;
    const distance = Math.abs(element.offsetLeft + element.offsetWidth / 2 - centre);
    if (distance < best) {
      best = distance;
      nearest = index;
    }
  });
  shotIndex.value = nearest;
}
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to content</a>

  <div class="page">
    <header class="site-header">
      <a class="site-mark" href="#identity" aria-label="ayon1xw home">AYON1XW</a>
      <div class="site-header-end">
        <nav aria-label="Primary navigation">
          <a href="#projects">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <button
          v-if="shell.shellReady.value"
          type="button"
          class="palette-trigger"
          @click="shell.openPalette()"
        >
          <kbd>{{ shell.shortcutKey.value }}</kbd> Go to
        </button>
      </div>
    </header>

    <main id="main-content">
      <section id="identity" class="hero" aria-labelledby="intro-title">
        <h1
          id="intro-title"
          class="wordmark"
          :class="{ 'is-playing': Object.keys(markStyle).length > 0 }"
          :style="markStyle"
          @pointermove="trackMark"
          @pointerleave="resetMark"
          @pointercancel="resetMark"
        ><span class="sr-only">ayon1xw developer portfolio: </span>AYON1<span class="accent">X</span>W</h1>
        <p class="lede">I make software when something annoys me.</p>
        <p class="meta">Student developer in Germany.</p>
        <ul class="tags">
          <li>Desktop tools</li>
          <li>Small automations</li>
          <li>Local-first experiments</li>
        </ul>
      </section>

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
          <div
            ref="shots"
            class="shots"
            tabindex="0"
            aria-label="ShadowPlay app screenshots; scroll to see both screens"
            @scroll="trackShot"
            @keydown.right.prevent="showShot(1)"
            @keydown.left.prevent="showShot(0)"
          >
            <figure>
              <img src="/assets/projects/shadowplay-home-online.png" alt="ShadowPlay mobile home screen connected to a gaming PC" width="912" height="2048" loading="lazy" />
              <figcaption><span>01</span> Home, online</figcaption>
            </figure>
            <figure>
              <img src="/assets/projects/shadowplay-clips.png" alt="ShadowPlay mobile clips browser" width="912" height="2048" loading="lazy" />
              <figcaption><span>02</span> Clip index</figcaption>
            </figure>
          </div>
          <div class="shot-toggle" aria-label="Select app screenshot">
            <button :aria-pressed="shotIndex === 0" aria-label="Show home screen" @click="showShot(0)">01</button>
            <button :aria-pressed="shotIndex === 1" aria-label="Show clips screen" @click="showShot(1)">02</button>
          </div>
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

      <section id="about" class="section" aria-labelledby="about-title">
        <h2 id="about-title" class="section-title">About</h2>
        <div class="prose">
          <p>
            I’m Erdi, a student developer in Germany. I learn by building things I need, fixing little
            annoyances, and figuring out how they work. I use the name <strong>ayon1xw</strong> here and
            <strong>aoyn1xw</strong> on GitHub.
          </p>
        </div>
        <div class="link-list">
          <a href="/about/">Longer version <span class="ext">↗</span></a>
          <a href="/privacy/">How this site handles data <span class="ext">↗</span></a>
        </div>
      </section>

      <section id="contact" class="section" aria-labelledby="contact-title">
        <h2 id="contact-title" class="section-title">Contact</h2>
        <ul class="contact-list">
          <li v-for="route in contactRoutes" :key="route.href" class="contact-row">
            <a
              class="contact-link"
              :href="route.href"
              :target="route.external ? '_blank' : undefined"
              :rel="route.external ? 'noopener noreferrer' : undefined"
            >
              {{ route.label }}
              <span class="contact-detail">{{ route.detail }}</span>
              <span v-if="route.external" class="ext" aria-hidden="true">↗</span>
            </a>
            <p class="contact-note">{{ route.note }}</p>
          </li>
        </ul>
      </section>
    </main>

    <footer class="site-footer">
      <span class="site-mark">AYON1XW</span>
      <nav aria-label="Additional links">
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
        <a href="/privacy/">Privacy</a>
        <a href="/commissions.html">Commissions</a>
        <a href="/commission-terms.html">Terms</a>
      </nav>
      <span class="colophon">Personal projects · 2026</span>
    </footer>
  </div>

  <CommandPalette :shell="shell" />
</template>
