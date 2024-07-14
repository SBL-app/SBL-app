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
});

</script>
<template>
  <div class="season-container">
    <p class="title">Saisons :</p>
    <div class="seasons">
      
      <router-link :to="{ name: 'season', params: { id: season.id }}" class="season-item" v-for="season in seasons" :key="season.id">
        <p class="item-title">{{ season.name }}</p>
        <div class="progressbar"></div>
        <p class="item-status">Terminé</p>
      </router-link>
    </div>
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
  font-family: Lexend;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.progressbar {
  width: 160px;
  height: 9px;
  border-radius: 99px;
  background: #04d200;
}
</style>
