<script setup>
import { useRoute, RouterLink } from "vue-router";
import { useDivisionStore } from "@/stores/division";
import { useGameStore } from "@/stores/game";
import { useGameStatusStore } from "@/stores/gameStatus";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { onBeforeMount, watch, ref, computed } from "vue";

const route = useRoute();
const divisionStore = useDivisionStore();
const gameStore = useGameStore();
const gameStatusStore = useGameStatusStore();
const auth = useAuthStore();
const { fetchDivisionDetails, generateSchedule } = divisionStore;

const divisionData = ref(null);
const ranking = ref([]);
const teams = ref([]);
const games = ref([]);

const reportingGameId = ref(null);
const reportError = ref("");

// Génération de planning
const scheduleType = ref("round_robin");
const scheduleStartDate = ref("");
const generating = ref(false);
const scheduleError = ref("");
const hasSchedule = computed(() => games.value.length > 0);

async function loadData(id) {
  try {
    const data = await fetchDivisionDetails(id);
    divisionData.value = data.division;
    ranking.value = data.ranking;
    teams.value = data.teams;
    games.value = data.games;
  } catch (error) {
    console.error('Erreur lors du chargement des détails de la division:', error);
  }
}

async function handleReport(game) {
  reportError.value = "";
  const confirmed = window.confirm(
    `Reporter le match ${game.team1} vs ${game.team2} ? (1 report par équipe et par saison)`
  );
  if (!confirmed) return;

  const reason = window.prompt("Motif du report (optionnel) :") || "";

  reportingGameId.value = game.id;
  try {
    await gameStore.reportGame(game.id, reason);
    await loadData(route.params.id);
  } catch (e) {
    reportError.value =
      "Le report a échoué : vous devez être capitaine de l'une des équipes et ne pas avoir dépassé la limite de reports.";
    console.error(e);
  } finally {
    reportingGameId.value = null;
  }
}

async function handleGenerateSchedule() {
  scheduleError.value = "";

  if (hasSchedule.value) {
    const confirmed = window.confirm(
      "Un planning existe déjà pour cette division. Générer un nouveau planning ajoutera de nouveaux matchs. Continuer ?"
    );
    if (!confirmed) return;
  }

  generating.value = true;
  try {
    if (gameStatusStore.gameStatuses.length === 0) {
      await gameStatusStore.fetchAllGameStatuses();
    }
    const scheduled =
      gameStatusStore.gameStatuses.find((s) => s.name === "prévu") ||
      gameStatusStore.gameStatuses[0];
    if (!scheduled) {
      throw new Error("Aucun statut de match disponible");
    }

    const options = {
      type: scheduleType.value,
      status_id: scheduled.id,
    };
    if (scheduleStartDate.value) {
      options.start_date = scheduleStartDate.value;
    }

    await generateSchedule(route.params.id, options);
    await loadData(route.params.id);
  } catch (e) {
    scheduleError.value =
      "La génération du planning a échoué. Vérifiez vos droits et qu'au moins 2 équipes sont présentes.";
    console.error(e);
  } finally {
    generating.value = false;
  }
}

onBeforeMount(() => loadData(route.params.id));
watch(() => route.params.id, (newId) => { if (newId) loadData(newId); });

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

      <div v-if="auth.isAuthenticated" class="schedule-generator glass-card">
        <div class="schedule-controls">
          <label class="schedule-field">
            <span>Type</span>
            <select v-model="scheduleType" class="schedule-input">
              <option value="round_robin">Aller simple</option>
              <option value="double_round_robin">Aller-retour</option>
            </select>
          </label>
          <label class="schedule-field">
            <span>Date de début (optionnel)</span>
            <input v-model="scheduleStartDate" type="date" class="schedule-input" />
          </label>
          <button
            class="btn-generate"
            :disabled="generating"
            @click="handleGenerateSchedule"
          >
            {{ generating ? "Génération…" : hasSchedule ? "Régénérer le planning" : "Générer le planning" }}
          </button>
        </div>
        <p v-if="hasSchedule" class="schedule-hint">
          Un planning existe déjà pour cette division.
        </p>
        <p v-if="scheduleError" class="schedule-error">{{ scheduleError }}</p>
      </div>

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
              <button
                v-if="auth.isAuthenticated && game.status === 'prévu'"
                class="btn-report"
                :disabled="reportingGameId === game.id"
                @click="handleReport(game)"
              >
                {{ reportingGameId === game.id ? "…" : "Reporter" }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <p v-if="reportError" class="schedule-error">{{ reportError }}</p>
      <p v-if="games.length === 0" class="empty-msg">Aucun match prévu</p>
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

.btn-report {
  background: rgba(239, 68, 68, 0.12);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 8px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-report:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.2);
}

.schedule-generator {
  padding: 16px 20px;
  margin-bottom: 16px;
  width: 100%;
}

.schedule-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
}

.schedule-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.schedule-input {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 8px;
  padding: 8px 10px;
  color: var(--text-primary);
  font-size: 14px;
}

.schedule-input:focus {
  outline: none;
  border-color: var(--accent-violet);
}

.btn-generate {
  background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 9px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-report:disabled,
.btn-generate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.schedule-hint {
  margin-top: 10px;
  font-size: 13px;
  color: var(--text-secondary);
}

.schedule-error {
  margin-top: 10px;
  font-size: 13px;
  color: #ef4444;
  text-align: center;
}

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
