<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useMatchProposalStore } from "@/stores/matchProposal";

const auth = useAuthStore();
const store = useMatchProposalStore();

const games = ref([]);
const gameId = ref("");
const date = ref("");
const loading = ref(false);
const error = ref("");
const info = ref("");

const canSubmit = computed(() => gameId.value && date.value && !loading.value);

function formatDate(value) {
  if (!value) return "—";
  return new Date(value.replace(" ", "T")).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function load() {
  error.value = "";
  try {
    await store.fetchPending();
    games.value = await store.fetchCaptainGames();
  } catch {
    error.value = "Impossible de charger les propositions.";
  }
}

async function submit() {
  error.value = "";
  info.value = "";
  loading.value = true;
  try {
    await store.propose(Number(gameId.value), date.value);
    info.value = "Proposition envoyée.";
    gameId.value = "";
    date.value = "";
    await store.fetchPending();
  } catch {
    error.value = "L'envoi de la proposition a échoué (êtes-vous capitaine de ce match ?).";
  } finally {
    loading.value = false;
  }
}

async function answer(action, id) {
  error.value = "";
  info.value = "";
  try {
    await store[action](id);
    info.value = action === "accept" ? "Proposition acceptée." : "Proposition refusée.";
  } catch {
    error.value = "L'action a échoué. Réessayez.";
  }
}

onMounted(() => {
  if (auth.isAuthenticated) load();
});
</script>

<template>
  <div class="page-wrapper">
    <p class="section-label">Propositions de match</p>

    <div v-if="!auth.isAuthenticated" class="glass-card notice">
      <p>Vous devez être connecté pour gérer vos propositions.</p>
    </div>

    <template v-else>
      <p v-if="error" class="error-message" role="alert">{{ error }}</p>
      <p v-if="info" class="info-message" role="status">{{ info }}</p>

      <form class="glass-card block" @submit.prevent="submit">
        <h2>Planifier un match</h2>
        <label class="field">
          <span>Match</span>
          <select v-model="gameId" required>
            <option value="" disabled>Choisir un match</option>
            <option v-for="g in games" :key="g.id" :value="g.id">
              S{{ g.week }} — {{ g.team1 }} vs {{ g.team2 }}
            </option>
          </select>
        </label>
        <label class="field">
          <span>Date et heure</span>
          <input v-model="date" type="datetime-local" required />
        </label>
        <button type="submit" class="btn" :disabled="!canSubmit">Proposer</button>
      </form>

      <section class="glass-card block" aria-labelledby="received-title">
        <h2 id="received-title">Reçues</h2>
        <p v-if="!store.received.length">Aucune proposition en attente.</p>
        <ul v-else>
          <li v-for="p in store.received" :key="p.id" class="row">
            <span>
              {{ p.game?.team1 }} vs {{ p.game?.team2 }} — {{ formatDate(p.proposed_date) }}
              (de {{ p.proposer?.discord_username }})
            </span>
            <span class="actions">
              <button type="button" class="btn" @click="answer('accept', p.id)">Accepter</button>
              <button type="button" class="btn danger" @click="answer('refuse', p.id)">Refuser</button>
            </span>
          </li>
        </ul>
      </section>

      <section class="glass-card block" aria-labelledby="sent-title">
        <h2 id="sent-title">Envoyées</h2>
        <p v-if="!store.sent.length">Aucune proposition en attente.</p>
        <ul v-else>
          <li v-for="p in store.sent" :key="p.id" class="row">
            {{ p.game?.team1 }} vs {{ p.game?.team2 }} — {{ formatDate(p.proposed_date) }}
            (à {{ p.receiver?.discord_username }})
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.block, .notice { padding: 24px; max-width: 720px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: var(--text-secondary); }
.field select, .field input {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--text-primary);
}
ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.actions { display: flex; gap: 8px; }
.btn {
  background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
  color: #fff; border: none; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-weight: 600;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn.danger { background: #ef4444; }
.error-message { color: #ef4444; }
.info-message { color: #22c55e; }
</style>
