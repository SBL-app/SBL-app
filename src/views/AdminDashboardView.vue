<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useAdminDashboardStore } from "@/stores/adminDashboard";

const auth = useAuthStore();
const store = useAdminDashboardStore();
const { data, loading, error } = storeToRefs(store);
const actionError = ref("");

const items = computed(() => data.value?.items ?? {});
const progress = computed(() => data.value?.division_progress ?? []);

const match = (g) => `${g.team1?.name ?? "?"} vs ${g.team2?.name ?? "?"}`;

async function run(fn, id) {
  actionError.value = "";
  try {
    await fn(id);
  } catch {
    actionError.value = "L'action a échoué. Réessayez.";
  }
}

onMounted(() => store.fetchDashboard());
</script>
<template>
  <div class="page-wrapper">
    <p v-if="loading && !data" aria-live="polite">Chargement…</p>
    <p v-if="error" role="alert">{{ error }}</p>
    <p v-if="actionError" role="alert">{{ actionError }}</p>

    <template v-if="data">
      <div class="section">
        <p class="section-label">Matchs en attente de résultat ({{ data.pending_results.total }})</p>
        <p v-if="!items.pending_results?.length" data-test="empty">Aucun match en attente.</p>
        <ul v-else class="glass-card list">
          <li v-for="g in items.pending_results" :key="g.id">
            {{ match(g) }} — {{ g.division_name }}
            <button v-if="auth.isAdmin" type="button" data-test="action" :data-action="`remind-${g.id}`" @click="run(store.remind, g.id)">Relancer</button>
          </li>
        </ul>
      </div>

      <div class="section">
        <p class="section-label">Résultats contestés ({{ data.contested_results.total }})</p>
        <p v-if="!items.contested_results?.length" data-test="empty">Aucun résultat contesté.</p>
        <ul v-else class="glass-card list">
          <li v-for="r in items.contested_results" :key="r.id">
            {{ r.team?.name }} : {{ r.score1 }}-{{ r.score2 }} — {{ r.division_name }}
            <em v-if="r.contest_reason">({{ r.contest_reason }})</em>
            <button v-if="auth.isAdmin" type="button" data-test="action" :data-action="`validate-${r.game_id}`" @click="run(store.validateResult, r.game_id)">Valider</button>
          </li>
        </ul>
      </div>

      <div class="section">
        <p class="section-label">Matchs à reprogrammer ({{ data.reported_games.total }})</p>
        <p v-if="!items.reported_games?.length" data-test="empty">Aucun match à reprogrammer.</p>
        <ul v-else class="glass-card list">
          <li v-for="g in items.reported_games" :key="g.id">{{ match(g) }} — {{ g.division_name }}</li>
        </ul>
      </div>

      <div class="section">
        <p class="section-label">Inscriptions en attente ({{ data.pending_registrations.total }})</p>
        <p v-if="!items.pending_registrations?.length" data-test="empty">Aucune inscription en attente.</p>
        <ul v-else class="glass-card list">
          <li v-for="r in items.pending_registrations" :key="r.id">{{ r.team?.name }} — {{ r.season_name }}</li>
        </ul>
      </div>

      <div class="section">
        <p class="section-label">Avancement par division</p>
        <p v-if="!progress.length" data-test="empty">Aucune division.</p>
        <ul v-else class="glass-card list">
          <li v-for="d in progress" :key="d.division_id">
            {{ d.division_name }} : {{ d.played }} / {{ d.total }}
            <progress :value="d.played" :max="d.total || 1" />
            <button v-if="auth.isAdmin" type="button" data-test="action" :data-action="`close-${d.division_id}`" @click="run(store.closeDivision, d.division_id)">Clôturer</button>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
<style scoped>
.list { list-style: none; margin: 0; padding: 1rem 1.25rem; display: grid; gap: 0.5rem; }
</style>
