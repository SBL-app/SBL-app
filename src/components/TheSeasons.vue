<script setup>
import { computed, onBeforeMount } from 'vue';
import { storeToRefs } from "pinia";
import { useSeasonStore } from "@/stores/seasons";
import { sortSeasonsByRecent } from "@/utils/format";

const seasonStore = useSeasonStore();
const { fetchAllSeasons } = seasonStore;
const { seasons } = storeToRefs(seasonStore);

// De la plus récente à la plus ancienne.
const sortedSeasons = computed(() => sortSeasonsByRecent(seasons.value));

onBeforeMount(() => {
  fetchAllSeasons();
});

function progressStyle(percentage) {
  return {
    width: percentage + "%",
  };
}
</script>
<template>
  <div class="season-container">
    <p class="section-label">Saisons</p>
    <div class="seasons" v-if="seasons.length > 0">
      <router-link
        :to="{ name: 'season', params: { id: season.id } }"
        class="season-card glass-card"
        v-for="season in sortedSeasons"
        :key="season.id"
      >
        <p class="season-name">{{ season.name }}</p>
        <div class="progress-wrapper">
          <div class="progress-track">
            <div class="progress-fill" :style="progressStyle(season.percentage)"></div>
          </div>
          <span class="progress-pct">{{ season.percentage }}%</span>
        </div>
        <span
          class="status-badge"
          :class="Number(season.percentage) === 100 ? 'done' : 'active'"
        >
          {{ Number(season.percentage) === 100 ? 'terminé' : 'en cours' }}
        </span>
      </router-link>
    </div>
    <p v-else class="empty-msg">Aucune saison en cours</p>
  </div>
</template>
<style scoped>
.season-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.seasons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  /* Toutes les rangées à la même hauteur : deux cartes de lignes différentes
     gardent une taille identique. */
  grid-auto-rows: 1fr;
  gap: 20px;
  width: 100%;
  max-width: 900px;
}

.season-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px 20px;
  height: 100%;
  text-decoration: none;
}

/* Deux lignes réservées au nom : un titre court garde la même hauteur de carte
   qu'un titre long. Rognage visuel uniquement, texte complet pour les lecteurs
   d'écran. */
.season-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.6em;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  overflow-wrap: anywhere;
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
  transition: width 0.4s ease;
}

.empty-msg {
  color: var(--text-secondary);
  font-size: 16px;
}
</style>
