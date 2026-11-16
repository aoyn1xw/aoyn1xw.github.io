<script setup lang="ts">
import { homepageCopy } from '../../data/site';
</script>

<template>
  <section id="about" class="section" aria-labelledby="about-title">
    <h2 id="about-title" class="section-title">About</h2>
    <div class="prose">
      <p>
        {{ homepageCopy.about }} I go by <strong>ayon1xw</strong> here
        and <strong>aoyn1xw</strong> on GitHub.
      </p>
    </div>
    <div class="link-list">
      <a href="/about/">More about me <span class="ext">↗</span></a>
      <a href="/privacy/">How this site handles data <span class="ext">↗</span></a>
    </div>
  </section>
</template>
