<script setup>
import { computed, onBeforeMount } from 'vue';
import { storeToRefs } from "pinia";
import { useSeasonStore } from "@/stores/seasons";
import { getSeasonStatus, sortSeasonsByRecent } from "@/utils/format";

const seasonStore = useSeasonStore();
const { fetchAllSeasons } = seasonStore;
const { seasons, isLoadingSeasons } = storeToRefs(seasonStore);

// Nombre de cartes fictives affichées pendant le chargement. Elles occupent
// exactement la même place que les cartes réelles, ce qui évite que l'arrivée
// des données ne pousse le contenu situé en dessous (BUG-022 : CLS mobile).
const SKELETON_COUNT = 4;

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

    <!-- Squelette de chargement : même grille, mêmes dimensions de carte que
         le rendu final. L'espace est donc réservé dès le premier affichage. -->
    <div
      class="seasons"
      v-if="isLoadingSeasons"
      aria-busy="true"
      aria-live="polite"
      aria-label="Chargement des saisons"
    >
      <div
        class="season-card glass-card season-card--skeleton"
        v-for="n in SKELETON_COUNT"
        :key="`skeleton-${n}`"
        aria-hidden="true"
      >
        <p class="season-name skeleton-block"></p>
        <div class="progress-wrapper">
          <div class="progress-track"></div>
          <span class="progress-pct skeleton-block skeleton-block--pct"></span>
        </div>
        <span class="status-badge skeleton-block skeleton-block--badge"></span>
      </div>
    </div>

    <div class="seasons" v-else-if="seasons.length > 0">
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
          :class="getSeasonStatus(season).cssClass"
        >
          {{ getSeasonStatus(season).label }}
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
  /* Hauteur plancher correspondant au libellé de section et à une rangée de
     cartes. Garantit que le bloc n'est jamais plus petit que son rendu final,
     même dans l'état vide (BUG-022). */
  min-height: 260px;
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
  /* auto-fit : les colonnes vides sont supprimées, les cartes occupent toute
     la largeur et restent centrées quel que soit le nombre de saisons. */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  /* Toutes les rangées à la même hauteur : deux cartes de lignes différentes
     gardent une taille identique. */
  grid-auto-rows: 1fr;
  gap: 20px;
  width: 100%;
  /* Même largeur que la carte « prochain évènement » au-dessus. */
  max-width: 800px;
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

/* ---------------------------------------------------------------------------
   Squelette de chargement (BUG-022)
   Les cartes fictives reprennent la géométrie exacte des cartes réelles ;
   seul le contenu textuel est remplacé par des blocs neutres.
--------------------------------------------------------------------------- */
.season-card--skeleton {
  pointer-events: none;
}

.skeleton-block {
  border-radius: 6px;
  background: var(--surface-subtle, rgba(255, 255, 255, 0.08));
  animation: skeleton-pulse 1.4s ease-in-out infinite;
}

/* Reprend la hauteur de deux lignes de .season-name */
.season-name.skeleton-block {
  width: 70%;
  height: 2.6em;
}

.skeleton-block--pct {
  width: 36px;
  height: 13px;
}

.skeleton-block--badge {
  width: 64px;
  height: 20px;
  border-radius: 99px;
}

@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

/* Respect de la préférence système : pas d'animation pour les personnes
   sensibles au mouvement. */
@media (prefers-reduced-motion: reduce) {
  .skeleton-block {
    animation: none;
  }
}
</style>
