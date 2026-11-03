<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { useTeamStore } from "@/stores/team";

const teamStore = useTeamStore();

const myTeams = ref([]);
const membersByTeam = ref({});
const openTeamId = ref(null);
const loading = ref(true);
const error = ref("");
const newMember = ref("");

function messageFrom(e, fallback) {
  return e?.response?.status === 403
    ? "Action réservée aux capitaines."
    : fallback;
}

async function load() {
  loading.value = true;
  error.value = "";
  try {
    myTeams.value = await teamStore.fetchMyTeams();
  } catch {
    error.value = "Impossible de charger vos équipes.";
  } finally {
    loading.value = false;
  }
}

async function loadMembers(teamId) {
  const data = await teamStore.fetchMembers(teamId);
  membersByTeam.value = { ...membersByTeam.value, [teamId]: data.members };
}

async function toggle(teamId) {
  if (openTeamId.value === teamId) {
    openTeamId.value = null;
    return;
  }
  error.value = "";
  try {
    await loadMembers(teamId);
    openTeamId.value = teamId;
  } catch {
    error.value = "Impossible de charger les membres.";
  }
}

function isCaptain(teamId) {
  return myTeams.value.find((t) => t.team.id === teamId)?.role === "captain";
}

async function run(teamId, action, fallback) {
  error.value = "";
  try {
    await action();
    await loadMembers(teamId);
    await load();
  } catch (e) {
    const detail = e?.response ? await e.response.json().catch(() => null) : null;
    error.value = detail?.detail || messageFrom(e, fallback);
  }
}

async function add(teamId) {
  const id = newMember.value.trim();
  if (!id) return;
  await run(teamId, () => teamStore.addMember(teamId, id), "Ajout impossible.");
  newMember.value = "";
}

const remove = (teamId, m) =>
  run(teamId, () => teamStore.removeMember(teamId, m.discord_id), "Retrait impossible.");

const toggleRole = (teamId, m) =>
  run(
    teamId,
    () => teamStore.changeRole(teamId, m.discord_id, m.role === "captain" ? "member" : "captain"),
    "Changement de rôle impossible."
  );

async function leave(teamId) {
  if (!window.confirm("Quitter cette équipe ?")) return;
  error.value = "";
  try {
    await teamStore.leaveTeam(teamId);
    openTeamId.value = null;
    await load();
  } catch (e) {
    const detail = e?.response ? await e.response.json().catch(() => null) : null;
    error.value = detail?.detail || "Impossible de quitter l'équipe.";
  }
}

onMounted(load);
</script>

<template>
  <div class="page-wrapper">
    <p class="section-label">Mes équipes</p>
    <p v-if="error" class="error-msg" role="alert">{{ error }}</p>
    <p v-if="loading" class="empty-msg">Chargement…</p>
    <p v-else-if="myTeams.length === 0" class="empty-msg">
      Vous n'appartenez à aucune équipe.
      <RouterLink :to="{ name: 'team-create' }">Créer une équipe</RouterLink>
    </p>

    <div v-for="t in myTeams" :key="t.team.id" class="glass-card team-card">
      <div class="team-head">
        <RouterLink :to="{ name: 'team', params: { id: t.team.id } }" class="team-name">
          {{ t.team.name }}
        </RouterLink>
        <span class="role">{{ t.role === "captain" ? "👑 Capitaine" : "Membre" }}</span>
        <span class="count">{{ t.members_count }} membre(s)</span>
        <button type="button" @click="toggle(t.team.id)" :aria-expanded="openTeamId === t.team.id">
          Membres
        </button>
        <button type="button" class="danger" @click="leave(t.team.id)">Quitter</button>
      </div>

      <div v-if="openTeamId === t.team.id" class="members">
        <ul>
          <li v-for="m in membersByTeam[t.team.id] || []" :key="m.discord_id">
            <span>{{ m.role === "captain" ? "👑" : "👤" }} {{ m.discord_username }}</span>
            <template v-if="isCaptain(t.team.id)">
              <button type="button" @click="toggleRole(t.team.id, m)">
                {{ m.role === "captain" ? "Rétrograder" : "Promouvoir capitaine" }}
              </button>
              <button type="button" class="danger" @click="remove(t.team.id, m)">Retirer</button>
            </template>
          </li>
        </ul>
        <form v-if="isCaptain(t.team.id)" class="add" @submit.prevent="add(t.team.id)">
          <label>
            ID Discord du nouveau membre
            <input v-model="newMember" inputmode="numeric" />
          </label>
          <button type="submit">Ajouter</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-card { padding: 16px 20px; width: 100%; }
.team-head, li, .add { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.team-name { font-weight: 800; font-size: 18px; }
.members ul { list-style: none; padding: 0; margin: 12px 0; display: grid; gap: 8px; }
.danger { color: #ef4444; }
.error-msg { color: #ef4444; }
</style>
