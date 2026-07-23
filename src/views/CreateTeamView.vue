<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useTeamStore } from "@/stores/team";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const teamStore = useTeamStore();
const auth = useAuthStore();

const name = ref("");
const players = ref([{ name: "", discord: "" }]);
const submitting = ref(false);
const error = ref("");

const nameValid = computed(() => {
  const n = name.value.trim();
  return n.length >= 2 && n.length <= 50;
});

function addPlayerRow() {
  players.value.push({ name: "", discord: "" });
}

function removePlayerRow(index) {
  players.value.splice(index, 1);
}

async function submit() {
  error.value = "";
  if (!nameValid.value) {
    error.value = "Le nom de l'équipe doit contenir entre 2 et 50 caractères.";
    return;
  }

  submitting.value = true;
  try {
    const team = await teamStore.createTeam(name.value.trim());

    // Ajout des joueurs renseignés (nom non vide).
    const filled = players.value.filter((p) => p.name.trim().length > 0);
    for (const p of filled) {
      try {
        await teamStore.addPlayer(team.id, {
          name: p.name.trim(),
          discord: p.discord.trim(),
        });
      } catch {
        // On n'échoue pas toute la création si un joueur ne passe pas.
        error.value = "Équipe créée, mais certains joueurs n'ont pas pu être ajoutés.";
      }
    }

    router.push({ name: "team", params: { id: team.id } });
  } catch (e) {
    error.value =
      "La création de l'équipe a échoué. Vérifiez que vous êtes connecté.";
    console.error(e);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="page-wrapper">
    <p class="section-label">Créer une équipe</p>

    <div v-if="!auth.isAuthenticated" class="glass-card notice">
      <p>Vous devez être connecté pour créer une équipe.</p>
    </div>

    <form v-else class="glass-card create-form" @submit.prevent="submit">
      <label class="field">
        <span class="field-label">Nom de l'équipe</span>
        <input
          v-model="name"
          type="text"
          maxlength="50"
          placeholder="Nom de l'équipe"
          class="text-input"
          required
        />
      </label>

      <div class="players-section">
        <div class="players-header">
          <span class="field-label">Joueurs (optionnel)</span>
          <button type="button" class="btn-secondary" @click="addPlayerRow">
            + Ajouter un joueur
          </button>
        </div>

        <div
          v-for="(player, index) in players"
          :key="index"
          class="player-row"
        >
          <input
            v-model="player.name"
            type="text"
            maxlength="50"
            placeholder="Nom du joueur"
            class="text-input"
          />
          <input
            v-model="player.discord"
            type="text"
            placeholder="Discord (optionnel)"
            class="text-input"
          />
          <button
            v-if="players.length > 1"
            type="button"
            class="btn-remove"
            aria-label="Retirer ce joueur"
            @click="removePlayerRow(index)"
          >
            ×
          </button>
        </div>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>

      <div class="actions">
        <button
          type="submit"
          class="btn-primary"
          :disabled="submitting || !nameValid"
        >
          {{ submitting ? "Création…" : "Créer l'équipe" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.create-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px;
  max-width: 620px;
}

.notice {
  padding: 24px;
  max-width: 620px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.text-input {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--text-primary);
  font-size: 14px;
  width: 100%;
  transition: border-color 0.2s;
}

.text-input:focus {
  outline: none;
  border-color: var(--accent-violet);
}

.players-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.players-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.player-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  align-items: center;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(124, 58, 237, 0.15);
  color: var(--text-primary);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: rgba(124, 58, 237, 0.25);
}

.btn-remove {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  padding: 0 6px;
}

.btn-remove:hover {
  color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
