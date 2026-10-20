<script setup lang="ts">
import { contactRoutes } from '../../data/site';
</script>

<template>
  <section id="contact" class="section" aria-labelledby="contact-title">
    <h2 id="contact-title" class="section-title">Contact</h2>
    <ul class="contact-list">
      <li v-for="route in contactRoutes" :key="route.href" class="contact-row">
        <a
          class="contact-link"
          :href="route.href"
          :target="route.external ? '_blank' : undefined"
          :rel="route.external ? 'noopener noreferrer' : undefined"
        >
          {{ route.label }}
          <span class="contact-detail">{{ route.detail }}</span>
          <span v-if="route.external" class="ext" aria-hidden="true">↗</span>
        </a>
        <p class="contact-note">{{ route.note }}</p>
      </li>
    </ul>
  </section>
</template>
