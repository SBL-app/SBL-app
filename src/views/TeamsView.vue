<script setup>
import { onBeforeMount } from "vue";
import { useTeamStore } from "@/stores/team";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

const teamStore = useTeamStore();
const { fetchAllTeams } = teamStore;
const { teams } = storeToRefs(teamStore);

onBeforeMount(() => {
  fetchAllTeams();
});
</script>
<template>
  <div class="page-wrapper">
    <p class="section-label">Équipes</p>
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
