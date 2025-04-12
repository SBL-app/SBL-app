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
        <div class="result">
          <table class="results-table">
            <thead>
              <tr>
                <th>V</th>
                <th>D</th>
                <th>J</th>
                <th>MG</th>
                <th>MP</th>
                <th>PT</th>
                <th>Diff</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ stat.wins }}</td>
                <td>{{ stat.losses }}</td>
                <td>{{ stat.wins + stat.losses }}</td>
                <td>{{ stat.winRounds }}</td>
                <td>{{ stat.looseRounds }}</td>
                <td>{{ stat.points }}</td>
                <td>{{ stat.winRounds - stat.looseRounds }}</td>
              </tr>
            </tbody>
          </table>
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
p,
td,
th {
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
}
.result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color: #5c47e0;
  border-radius: 40px;
}
.results-table {
  padding: 24px;
  border-radius: 20px; /* Ajout d'un border-radius au tableau */
  background: var(--embed-color-1, #5c47e0);
  border-collapse: collapse; /* Fusionner les bordures pour supprimer les lignes blanches */
  box-sizing: border-box;
  text-align: center;
  overflow: hidden; /* Assure que le border-radius s'applique correctement */
  margin: 20px;
}

.results-table th,
.results-table td {
  padding: 15px 20px; /* Ajouter de l'espace à l'intérieur des cellules */
  border: none; /* Supprimer les bordures blanches */
  font-size: 18px; /* Taille de police légèrement plus grande */
}

.results-table th {
  background-color: var(--embed-color-2, #5c47e0); /* Couleur de fond pour les en-têtes */
  text-transform: uppercase; /* Texte en majuscules */
  font-weight: bold; /* Texte en gras */
}

.results-table td {
  background-color: var(--embed-color-1, #190d3f); /* Couleur de fond uniforme pour les cellules */
}

/* Ajouter un border-radius sur les coins supérieurs du corps */
.results-table tbody tr:first-child td:first-child {
  border-top-left-radius: 20px; /* Coin supérieur gauche */
}

.results-table tbody tr:first-child td:last-child {
  border-top-right-radius: 20px; /* Coin supérieur droit */
}

.results-table a {
  color: #fff;
  text-decoration: underline;
}

results-table thead {
  border-bottom: none; /* Supprimer la bordure en bas de l'en-tête */
}

.results-table tbody tr:last-child td {
  border-bottom: none; /* Supprimer la bordure en bas de la dernière ligne */
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
