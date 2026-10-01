<script setup>
import { useRoute, RouterLink } from "vue-router";
import { computed, onBeforeMount, ref, watch } from "vue";
import ky from "ky";
import { API_URL } from "../../API_URL";
import { formatDate, getEventStatus } from "@/utils/format";

const route = useRoute();

// État local : ne pas écraser `season` du store, partagé avec d'autres vues.
const event = ref(null);
const teams = ref([]);
const isLoading = ref(true);

const status = computed(() => getEventStatus(event.value));

async function loadData(id) {
  isLoading.value = true;
  try {
    // `completion` renvoie nom, dates et pourcentage (utile au statut).
    const [eventData, teamsData] = await Promise.all([
      ky.get(`${API_URL}/seasons/${id}/completion`).json(),
      ky.get(`${API_URL}/seasons/${id}/teams`).json(),
    ]);
    if (String(route.params.id) !== String(id)) return;
    event.value = eventData;
    teams.value = Array.isArray(teamsData?.teams) ? teamsData.teams : [];
  } catch {
    event.value = null;
    teams.value = [];
  } finally {
    isLoading.value = false;
  }
}

onBeforeMount(() => loadData(route.params.id));
watch(() => route.params.id, (newId) => { if (newId) loadData(newId); });

</script>
<template>
  <div class="page-wrapper">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <RouterLink to="/events" class="breadcrumb-link">Évènements</RouterLink>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">{{ event?.name }}</span>
    </div>

    <p v-if="!isLoading && !event" class="empty">Évènement introuvable</p>

    <template v-else-if="event">
      <!-- Hero card évènement -->
      <div class="event-hero glass-card">
        <div class="hero-main">
          <p class="hero-title">{{ event.name }}</p>
          <div class="dates">
            <span class="date">{{ formatDate(event.start_date) }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" class="arrow-icon">
              <path d="M10.7832 8.66675H2.6665V7.33342H10.7832L7.04984 3.60008L7.99984 2.66675L13.3332 8.00008L7.99984 13.3334L7.04984 12.4001L10.7832 8.66675Z" fill="currentColor"/>
            </svg>
            <span class="date">{{ formatDate(event.end_date) }}</span>
          </div>
        </div>
        <div class="hero-side">
          <span class="status-badge" :class="status.cssClass">{{ status.label }}</span>
          <RouterLink :to="{ name: 'season', params: { id: event.id } }" class="season-link">
            Voir la saison
          </RouterLink>
        </div>
      </div>

      <!-- Équipes inscrites -->
      <div class="teams-section">
        <p class="section-label">
          Équipes inscrites<span v-if="teams.length"> · {{ teams.length }}</span>
        </p>
        <div v-if="teams.length" class="teams-grid">
          <RouterLink
            v-for="team in teams"
            :key="team.id"
            :to="{ name: 'team', params: { id: team.id } }"
            class="team-card glass-card"
            :title="team.name"
          >
            <span class="team-initial">{{ team.name?.charAt(0)?.toUpperCase() }}</span>
            <span class="team-name">{{ team.name }}</span>
          </RouterLink>
        </div>
        <p v-else class="empty">Aucune équipe inscrite pour le moment</p>
      </div>
    </template>
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

.event-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  width: 100%;
  flex-wrap: wrap;
  gap: 16px;
}

.hero-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-side {
  display: flex;
  align-items: center;
  gap: 16px;
}

.season-link {
  color: var(--accent-cyan);
  font-size: 14px;
  font-weight: 600;
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

.teams-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  width: 100%;
}

.team-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  text-decoration: none;
}

.team-initial {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--gradient-main);
  color: #fff;
  font-weight: 700;
  font-size: 16px;
}

.team-name {
  min-width: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty {
  color: var(--text-secondary);
  font-size: 16px;
}

/* Mobile : deux colonnes plutôt qu'une longue liste d'équipes. */
@media (max-width: 600px) {
  .teams-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .team-card {
    gap: 8px;
    padding: 10px;
  }

  .team-initial {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    font-size: 14px;
  }

  .team-name {
    font-size: 13px;
  }
}
</style>
