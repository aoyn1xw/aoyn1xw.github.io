<script setup lang="ts">
import { ref } from 'vue';
import { heroActions, homepageCopy } from '../../data/site';

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
</script>

<template>
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
    <p class="lede">{{ homepageCopy.lede }}</p>
    <p class="sublede">{{ homepageCopy.sublede }}</p>
    <p class="meta">{{ homepageCopy.meta }}</p>
    <ul class="tags">
      <li v-for="skill in homepageCopy.skills" :key="skill">{{ skill }}</li>
    </ul>
    <div class="hero-actions" aria-label="Explore my work">
      <a v-for="action in heroActions" :key="action.href" :href="action.href">
        {{ action.label }} <span aria-hidden="true">{{ action.href.startsWith('#') ? '↓' : '→' }}</span>
      </a>
    </div>
  </section>
</template>
