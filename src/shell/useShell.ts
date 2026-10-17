// =============================================================================
// SHELL RUNTIME (useShell)
// =============================================================================
// The command palette only. There is no prompt input and no status bar — the
// palette is a secondary keyboard shortcut onto content the page navigation
// already exposes, so it stays out of the way until asked for.
//
// Every browser API is reached from onMounted or behind a guard so the
// composable stays safe to call during server rendering.
// =============================================================================

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { SHELL_COMMANDS, filterCommands, resolveCommand, type ShellCommand } from './commands';

export function useShell() {
  const paletteOpen = ref(false);
  const paletteQuery = ref('');
  const paletteIndex = ref(0);

  const results = computed(() => filterCommands(paletteQuery.value));

  /**
   * The palette shortcut is ⌘K on Apple hardware and Ctrl K elsewhere. Shown
   * as a literal ⌘ on Windows would be wrong, so the label follows the
   * platform. Resolved on mount; the trigger itself only renders post-mount.
   */
  const isApple = ref(false);
  const shortcutKey = computed(() => (isApple.value ? '⌘K' : 'Ctrl K'));

  /**
   * Present only after mount so the prerendered page ships without a dead
   * control for no-JS visitors. Adding it post-hydration cannot desynchronise
   * the client render from the server HTML.
   */
  const shellReady = ref(false);

  function closePalette() {
    paletteOpen.value = false;
    paletteQuery.value = '';
    paletteIndex.value = 0;
  }

  function openTarget(id: string) {
    const element = document.getElementById(id);
    if (!element) return false;
    element.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start'
    });
    // Move focus so keyboard and screen-reader users follow the jump.
    element.setAttribute('tabindex', '-1');
    element.focus({ preventScroll: true });
    return true;
  }

  function run(command: ShellCommand) {
    const { action } = command;
    if (action.kind === 'scroll') openTarget(action.target);
    else if (action.kind === 'navigate') window.location.href = action.href;
    else if (action.kind === 'external') window.open(action.href, '_blank', 'noopener,noreferrer');
  }

  /** Run whatever is currently typed into the palette filter. */
  function submit() {
    const typed = paletteQuery.value.trim();
    const exact = resolveCommand(typed);
    if (exact) {
      invoke(exact);
      return;
    }
    // No exact match: run the top-ranked suggestion instead.
    const best = results.value[0];
    if (best) invoke(best);
  }

  function invoke(command: ShellCommand) {
    closePalette();
    run(command);
  }

  function openPalette() {
    paletteOpen.value = true;
    paletteQuery.value = '';
    paletteIndex.value = 0;
  }

  function moveSelection(delta: number) {
    const total = results.value.length;
    if (!total) return;
    paletteIndex.value = (paletteIndex.value + delta + total) % total;
  }

  function onGlobalKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      paletteOpen.value ? closePalette() : openPalette();
      return;
    }
    if (event.key === 'Escape' && paletteOpen.value) {
      event.preventDefault();
      closePalette();
    }
  }

  /** Keep the highlighted row valid whenever the filter narrows the list. */
  watch(paletteQuery, () => {
    paletteIndex.value = 0;
  });

  onMounted(() => {
    shellReady.value = true;
    // `platform` is deprecated but still the only reliable signal here;
    // userAgent keeps the check working where platform is empty.
    const platform = `${navigator.platform ?? ''} ${navigator.userAgent ?? ''}`;
    isApple.value = /Mac|iPhone|iPad|iPod/.test(platform);
    window.addEventListener('keydown', onGlobalKeydown);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onGlobalKeydown);
  });

  return {
    paletteOpen,
    paletteQuery,
    paletteIndex,
    results,
    shellReady,
    isApple,
    shortcutKey,
    commands: SHELL_COMMANDS,
    submit,
    invoke,
    openPalette,
    closePalette,
    moveSelection
  };
}