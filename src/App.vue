<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import TheNavbar from "./components/TheNavbar.vue";

const auth = useAuthStore();

onMounted(() => {
  // Détecter le callback OAuth Discord en priorité
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const userBase64 = params.get("user");

  if (token && userBase64) {
    auth.initFromCallback(token, userBase64);
    // Nettoyer l'URL sans recharger la page
    window.history.replaceState({}, document.title, window.location.pathname);
  } else {
    // Charger la session existante depuis localStorage uniquement si pas de callback
    auth.loadFromStorage();
  }
});
</script>

<template>
  <TheNavbar />
  <router-view />
</template>
