<script setup>
import { onBeforeMount } from 'vue';
import { storeToRefs } from "pinia";
import { useSeasonStore } from "@/stores/seasons";

const seasonStore = useSeasonStore();
const { fetchAllSeasons } = seasonStore;
const { seasons } = storeToRefs(seasonStore);

onBeforeMount(() => {
  fetchAllSeasons();
});
</script>
<template>
  <div class="presentation-container">
    <div class="presentation-card">
      <p class="section-label">Qui sommes-nous ?</p>
      <p class="text" v-if="seasons.length > 0">
        Créer en 2022, la Splatoon Baguette League se charge d'organiser des
        ligues sur Splatoon le plus souvent possible afin de soutenir la scène
        compétitive française présente sur le jeu. Depuis sa création la SBL à
        assurer {{ seasons.length - 1 }} saisons ainsi que différents tournois gravitant autour de ces
        saisons et prépare actuellement sa {{ seasons.length }} ème saison.
      </p>
      <p class="text loading" v-else>Chargement...</p>
    </div>
  </div>
</template>
<style scoped>
.presentation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
}

.presentation-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px 32px;
  width: 100%;
  background: rgba(124, 58, 237, 0.06);
  border-left: 3px solid var(--accent-violet);
  border-radius: 0 12px 12px 0;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-violet);
}

.text {
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.8;
  max-width: 700px;
}

.loading {
  color: var(--text-muted);
  font-style: italic;
}
</style>
