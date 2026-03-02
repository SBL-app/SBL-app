<script setup>
import { useRoute, RouterLink } from "vue-router";
import { useSeasonStore } from "@/stores/seasons";
import { useDivisionStore } from "@/stores/division";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";

const route = useRoute();
const seasonStore = useSeasonStore();
const { fetchSeason } = seasonStore;
const { season } = storeToRefs(seasonStore);

const divisionStore = useDivisionStore();
const { fetchDivisionBySeason } = divisionStore;
const { divisions } = storeToRefs(divisionStore);

onBeforeMount(async () => {
  const seasonId = route.params.id;
  await fetchSeason(seasonId);
  await fetchDivisionBySeason(seasonId);
});

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
</script>
<template>
  <div class="page-wrapper">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <RouterLink to="/seasons" class="breadcrumb-link">Saisons</RouterLink>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">{{ season.name }}</span>
    </div>

    <!-- Hero card saison -->
    <div class="season-hero glass-card">
      <p class="hero-title">{{ season.name }}</p>
      <div class="hero-meta">
        <div class="dates">
          <span class="date">{{ formatDate(season.start_date) }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" class="arrow-icon">
            <path d="M10.7832 8.66675H2.6665V7.33342H10.7832L7.04984 3.60008L7.99984 2.66675L13.3332 8.00008L7.99984 13.3334L7.04984 12.4001L10.7832 8.66675Z" fill="currentColor"/>
          </svg>
          <span class="date">{{ formatDate(season.end_date) }}</span>
        </div>
      </div>
    </div>

    <!-- Divisions -->
    <div class="divisions-section">
      <p class="section-label">Divisions</p>
      <div class="divisions-grid">
        <router-link
          :to="{ name: 'division', params: { id: division.id } }"
          class="division-card glass-card"
          v-for="division in divisions"
          :key="division.id"
        >
          <p class="division-title">{{ division.name }}</p>
          <div class="ranking-table">
            <div class="ranking-header">
              <span class="col-rank">P</span>
              <span class="col-name">Équipe</span>
              <span class="col-stat">V</span>
              <span class="col-stat">D</span>
              <span class="col-stat">Pts</span>
            </div>
            <div
              class="ranking-row"
              :class="{ 'top-1': index === 0, 'top-2': index === 1, 'top-3': index === 2 }"
              v-for="(team, index) in division.teams"
              :key="index"
            >
              <span class="col-rank rank-num">{{ index + 1 }}</span>
              <span class="col-name team-nm">{{ team.name }}</span>
              <span class="col-stat">{{ team.wins }}</span>
              <span class="col-stat">{{ team.losses }}</span>
              <span class="col-stat">{{ team.points }}</span>
            </div>
          </div>
        </router-link>
      </div>
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

.breadcrumb-link:hover {
  color: var(--accent-cyan);
}

.breadcrumb-sep {
  color: var(--text-muted);
  font-size: 14px;
}

.breadcrumb-current {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.season-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  width: 100%;
  flex-wrap: wrap;
  gap: 16px;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dates {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date {
  color: var(--text-secondary);
  font-size: 14px;
}

.arrow-icon {
  color: var(--accent-cyan);
}

.divisions-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.divisions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
  width: 100%;
}

.division-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  text-decoration: none;
}

.division-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ranking-table {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ranking-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(124, 58, 237, 0.2);
  border-radius: 8px 8px 0 0;
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
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  transition: background 0.2s;
}

.ranking-row:nth-child(even) {
  background: rgba(255, 255, 255, 0.04);
}

.ranking-row:last-child {
  border-radius: 0 0 8px 8px;
}

.rank-num {
  font-weight: 700;
}

.top-1 .rank-num { color: var(--accent-gold); }
.top-2 .rank-num { color: var(--accent-silver); }
.top-3 .rank-num { color: var(--accent-bronze); }

.col-rank {
  width: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--text-primary);
}

.col-name {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-stat {
  width: 32px;
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
