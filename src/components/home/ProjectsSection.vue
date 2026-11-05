<script setup lang="ts">
import { useGitHubRepos, type RepoSortMode } from '../../data/github';
import ProjectGallery from './ProjectGallery.vue';

const {
  flagshipRepo,
  featuredSecondaryRepos,
  discoveredRepos,
  filteredGridRepos,
  categories,
  selectedCategory,
  sortMode,
  config
} = useGitHubRepos();

const sortOptions: Array<{ value: RepoSortMode; label: string }> = [
  { value: 'smart', label: 'Curated' },
  { value: 'recent', label: 'Recent' },
  { value: 'stars', label: 'Stars' }
];
</script>

<template>
  <section id="projects" class="section" aria-labelledby="projects-title">
    <h2 id="projects-title" class="section-title">Projects</h2>

    <article class="project" aria-labelledby="kivo-title">
      <div class="project-head">
        <span class="project-number" aria-hidden="true">01</span>
        <h3 id="kivo-title" class="project-name">{{ flagshipRepo.title }}</h3>
        <span class="project-flag">{{ flagshipRepo.status }}</span>
      </div>
      <p class="project-summary">{{ flagshipRepo.summary }}</p>
      <p v-if="flagshipRepo.context" class="project-context">{{ flagshipRepo.context }}</p>
      <div class="project-foot">
        <span class="project-stack">{{ flagshipRepo.technologies.join(' · ') }}</span>
        <a
          class="project-link"
          :href="flagshipRepo.repositoryUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source <span aria-hidden="true">↗</span>
        </a>
      </div>
      <ProjectGallery />
    </article>

    <div class="project-list">
      <h3 class="project-list-title">Featured projects</h3>
      <article
        v-for="(project, i) in featuredSecondaryRepos"
        :key="project.repositoryUrl"
        class="project-row"
        :aria-labelledby="`project-${i}`"
      >
        <div class="project-row-head">
          <span class="project-number" aria-hidden="true">0{{ i + 2 }}</span>
          <h4 :id="`project-${i}`" class="project-title">
            <a :href="project.repositoryUrl" target="_blank" rel="noopener noreferrer">
              {{ project.title }}<span class="ext" aria-hidden="true">↗</span>
            </a>
          </h4>
        </div>
        <p class="project-row-summary">{{ project.summary }}</p>
        <p v-if="project.context" class="project-row-context">{{ project.context }}</p>
        <div class="project-row-foot">
          <span class="project-stack">{{ project.technologies.join(' · ') }}</span>
          <span class="project-status">
            {{ project.status }}<template v-if="project.statusNote"> · {{ project.statusNote }}</template>
          </span>
        </div>
      </article>
    </div>

    <div id="github-repositories" class="repo-section">
      <div class="repo-section-head">
        <div class="repo-section-title-group">
          <h3 id="github-repos-title" class="project-list-title">More on GitHub</h3>
          <span class="repo-count">
            <template v-if="selectedCategory === 'All'">
              {{ discoveredRepos.length }} repositories
            </template>
            <template v-else>
              {{ filteredGridRepos.length }} of {{ discoveredRepos.length }} repositories
            </template>
          </span>
        </div>

        <div class="repo-sort" role="group" aria-label="Sort repositories">
          <span class="repo-sort-label">Sort:</span>
          <button
            v-for="option in sortOptions"
            :key="option.value"
            type="button"
            class="repo-sort-btn"
            :aria-pressed="sortMode === option.value"
            @click="sortMode = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <div class="repo-filters" role="group" aria-label="Filter repositories by category">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="repo-filter-pill"
          :aria-pressed="selectedCategory === category"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <div class="repo-grid" aria-live="polite">
        <article
          v-for="repo in filteredGridRepos"
          :key="repo.id"
          class="repo-card"
          :class="{ 'is-archived': repo.archived }"
          :aria-labelledby="`repo-card-${repo.id}`"
        >
          <div class="repo-card__head">
            <h4 :id="`repo-card-${repo.id}`" class="repo-card__title">
              <a :href="repo.repositoryUrl" target="_blank" rel="noopener noreferrer">
                {{ repo.title }}<span class="ext" aria-hidden="true">↗</span>
              </a>
            </h4>
            <div class="repo-card__badges">
              <span v-if="repo.stars > 0" class="repo-star" :aria-label="`${repo.stars} stars on GitHub`">
                <span aria-hidden="true">★</span> {{ repo.stars }}
              </span>
              <span v-if="repo.archived" class="repo-badge">Archived</span>
            </div>
          </div>

          <p class="repo-card__summary">{{ repo.summary }}</p>

          <ul v-if="repo.topics.length" class="repo-topics" aria-label="Repository topics">
            <li v-for="topic in repo.topics.slice(0, 4)" :key="topic" class="repo-topic">
              {{ topic }}
            </li>
          </ul>

          <div class="repo-card__foot">
            <span class="repo-lang">{{ repo.language }}</span>
            <span class="repo-meta-right">
              <a
                v-if="repo.homepageUrl"
                class="repo-demo-link"
                :href="repo.homepageUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live <span aria-hidden="true">↗</span>
              </a>
              <span class="repo-updated">{{ repo.updatedLabel }}</span>
            </span>
          </div>
        </article>
      </div>

      <div class="repo-section-foot">
        <a
          class="repo-all-link"
          :href="config.repositoriesUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          All repositories on GitHub (@{{ config.username }}) <span class="ext" aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  </section>
</template>
