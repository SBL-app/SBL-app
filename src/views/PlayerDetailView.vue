<script setup>
import { useRoute } from "vue-router";
import { onBeforeMount } from "vue";
import { usePlayerStore } from "@/stores/player";
import { storeToRefs } from "pinia";

const route = useRoute();
const playerStore = usePlayerStore();

const { fetchPlayer } = playerStore;
const { player } = storeToRefs(playerStore);

onBeforeMount(() => {
  const playerId = route.params.id;
  fetchPlayer(playerId);
  console.log("player detail view");
});
</script>
<template>
  <div class="player-detail">
    <div class="player-container">
      <div class="player">
        <p class="player-name">{{ player.name }}</p>
        <router-link
          :to="{ name: 'team', params: { id: player.team } }"
          class="team"
          >{{ player.team_name }}</router-link
        >
        <div class="discord" v-if="player.discord != null">
          <p>discord : {{ player.discord }}</p>
        </div>
        <div class="stats">
          <p>résultats</p>
          <div v-if="player.stats && player.stats.length > 0">
            <div
              class="stat"
              v-for="stat in player.stats"
              :key="stat.season_id"
            >
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
          <div v-else>
            <p>Aucun résultat trouvé</p>
          </div>
        </div>
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
.player-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  width: 100%;
}
.player-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  width: 80%;
}
.player {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background: var(--background, #190d3f);
}
.stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  width: 100%;
}
.stat {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
}
.stat-title {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: underline;
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
  background-color: var(
    --embed-color-2,
    #5c47e0
  ); /* Couleur de fond pour les en-têtes */
  text-transform: uppercase; /* Texte en majuscules */
  font-weight: bold; /* Texte en gras */
}

.results-table td {
  background-color: var(
    --embed-color-1,
    #190d3f
  ); /* Couleur de fond uniforme pour les cellules */
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
</style>
