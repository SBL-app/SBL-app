<script>
import { computed, onBeforeMount, watch } from "vue";
import { useSeasonStore } from "@/stores/seasons";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const seasonStore = useSeasonStore();
    const { fetchAllSeasons } = seasonStore;
    const { seasons } = storeToRefs(seasonStore);

    const lastSeason = computed(() => {
      return seasons.value.length > 0 ? seasons.value[seasons.value.length - 1] : null;
    });

    onBeforeMount(() => {
      fetchAllSeasons();
    });

    watch(seasons, (newSeasons) => {
      if (newSeasons.length > 0) {
        lastSeason.value = newSeasons[newSeasons.length - 1];
      } else {
        lastSeason.value = null;
      }
    });

    return {
      seasons,
      lastSeason
    };
  }
};
</script>
<template>
  <div class="event-container">
    <p class="section-label">Prochain évènement</p>
    <RouterLink
      v-if="lastSeason"
      :to="{ name: 'event', params: { id: lastSeason.id } }"
      class="event-card glass-card"
    >
      <div class="event-accent"></div>
      <div class="event-content">
        <p class="event-name">{{ lastSeason.name }}</p>
        <div class="event-meta">
          <span class="meta-item">{{ seasons.length }} équipes</span>
          <span class="meta-sep">·</span>
          <div class="dates">
            <span class="date">{{ lastSeason.start_date }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" class="arrow-icon">
              <path d="M10.7832 8.66675H2.6665V7.33342H10.7832L7.04984 3.60008L7.99984 2.66675L13.3332 8.00008L7.99984 13.3334L7.04984 12.4001L10.7832 8.66675Z" fill="currentColor"/>
            </svg>
            <span class="date">{{ lastSeason.end_date }}</span>
          </div>
        </div>
        <span
          class="status-badge"
          :class="lastSeason.percentage === 100 ? 'done' : 'active'"
        >
          {{ lastSeason.percentage === 100 ? 'terminé' : 'en cours' }}
        </span>
      </div>
    </RouterLink>
    <div v-else class="no-event">
      <p>Aucun évènement disponible</p>
    </div>
  </div>
</template>
<style scoped>
.event-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 800px;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.event-card {
  display: flex;
  align-items: stretch;
  width: 100%;
  overflow: hidden;
  text-decoration: none;
}

.event-accent {
  width: 4px;
  background: var(--gradient-main);
  flex-shrink: 0;
}

.event-content {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
  flex: 1;
  flex-wrap: wrap;
}

.event-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 14px;
}

.meta-sep {
  color: var(--text-muted);
}

.dates {
  display: flex;
  align-items: center;
  gap: 6px;
}

.date {
  color: var(--text-secondary);
  font-size: 14px;
}

.arrow-icon {
  color: var(--accent-cyan);
}

.no-event p {
  color: var(--text-secondary);
  font-size: 16px;
}
</style>
