<script setup lang="ts">
import { ref } from 'vue';

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
</template>
