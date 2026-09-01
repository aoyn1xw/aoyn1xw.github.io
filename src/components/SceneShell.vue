<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

defineProps<{
  id: string;
  number: string;
  label: string;
}>();

const root = ref<HTMLElement | null>(null);
const visible = ref(false);
let observer: IntersectionObserver | undefined;

onMounted(() => {
  if (!root.value || !('IntersectionObserver' in window)) {
    visible.value = true;
    return;
  }

  observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) visible.value = true;
  }, { threshold: 0.15 });
  observer.observe(root.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <section
    :id="id"
    ref="root"
    class="scene"
    :class="{ 'scene--visible': visible }"
    :data-scene="id"
    :data-scene-number="number"
    :data-scene-label="label"
  >
    <slot />
  </section>
</template>
