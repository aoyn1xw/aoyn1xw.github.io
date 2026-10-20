<script setup lang="ts">
defineProps<{ paletteReady: boolean; shortcutKey: string }>();
const emit = defineEmits<{ openPalette: [] }>();
</script>

<template>
  <header class="site-header">
    <a class="site-mark" href="#identity" aria-label="ayon1xw home">AYON1XW</a>
    <div class="site-header-end">
      <nav aria-label="Primary navigation">
        <a href="#projects">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
      <button
        v-if="paletteReady"
        type="button"
        class="palette-trigger"
        @click="emit('openPalette')"
      >
        <kbd>{{ shortcutKey }}</kbd> Go to
      </button>
    </div>
  </header>
</template>
