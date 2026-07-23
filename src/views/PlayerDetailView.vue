<script setup>
import { useRoute } from "vue-router";
import { onBeforeMount, watch } from "vue";
import { usePlayerStore } from "@/stores/player";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

const route = useRoute();
const playerStore = usePlayerStore();
const { fetchPlayer } = playerStore;
const { player } = storeToRefs(playerStore);

async function loadData(id) {
  try {
    await fetchPlayer(id);
  } catch (error) {
    console.error('Erreur lors du chargement du joueur:', error);
  }
}

onBeforeMount(() => loadData(route.params.id));
watch(() => route.params.id, (newId) => { if (newId) loadData(newId); });
</script>
<template>
  <div class="page-wrapper">
    <div class="player-hero glass-card">
      <div class="player-avatar">
        <span>{{ (player.name ?? '??').substring(0, 2).toUpperCase() }}</span>
      </div>
      <div class="player-info">
        <p class="player-name">{{ player.name }}</p>
        <router-link
          :to="{ name: 'team', params: { id: player.team_id || player.team } }"
          class="team-link"
        >{{ player.team_name }}</router-link>
        <p class="discord" v-if="player.discord != null">{{ player.discord }}</p>
      </div>
    </div>

    <div class="section">
      <p class="section-label">Résultats</p>
      <div class="stats-list" v-if="player.stats && player.stats.length > 0">
        <div class="stat-card glass-card" v-for="stat in player.stats" :key="stat.season_id">
          <div class="stat-breadcrumb">
            <RouterLink :to="{ name: 'season', params: { id: stat.season_id } }" class="bc-link">{{ stat.season_name }}</RouterLink>
            <span class="bc-sep">/</span>
            <RouterLink :to="{ name: 'division', params: { id: stat.division_id } }" class="bc-link">{{ stat.division_name }}</RouterLink>
          </div>
          <div class="stat-table-wrapper">
            <table class="stat-table">
              <thead>
                <tr>
                  <th>V</th><th>D</th><th>J</th><th>MG</th><th>MP</th><th>Pts</th><th>+/-</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ stat.wins }}</td>
                  <td>{{ stat.losses }}</td>
                  <td>{{ stat.wins + stat.losses }}</td>
                  <td>{{ stat.winRounds }}</td>
                  <td>{{ stat.looseRounds }}</td>
                  <td class="pts">{{ stat.points }}</td>
                  <td>{{ stat.winRounds - stat.looseRounds }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <p v-else class="empty-msg">Aucun résultat trouvé</p>
    </div>
  </div>
</template>
<style scoped>
.player-hero {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px 32px;
  width: 100%;
}

.player-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.player-avatar span {
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.player-name {
  font-size: 28px;
  font-weight: 800;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.team-link {
  font-size: 14px;
  color: var(--accent-cyan);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.discord {
  font-size: 13px;
  color: var(--text-muted);
  font-style: italic;
}

.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px;
}

.stat-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bc-link {
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}

.bc-link:hover { color: var(--accent-cyan); }
.bc-sep { color: var(--text-muted); font-size: 13px; }

.stat-table-wrapper { overflow-x: auto; }

.stat-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.stat-table th {
  padding: 8px 12px;
  background: rgba(124, 58, 237, 0.2);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
}

.stat-table td {
  padding: 10px 12px;
  background: rgba(255,255,255,0.03);
  color: var(--text-primary);
  text-align: center;
}

.stat-table .pts {
  font-weight: 700;
  color: var(--accent-cyan);
}

.empty-msg {
  color: var(--text-secondary);
  font-size: 15px;
}

@media (max-width: 768px) {
  .player-container {
    width: 100%;
  }

  .player {
    width: 100%;
    padding: 16px;
  }

  p {
    overflow-wrap: anywhere;
  }
}

@media (max-width: 640px) {
  /* Le tableau de résultats défile dans son conteneur au lieu d'élargir la page. */
  .result {
    max-width: 100%;
    overflow-x: auto;
  }

  .results-table {
    margin: 12px 0;
    padding: 16px;
  }

  .results-table th,
  .results-table td {
    padding: 10px 8px;
    font-size: 15px;
  }

  .stat {
    width: 100%;
    padding: 16px;
  }

  .stat-title {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
