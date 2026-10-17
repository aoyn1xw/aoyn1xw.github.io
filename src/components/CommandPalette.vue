<script setup lang="ts">
// Command palette, opened with ⌘K / Ctrl+K or the header control. Mirrors an
// OpenTUI select: filter the list, move with arrows, commit with Enter.
import { nextTick, ref, watch } from 'vue';
import type { useShell } from '../shell/useShell';

const props = defineProps<{ shell: ReturnType<typeof useShell> }>();

const input = ref<HTMLInputElement>();

watch(
  () => props.shell.paletteOpen.value,
  async open => {
    if (!open) return;
    props.shell.paletteIndex.value = 0;
    await nextTick();
    input.value?.focus();
  }
);

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      props.shell.moveSelection(1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      props.shell.moveSelection(-1);
      break;
    case 'Enter':
      event.preventDefault();
      props.shell.submit();
      break;
  }
}
</script>

<template>
  <div v-if="shell.paletteOpen.value" class="palette" @click.self="shell.closePalette()">
    <div class="palette__panel" role="dialog" aria-modal="true" aria-label="Command palette">
      <div class="palette__search">
        <label class="sr-only" for="palette-filter">Search commands</label>
        <input
          id="palette-filter"
          ref="input"
          v-model="shell.paletteQuery.value"
          class="palette__input"
          type="text"
          autocomplete="off"
          spellcheck="false"
          placeholder="Go to…"
          @keydown="onKeydown"
        />
      </div>
      <ul class="palette__list">
        <li v-for="(command, index) in shell.results.value" :key="command.name">
          <button
            type="button"
            class="palette__row"
            :class="{ 'is-active': index === shell.paletteIndex.value }"
            :aria-selected="index === shell.paletteIndex.value"
            @mouseenter="shell.paletteIndex.value = index"
            @click="shell.invoke(command)"
          >
            <span class="palette__name">{{ command.name }}</span>
            <span class="palette__summary">{{ command.summary }}</span>
          </button>
        </li>
        <li v-if="!shell.results.value.length" class="palette__empty">No match</li>
      </ul>
      <p class="palette__footer">
        <kbd>↑</kbd><kbd>↓</kbd> move · <kbd>↵</kbd> go · <kbd>esc</kbd> close
      </p>
    </div>
  </div>
</template>