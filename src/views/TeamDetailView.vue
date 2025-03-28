<script setup>
import { useRoute } from "vue-router";
import { onBeforeMount } from "vue";
import { useTeamStore } from "@/stores/team";
import { usePlayerStore } from "@/stores/player";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

const route = useRoute();
const teamStore = useTeamStore();
const playerStore = usePlayerStore();

const { fetchTeam } = teamStore;
const { fetchPlayersByTeam } = playerStore;

const { team } = storeToRefs(teamStore);
const { players } = storeToRefs(playerStore);

onBeforeMount(() => {
  const teamId = route.params.id;
  fetchTeam(teamId);
  fetchPlayersByTeam(teamId);
  console.log("team detail view");
});
</script>
<template>
  <div class="team-detail">
    <div class="team-container">
      <div class="team">
        <p>{{ team.name }}</p>
      </div>
    </div>
    <div class="players-container">
      <p class="title">joueurs :</p>
      <div class="captain">
        <p>Captain : {{ team.captain }}</p>
      </div>
      <div class="players">
        <RouterLink
          class="player"
          v-for="player in players"
          :key="player.id"
          :to="{ name: 'player', params: { id: player.id } }"
        >
          <p>{{ player.name }}</p>
        </RouterLink>
      </div>
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
.team-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  width: 100%;
}
.team-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  width: 100%;
}
.team {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  border-radius: 20px;
  background: var(--embed-color-2, #190d3f);
}
.players-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  width: 100%;
}
.players {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  align-items: center;
  gap: 20px;
  width: 80%;
}
.player {
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
