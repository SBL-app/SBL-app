<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { usePlayerStore } from "@/stores/player";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

const playerStore = usePlayerStore();
const { fetchAllPlayers } = playerStore;
const { players } = storeToRefs(playerStore);

const query = ref("");
const error = ref(false);

const filteredPlayers = computed(() => {
  const q = query.value.trim().toLowerCase();
  const sorted = [...players.value].sort((a, b) =>
    (a.name ?? "").localeCompare(b.name ?? "", "fr", { sensitivity: "base" })
  );
  if (!q) return sorted;
  return sorted.filter(
    (p) =>
      (p.name ?? "").toLowerCase().includes(q) ||
      (p.team_name ?? "").toLowerCase().includes(q)
  );
});

onBeforeMount(async () => {
  try {
    await fetchAllPlayers();
  } catch (e) {
    console.error("Erreur lors du chargement des joueurs:", e);
    error.value = true;
  }
});
</script>
<template>
  <div class="page-wrapper">
    <p class="section-label">Joueurs</p>
    <label class="players-search">
      <span class="sr-only">Rechercher un joueur ou une équipe</span>
      <input
        v-model="query"
        type="search"
        placeholder="Rechercher un joueur ou une équipe"
      />
    </label>
    <p v-if="error" class="players-empty" role="alert">
      Impossible de charger les joueurs.
    </p>
    <p v-else-if="filteredPlayers.length === 0" class="players-empty">
      Aucun joueur trouvé.
    </p>
    <div class="players-grid" v-else>
      <RouterLink
        class="player-card glass-card"
        v-for="player in filteredPlayers"
        :key="player.id"
        :to="{ name: 'player', params: { id: player.id } }"
      >
        <div class="player-avatar">
          <span>{{ (player.name ?? '??').substring(0, 2).toUpperCase() }}</span>
        </div>
        <p class="player-name" :title="player.name">{{ player.name }}</p>
        <p class="player-team" v-if="player.team_name">{{ player.team_name }}</p>
      </RouterLink>
    </div>
  </div>
</template>
<style scoped>
.players-search {
  display: block;
  width: 100%;
  margin-bottom: 16px;
}

.players-search input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.15));
  background: transparent;
  color: var(--text-primary);
  font-size: 14px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.players-empty {
  color: var(--text-primary);
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  width: 100%;
}

.player-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px 16px 18px;
  text-decoration: none;
}

.player-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.player-avatar span {
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.player-name {
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 600;
  text-align: center;
}

.player-team {
  color: var(--text-secondary, var(--text-primary));
  font-size: 13px;
  text-align: center;
}

@media (max-width: 600px) {
  .players-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .player-name,
  .player-team {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
