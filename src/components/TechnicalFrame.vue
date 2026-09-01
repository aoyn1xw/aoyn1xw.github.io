<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

defineProps<{
  sceneNumber: string;
  sceneLabel: string;
}>();

const progress = ref(0);
let ticking = false;

function updateProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progress.value = available > 0 ? Math.min(1, window.scrollY / available) : 0;
  ticking = false;
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateProgress);
}

onMounted(() => {
  updateProgress();
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
  <div class="technical-frame" aria-hidden="true">
    <span class="technical-frame__corner technical-frame__corner--tl" />
    <span class="technical-frame__corner technical-frame__corner--tr" />
    <span class="technical-frame__corner technical-frame__corner--bl" />
    <span class="technical-frame__corner technical-frame__corner--br" />
    <div class="technical-frame__scene">
      <span>{{ sceneNumber }}</span>
      <span>{{ sceneLabel }}</span>
    </div>
    <div class="technical-frame__registration">AYN / DE / 2026</div>
    <div class="technical-frame__progress">
      <span :style="{ transform: `scaleX(${progress})` }" />
    </div>
  </div>
</template>
