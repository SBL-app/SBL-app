<script setup>
import { useRoute } from "vue-router";
import { useSeasonStore } from "@/stores/seasons";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";

const route = useRoute();

const seasonStore = useSeasonStore();
const { fetchTeamsBySeason } = seasonStore;
const { season } = storeToRefs(seasonStore);

onBeforeMount(async () => {
  const seasonId = route.params.id;
  fetchTeamsBySeason(seasonId);
});
</script>
<template>
  <div class="event-focus">
    <p class="title">{{ season.name }}</p>
    <div class="registered-teams">
      <p class="registered-title">équipes inscrites :</p>
      <div class="teams">
        <p class="team-name" v-for="team in season.teams" :key="team.id">
          {{ team.name }}
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
p {
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-decoration: none;
}
.registered-title, .title {
  text-decoration: underline;
}
.team-name {
  width: 100px;
}
.teams {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: 15px;
  align-self: stretch;
  flex-wrap: wrap;
}
.registered-teams {
  display: flex;
  padding: 20px 33px;
  max-width: 300px;
  flex-direction: column;
  align-items: center;
  gap: 37px;
  border-radius: 20px;
  background: var(--embed-color-1, #5c47e0);
}
.event-focus {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 46px;
}
</style>
