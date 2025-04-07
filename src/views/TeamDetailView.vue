<script setup>
import { useRoute } from "vue-router";
import { onBeforeMount } from "vue";
import { useTeamStore } from "@/stores/team";
import { usePlayerStore } from "@/stores/player";
import { useTeamStatStore } from "@/stores/teamStat";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

const route = useRoute();
const teamStore = useTeamStore();
const playerStore = usePlayerStore();
const teamStatStore = useTeamStatStore();

const { fetchTeam } = teamStore;
const { fetchPlayersByTeam } = playerStore;
const { fetchTeamStatByTeamId } = teamStatStore;

const { team } = storeToRefs(teamStore);
const { players } = storeToRefs(playerStore);
const { teamStats } = storeToRefs(teamStatStore);

onBeforeMount(() => {
  const teamId = route.params.id;
  fetchTeam(teamId);
  fetchPlayersByTeam(teamId);
  fetchTeamStatByTeamId(teamId);
  console.log("team detail view");
});
</script>
<template>
  <div class="team-detail">
    <div class="teams container">
      <div class="team">
        <p>{{ team.name }}</p>
      </div>
    </div>
    <div class="players container">
      <p class="title">joueurs :</p>
      <div class="captain">
        <p>Captain : {{ team.captain }}</p>
      </div>
      <div class="players-cards">
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
    <div class="stats container" v-if="teamStats.length > 0">
      <p class="title">Résultats :</p>
      <div class="stat" v-for="stat in teamStats" :key="stat.id">
        <div class="stat-title">
          <RouterLink
            :to="{ name: 'season', params: { id: stat.season_id } }"
            class="season"
            >{{ stat.season_name }}</RouterLink
          >
          <p>/</p>
          <RouterLink
            :to="{ name: 'division', params: { id: stat.division_id } }"
            class="division"
            >{{ stat.division_name }}</RouterLink
          >
        </div>
        <div class="detail">
          <p>wins : {{ stat.wins }}</p>
          <p>losses : {{ stat.losses }}</p>
          <p>ties : {{ stat.ties }}</p>
          <p>winrounds : {{ stat.winRounds }}</p>
          <p>loosesRounds : {{ stat.looseRounds }}</p>
          <p>points : {{ stat.points }}</p>
        </div>
      </div>
    </div>
    <div class="stats container" v-else>
      <p class="title">Résultats :</p>
      <p>Aucun résultat trouvé</p>
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

.team {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  border-radius: 20px;
  background: var(--embed-color-2, #190d3f);
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  width: 100%;
}
.players-cards {
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
.stat {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  background: var(--embed-color-1, #5c47e0);
}
.stat-title {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: underline;
}
.detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.captain {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  border-radius: 20px;
  background: var(--embed-color-2, #190d3f);
}
</style>
