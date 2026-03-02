<script setup>
import { useRoute } from "vue-router";
import { onBeforeMount, ref } from "vue";
import { useTeamStore } from "@/stores/team";
import { RouterLink } from "vue-router";

const route = useRoute();
const teamStore = useTeamStore();
const { fetchTeamDetails } = teamStore;

const teamData = ref(null);
const players = ref([]);
const teamStats = ref([]);

onBeforeMount(async () => {
  const teamId = route.params.id;
  try {
    const data = await fetchTeamDetails(teamId);
    teamData.value = data.team;
    players.value = data.players;
    teamStats.value = data.stats;
  } catch (error) {
    console.error('Erreur lors du chargement des détails de l\'équipe:', error);
  }
});
</script>
<template>
  <div class="page-wrapper" v-if="teamData">
    <!-- Hero équipe -->
    <div class="team-hero glass-card">
      <div class="team-avatar">
        <span>{{ (teamData.name ?? '??').substring(0, 2).toUpperCase() }}</span>
      </div>
      <div class="team-info">
        <p class="team-name">{{ teamData.name }}</p>
        <p class="captain-info" v-if="teamData.captain">Capitaine : {{ teamData.captain }}</p>
        <p class="captain-info muted" v-else>Aucun capitaine défini</p>
      </div>
    </div>

    <!-- Joueurs -->
    <div class="section">
      <p class="section-label">Joueurs</p>
      <div class="players-grid" v-if="players.length > 0">
        <RouterLink
          class="player-card glass-card"
          v-for="player in players"
          :key="player.id"
          :to="{ name: 'player', params: { id: player.id } }"
        >
          <p class="player-name">{{ player.name }}</p>
        </RouterLink>
      </div>
      <p v-else class="empty-msg">Aucun joueur trouvé</p>
    </div>

    <!-- Résultats -->
    <div class="section" v-if="teamStats.length > 0">
      <p class="section-label">Résultats</p>
      <div class="stats-list">
        <div class="stat-card glass-card" v-for="stat in teamStats" :key="`${stat.division_id}-${stat.season_id}`">
          <div class="stat-breadcrumb">
            <RouterLink :to="{ name: 'season', params: { id: stat.season_id } }" class="bc-link">{{ stat.season_name }}</RouterLink>
            <span class="bc-sep">/</span>
            <RouterLink :to="{ name: 'division', params: { id: stat.division_id } }" class="bc-link">{{ stat.division_name }}</RouterLink>
          </div>
          <div class="stat-table-wrapper">
            <table class="stat-table">
              <thead>
                <tr>
                  <th>Pos</th><th>V</th><th>D</th><th>N</th><th>J</th>
                  <th>MG</th><th>MP</th><th>Pts</th><th>+/-</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ stat.position }}/{{ stat.total_teams }}</td>
                  <td>{{ stat.wins }}</td>
                  <td>{{ stat.losses }}</td>
                  <td>{{ stat.ties }}</td>
                  <td>{{ stat.wins + stat.losses + stat.ties }}</td>
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
    </div>
    <div class="section" v-else>
      <p class="section-label">Résultats</p>
      <p class="empty-msg">Aucun résultat trouvé</p>
    </div>
  </div>
</template>
<style scoped>
.team-hero {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px 32px;
  width: 100%;
}

.team-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.team-avatar span {
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
}

.team-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.team-name {
  font-size: 28px;
  font-weight: 800;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.captain-info {
  font-size: 14px;
  color: var(--accent-gold);
  font-weight: 600;
}

.captain-info.muted { color: var(--text-secondary); }

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

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  width: 100%;
}

.player-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-decoration: none;
}

.player-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
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
  font-size: 14px;
}

.stat-table .pts {
  font-weight: 700;
  color: var(--accent-cyan);
}

.empty-msg {
  color: var(--text-secondary);
  font-size: 15px;
}
</style>
