<script setup>
import { ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRegistrationStore } from "@/stores/registration";

const props = defineProps({ season: { type: Object, required: true } });

const auth = useAuthStore();
const registrationStore = useRegistrationStore();

const teams = ref([]);
const teamId = ref("");
const submitting = ref(false);
const message = ref("");
const error = ref("");

const ERRORS = {
  400: "Inscription impossible : période fermée ou équipe incomplète.",
  403: "Seul le capitaine peut inscrire l'équipe.",
  409: "Cette équipe est déjà inscrite à cette saison.",
};

watch(
  () => [props.season.id, props.season.registration_open, auth.isAuthenticated],
  async ([id, open, logged]) => {
    teams.value = [];
    if (!id || !open || !logged) return;
    try {
      teams.value = await registrationStore.fetchCaptainTeams();
      teamId.value = teams.value[0]?.id ?? "";
    } catch {
      teams.value = [];
    }
  },
  { immediate: true },
);

async function submit() {
  error.value = "";
  message.value = "";
  submitting.value = true;
  try {
    await registrationStore.registerTeamToSeason(props.season.id, Number(teamId.value));
    message.value = "Inscription envoyée, en attente de validation par un admin.";
  } catch (e) {
    error.value = ERRORS[e?.response?.status] ?? "L'inscription a échoué.";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div v-if="season.registration_open && teams.length" class="glass-card registration">
    <p class="section-label">Inscrire mon équipe</p>
    <form class="registration-form" @submit.prevent="submit">
      <label for="registration-team">Équipe</label>
      <select id="registration-team" v-model="teamId">
        <option v-for="t in teams" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>
      <button type="submit" :disabled="submitting || !teamId">S'inscrire</button>
    </form>
    <p v-if="message" role="status">{{ message }}</p>
    <p v-if="error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.registration {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  width: 100%;
}
.registration-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
</style>
