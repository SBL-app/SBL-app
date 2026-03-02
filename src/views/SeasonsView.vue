<script setup>
import { onBeforeMount } from "vue";
import { useSeasonStore } from "@/stores/seasons";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { RouterLink } from "vue-router";

const seasonStore = useSeasonStore();
const { fetchAllSeasons } = seasonStore;
const { seasons } = storeToRefs(seasonStore);

onBeforeMount(() => {
  fetchAllSeasons();
});

const oldSeasons = computed(() => {
  return seasons.value.slice(0, -1);
});

const lastSeason = computed(() => {
  return seasons.value.length > 0
    ? seasons.value[seasons.value.length - 1]
    : null;
});

function progressStyle(percentage) {
  return { width: percentage + "%" };
}
</script>
<template>
  <div class="page-wrapper">
    <div class="section">
      <p class="section-label">Saison en cours</p>
      <div class="seasons-grid single" v-if="lastSeason">
        <router-link
          :to="{ name: 'season', params: { id: lastSeason.id } }"
          class="season-card glass-card featured"
        >
          <p class="season-name">{{ lastSeason.name }}</p>
          <div class="progress-wrapper">
            <div class="progress-track">
              <div class="progress-fill" :style="progressStyle(lastSeason.percentage)"></div>
            </div>
            <span class="progress-pct">{{ lastSeason.percentage }}%</span>
          </div>
          <span class="status-badge" :class="Number(lastSeason.percentage) === 100 ? 'done' : 'active'">
            {{ Number(lastSeason.percentage) === 100 ? "terminé" : "en cours" }}
          </span>
        </router-link>
      </div>
      <p v-else class="empty-msg">Aucune saison en cours</p>
    </div>

    <hr class="gradient-divider" />

    <div class="section" v-if="oldSeasons.length > 0">
      <p class="section-label">Saisons précédentes</p>
      <div class="seasons-grid">
        <router-link
          v-for="season in oldSeasons"
          :key="season.id"
          :to="{ name: 'season', params: { id: season.id } }"
          class="season-card glass-card"
        >
          <p class="season-name">{{ season.name }}</p>
          <div class="progress-wrapper">
            <div class="progress-track">
              <div class="progress-fill" :style="progressStyle(season.percentage)"></div>
            </div>
            <span class="progress-pct">{{ season.percentage }}%</span>
          </div>
          <span class="status-badge done">terminé</span>
        </router-link>
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

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.seasons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
}

.seasons-grid.single {
  max-width: 320px;
}

.season-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 20px;
  text-decoration: none;
}

.season-card.featured {
  border-color: rgba(124, 58, 237, 0.5);
}

.season-name {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 700;
  text-align: center;
}

.progress-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.progress-pct {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.progress-track {
  width: 100%;
  height: 6px;
  border-radius: 99px;
  background: var(--surface-subtle, rgba(255, 255, 255, 0.08));
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--accent-violet), var(--accent-cyan));
}

.empty-msg {
  color: var(--text-secondary);
  font-size: 15px;
}
</style>
