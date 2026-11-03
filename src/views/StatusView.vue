<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useApiStatusStore } from "@/stores/apiStatus";
import { API_URL } from "../../API_URL";

const store = useApiStatusStore();
const { loading, online, httpStatus, responseTime, info, error, checkedAt } = storeToRefs(store);

// Infos de l'application (équivalent /serverinfo côté web).
const appInfo = {
  mode: import.meta.env.MODE,
  origin: window.location.origin,
  apiUrl: API_URL,
};

onMounted(() => store.checkStatus());
</script>
<template>
  <div class="page-wrapper">
    <div class="section">
      <p class="section-label">État de l'API SBL</p>
      <div class="glass-card status-card" aria-live="polite">
        <p v-if="loading">Vérification en cours…</p>
        <template v-else-if="online !== null">
          <p class="status" :class="online ? 'ok' : 'ko'">{{ online ? "✅ En ligne" : "❌ Hors ligne" }}</p>
          <p v-if="httpStatus">Code de réponse : {{ httpStatus }}</p>
          <p v-if="responseTime !== null">Temps de réponse : {{ responseTime }} ms</p>
          <p v-if="error">Erreur : {{ error }}</p>
          <p v-if="info?.name">Nom : {{ info.name }}</p>
          <p v-if="info?.version">Version : {{ info.version }}</p>
          <p v-if="info?.status">Statut : {{ info.status }}</p>
          <p v-if="checkedAt">Dernière vérification : {{ checkedAt.toLocaleTimeString("fr-FR") }}</p>
        </template>
        <button type="button" :disabled="loading" @click="store.checkStatus()">Revérifier</button>
      </div>
    </div>
    <div class="section">
      <p class="section-label">Informations</p>
      <div class="glass-card status-card">
        <p>URL de l'API : {{ appInfo.apiUrl }}</p>
        <p>Application : {{ appInfo.origin }}</p>
        <p>Mode : {{ appInfo.mode }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.status-card { padding: 1rem 1.25rem; display: grid; gap: 0.35rem; }
.status { font-weight: 700; }
</style>
