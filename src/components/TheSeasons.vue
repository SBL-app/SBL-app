<script setup>
import { RouterLink } from "vue-router";
import { useSeasonStore } from "@/stores/seasons";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";

const seasonStore = useSeasonStore();
const { fetchAllSeasons } = seasonStore;
const { seasons } = storeToRefs(seasonStore);

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
        v-for="season in seasons"
        :key="season.id"
      >
        <p class="item-title">{{ season.name }}</p>
        <p class="test">{{ season.percentage }}%</p>
        <div class="progressbar">
          <div class="progress" :style="progressStyle(season.percentage)"></div>
        </div>
        <p class="item-status">
          {{ season.percentage === 100 ? 'terminé' : 'en cours' }}
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
}

.seasons {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
  flex-wrap: wrap;
}

.season-item {
  display: flex;
  padding: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  border-radius: 8px;
  background: var(--embed-color-1, #5c47e0);
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