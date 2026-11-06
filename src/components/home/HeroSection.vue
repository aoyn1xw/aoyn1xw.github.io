<script setup lang="ts">
import { ref } from 'vue';

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
    <p class="lede">I build things because I can.</p>
    <p class="sublede">Sometimes they're useful. Sometimes they're experiments. Usually both.</p>
    <p class="meta">Student developer and graphic designer based in Germany.</p>
    <ul class="tags">
      <li>Web, desktop &amp; mobile</li>
      <li>UI/UX &amp; graphic design</li>
      <li>Linux, Docker &amp; self-hosting</li>
      <li>AI agents &amp; automation</li>
    </ul>
  </section>
</template>
