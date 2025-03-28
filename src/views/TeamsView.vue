<script setup>
import { onBeforeMount } from "vue";
import { useTeamStore } from "@/stores/team";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

const teamStore = useTeamStore();
const { fetchAllTeams } = teamStore;
const { teams } = storeToRefs(teamStore);

onBeforeMount(() => {
  fetchAllTeams();
  console.log("teams view");
});
</script>
<template>
  <div class="teams-container">
    <p class="title">équipes :</p>
    <div class="teams">
      <RouterLink
        class="team"
        v-for="team in teams"
        :key="team.id"
        :to="{ name: 'team', params: { id: team.id } }"
      >
        <p>{{ team.name }}</p>
      </RouterLink>
    </div>
  </div>
</template>
<style scoped>
p {
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-decoration: none;
}
.title {
  text-decoration: underline;
}
.teams-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  width: 100%;
}
.teams {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  align-items: center;
  gap: 20px;
  width: 80%;
}
.team {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: 8px;
  background: var(--embed-color-1, #5c47e0);
  width: 100%;
  box-sizing: border-box;
}
</style>
