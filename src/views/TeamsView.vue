<script setup>
import { onBeforeMount } from "vue";
import { useTeamStore } from "@/stores/team";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

const teamStore = useTeamStore();
const { fetchAllTeams } = teamStore;
const { teams } = storeToRefs(teamStore);
const auth = useAuthStore();

onBeforeMount(() => {
  fetchAllTeams();
});
</script>
<template>
  <div class="page-wrapper">
    <div class="teams-header">
      <p class="section-label">Équipes</p>
      <RouterLink
        v-if="auth.isAuthenticated"
        class="btn-create"
        :to="{ name: 'team-create' }"
      >
        + Créer une équipe
      </RouterLink>
    </div>
    <div class="teams-grid">
      <RouterLink
        class="team-card glass-card"
        v-for="team in teams"
        :key="team.id"
        :to="{ name: 'team', params: { id: team.id } }"
      >
        <div class="team-avatar">
          <span>{{ (team.name ?? '??').substring(0, 2).toUpperCase() }}</span>
        </div>
        <p class="team-name">{{ team.name }}</p>
      </RouterLink>
    </div>
  </div>
</template>
<style scoped>
.teams-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  margin-bottom: 16px;
}

.btn-create {
  background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.btn-create:hover {
  opacity: 0.9;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  width: 100%;
}

.team-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 28px 16px 20px;
  text-decoration: none;
}

.team-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.team-avatar span {
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.team-name {
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 600;
  text-align: center;
}
</style>
