<script setup lang="ts">
import SiteHeader from './components/layout/SiteHeader.vue';
import SiteFooter from './components/layout/SiteFooter.vue';
import HeroSection from './components/home/HeroSection.vue';
import ProjectsSection from './components/home/ProjectsSection.vue';
import AboutSection from './components/home/AboutSection.vue';
import ContactSection from './components/home/ContactSection.vue';
import CommandPalette from './shell/CommandPalette.vue';
import { useShell } from './shell/useShell';

const shell = useShell();
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to content</a>

  <div class="page">
    <SiteHeader
      :palette-ready="shell.shellReady.value"
      :shortcut-key="shell.shortcutKey.value"
      @open-palette="shell.openPalette"
    />

    <main id="main-content">
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <ContactSection />
    </main>

    <SiteFooter />
  </div>

  <CommandPalette :shell="shell" />
</template>
