<script setup>
import { RouterLink } from "vue-router";
import { useSeasonStore } from "@/stores/seasons";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { sortSeasonsByRecent } from "@/utils/format";

const seasonStore = useSeasonStore();
const { fetchAllSeasons } = seasonStore;
const { seasons } = storeToRefs(seasonStore);

// De la plus récente à la plus ancienne.
const sortedSeasons = computed(() => sortSeasonsByRecent(seasons.value));

onBeforeMount(() => {
  fetchAllSeasons();
  console.log("the seasons");
});

function progressStyle(percentage) {
  let color;
  if (percentage < 30) {
    color = "#ff4d4d"; // Rouge
  } else if (percentage < 70) {
    color = "#ffcc00"; // Jaune
  } else {
    color = "#76c7c0"; // Vert
  }
  return {
    width: percentage + "%",
    backgroundColor: color,
  };
}
</script>
<template>
  <div class="season-container">
    <p class="title">Saisons :</p>
    <div class="seasons" v-if="seasons.length > 0">
      <router-link
        :to="{ name: 'season', params: { id: season.id } }"
        class="season-item"
        v-for="season in sortedSeasons"
        :key="season.id"
      >
        <p class="item-title">{{ season.name }}</p>
        <p class="test">{{ season.percentage }}%</p>
        <div class="progressbar">
          <div class="progress" :style="progressStyle(season.percentage)"></div>
        </div>
        <p class="item-status">
          {{ Number(season.percentage) === 100 ? 'terminé' : 'en cours' }}
        </p>
      </router-link>
    </div>
    <p v-else>Aucune saison en cours</p>
  </div>
</template>
<style scoped>
.season-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  width: 100%;
}

/* Grille à pistes identiques : toutes les cartes ont la même largeur, et
   `stretch` (par défaut en grid) leur donne la même hauteur. */
.seasons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 240px));
  /* Toutes les rangées à la même hauteur : deux cartes de lignes différentes
     restent identiques. */
  grid-auto-rows: 1fr;
  justify-content: center;
  gap: clamp(16px, 5vw, 80px);
  width: 100%;
}

.season-item {
  display: flex;
  padding: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: var(--embed-color-1, #5c47e0);
}

/* Le nom occupe exactement deux lignes, quelle que soit sa longueur : c'est ce
   qui garantit des cartes de taille identique d'une grille à l'autre. Le texte
   n'est tronqué que visuellement, il reste entier pour les lecteurs d'écran. */
.item-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.6em;
  overflow-wrap: anywhere;
}

.title {
  text-decoration-line: underline;
}

p {
  color: #fff;
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.progressbar {
  width: 160px;
  max-width: 100%;
  height: 9px;
  border-radius: 99px;
  background: #e0e0e0;
  position: relative;
}

.progress {
  height: 100%;
  border-radius: 99px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>