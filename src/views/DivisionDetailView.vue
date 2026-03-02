<script setup>
import { useRoute, RouterLink } from "vue-router";
import { useDivisionStore } from "@/stores/division";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const route = useRoute();
const divisionStore = useDivisionStore();
const { fetchDivisionDetails } = divisionStore;

const divisionData = ref(null);
const ranking = ref([]);
const teams = ref([]);
const games = ref([]);

onBeforeMount(async () => {
  const divisionId = route.params.id;
  try {
    const data = await fetchDivisionDetails(divisionId);
    divisionData.value = data.division;
    ranking.value = data.ranking;
    teams.value = data.teams;
    games.value = data.games;
  } catch (error) {
    console.error('Erreur lors du chargement des détails de la division:', error);
  }
});

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
</script>
<template>
  <div class="page-wrapper" v-if="divisionData">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <router-link
        :to="{ name: 'season', params: { id: divisionData.season_id } }"
        class="breadcrumb-link"
      >{{ divisionData.season_name }}</router-link>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">{{ divisionData.name }}</span>
    </div>

    <!-- Classement -->
    <div class="section">
      <p class="section-label">Classement</p>
      <div class="ranking-card glass-card">
        <div class="ranking-header">
          <span class="col-rank">#</span>
          <span class="col-name">Équipe</span>
          <span class="col-stat">V</span>
          <span class="col-stat">N</span>
          <span class="col-stat">D</span>
          <span class="col-stat">F</span>
          <span class="col-stat">MG</span>
          <span class="col-stat">MP</span>
          <span class="col-stat">+/-</span>
          <span class="col-stat">Pts</span>
        </div>
        <div
          class="ranking-row"
          :class="{ 'top-1': teamRanking.position === 1, 'top-2': teamRanking.position === 2, 'top-3': teamRanking.position === 3 }"
          v-for="teamRanking in ranking"
          :key="teamRanking.team_id"
        >
          <span class="col-rank rank-num">{{ teamRanking.position }}</span>
          <span class="col-name">{{ teamRanking.team_name }}</span>
          <span class="col-stat">{{ teamRanking.stats.wins }}</span>
          <span class="col-stat">{{ teamRanking.stats.ties }}</span>
          <span class="col-stat">{{ teamRanking.stats.losses }}</span>
          <span class="col-stat">0</span>
          <span class="col-stat">{{ teamRanking.stats.winRounds }}</span>
          <span class="col-stat">{{ teamRanking.stats.looseRounds }}</span>
          <span class="col-stat">{{ teamRanking.stats.winRounds - teamRanking.stats.looseRounds }}</span>
          <span class="col-stat pts">{{ teamRanking.stats.points }}</span>
        </div>
      </div>
    </div>

    <!-- Planning -->
    <div class="section">
      <p class="section-label">Planning</p>
      <div class="planning-list" v-if="games.length > 0">
        <div class="week-card glass-card" v-for="week in games" :key="week.week">
          <p class="week-title">Semaine {{ week.week }}</p>
          <div class="matches">
            <div class="match-card" v-for="game in week.games" :key="game.id">
              <span class="match-date">{{ formatDate(game.date) }}</span>
              <div class="match-teams">
                <span class="team-name">{{ game.team1 }}</span>
                <div class="match-score">
                  <span class="score">{{ game.score1 }}</span>
                  <span class="vs">VS</span>
                  <span class="score">{{ game.score2 }}</span>
                </div>
                <span class="team-name">{{ game.team2 }}</span>
              </div>
              <span
                class="status-badge"
                :class="game.status === 'joué' ? 'done' : game.status === 'prévu' ? 'scheduled' : 'cancelled'"
              >{{ game.status }}</span>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="empty-msg">Aucun match prévu</p>
    </div>

    <!-- Équipes -->
    <div class="section">
      <p class="section-label">Équipes</p>
      <div class="teams-grid" v-if="teams.length > 0">
        <div class="team-card glass-card" v-for="team in teams" :key="team.id">
          <p class="team-title">{{ team.name }}</p>
          <p class="captain" v-if="team.captain">Capitaine : {{ team.captain }}</p>
          <div class="members-section">
            <p class="members-label">Membres</p>
            <div class="members-list">
              <div class="member" v-for="member in team.members" :key="member.id">
                <span class="member-name">{{ member.name }}</span>
                <span class="member-discord" v-if="member.discord">{{ member.discord }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="empty-msg">Aucune équipe</p>
    </div>
  </div>
</template>
<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
}

.breadcrumb-link {
  color: var(--text-secondary);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover { color: var(--accent-cyan); }

.breadcrumb-sep { color: var(--text-muted); font-size: 14px; }

.breadcrumb-current {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
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

.ranking-card {
  width: 100%;
  overflow: hidden;
  overflow-x: auto;
}

.ranking-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(124, 58, 237, 0.2);
}

.ranking-header span {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.ranking-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  transition: background 0.15s;
}

.ranking-row:nth-child(even) { background: rgba(255,255,255,0.02); }
.ranking-row:hover { background: rgba(255,255,255,0.05); }

.top-1 .rank-num { color: var(--accent-gold); font-weight: 700; }
.top-2 .rank-num { color: var(--accent-silver); font-weight: 700; }
.top-3 .rank-num { color: var(--accent-bronze); font-weight: 700; }

.col-rank {
  width: 28px;
  text-align: center;
  font-size: 14px;
  color: var(--text-primary);
}

.col-name {
  flex: 1;
  min-width: 140px;
  font-size: 14px;
  color: var(--text-primary);
}

.col-stat {
  width: 36px;
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}

.pts { color: var(--text-primary); font-weight: 700; }

.planning-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.week-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px;
}

.week-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.matches {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.match-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  flex-wrap: wrap;
}

.match-date {
  font-size: 13px;
  color: var(--text-muted);
  min-width: 90px;
}

.match-teams {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: center;
}

.team-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 120px;
  text-align: center;
}

.match-score {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.vs {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
}

.team-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

.team-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
}

.captain {
  font-size: 14px;
  color: var(--accent-gold);
  font-weight: 600;
  text-align: center;
}

.members-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.members-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
}

.member-name {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.member-discord {
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
}

.empty-msg {
  color: var(--text-secondary);
  font-size: 15px;
}
</style>
