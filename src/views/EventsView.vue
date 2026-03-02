<script setup>
import IncomingEvents from "../components/IncomingEvents.vue";
import { useSeasonStore } from "@/stores/seasons";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { computed } from "vue";
import { RouterLink } from "vue-router";

const seasonStore = useSeasonStore();
const { fetchAllSeasons } = seasonStore;
const { seasons } = storeToRefs(seasonStore);

const oldSeasons = computed(() => {
  return seasons.value.slice(0, -1);
});

onBeforeMount(() => {
  fetchAllSeasons();
});

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
</script>
<template>
  <div class="page-wrapper">
    <IncomingEvents />
    <hr class="gradient-divider" />
    <div class="section" v-if="oldSeasons.length > 0">
      <p class="section-label">Anciens évènements</p>
      <div class="events-list">
        <RouterLink
          v-for="event in oldSeasons"
          :key="event.id"
          :to="{ name: 'season', params: { id: event.id } }"
          class="event-card glass-card"
        >
          <div class="event-accent"></div>
          <div class="event-content">
            <p class="event-name">{{ event.name }}</p>
            <div class="event-meta">
              <div class="dates">
                <span class="date">{{ formatDate(event.start_date) }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" class="arrow-icon">
                  <path d="M10.7832 8.66675H2.6665V7.33342H10.7832L7.04984 3.60008L7.99984 2.66675L13.3332 8.00008L7.99984 13.3334L7.04984 12.4001L10.7832 8.66675Z" fill="currentColor"/>
                </svg>
                <span class="date">{{ formatDate(event.end_date) }}</span>
              </div>
            </div>
            <span class="status-badge done">terminé</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<style scoped>
.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 800px;
}

.event-card {
  display: flex;
  align-items: stretch;
  overflow: hidden;
  text-decoration: none;
}

.event-accent {
  width: 4px;
  background: linear-gradient(180deg, var(--accent-violet), var(--accent-cyan));
  flex-shrink: 0;
}

.event-content {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 20px;
  flex: 1;
  flex-wrap: wrap;
}

.event-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dates {
  display: flex;
  align-items: center;
  gap: 6px;
}

.date {
  color: var(--text-secondary);
  font-size: 14px;
}

.arrow-icon {
  color: var(--accent-cyan);
}
</style>
