<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import TheNavbar from "./components/TheNavbar.vue";

const auth = useAuthStore();

onMounted(() => {
  // Charger la session existante depuis localStorage
  auth.loadFromStorage();

  // Détecter le callback OAuth Discord
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const userBase64 = params.get("user");

  if (token && userBase64) {
    auth.initFromCallback(token, userBase64);
    // Nettoyer l'URL sans recharger la page
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
});
</script>

<template>
  <TheNavbar />
  <router-view />
</template>
