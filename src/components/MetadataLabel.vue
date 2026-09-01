<script setup lang="ts">
withDefaults(defineProps<{
  label: string;
  value: string;
  vertical?: boolean;
  accent?: boolean;
}>(), {
  vertical: false,
  accent: false
});
</script>

<template>
  <div class="metadata-label" :class="{ 'metadata-label--vertical': vertical }">
    <span class="metadata-label__key">{{ label }}</span>
    <span class="metadata-label__value" :class="{ 'metadata-label__value--accent': accent }">{{ value }}</span>
  </div>
</template>
