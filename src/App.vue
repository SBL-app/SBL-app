<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import TheNavbar from "./components/TheNavbar.vue";
import InstallPrompt from "./components/InstallPrompt.vue";

const auth = useAuthStore();

onMounted(() => {
  // Détecter le callback OAuth Discord en priorité.
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const userBase64 = params.get("user");

  if (token && userBase64) {
    auth.initFromCallback(token, userBase64);
    // Nettoyer l'URL sans recharger la page.
    window.history.replaceState({}, document.title, window.location.pathname);
  } else {
    // Charger la session existante depuis localStorage uniquement si pas de callback.
    auth.loadFromStorage();
  }
});
</script>

<template>
  <a class="skip-link" href="#main-content">Aller au contenu principal</a>
  <header class="TheNavbar">
    <TheNavbar />
  </header>
  <main id="main-content" tabindex="-1">
    <router-view />
  </main>
  <InstallPrompt />
</template>

<style scoped>
.TheNavbar {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
}

/* `main` prend toute la largeur et centre lui-même son contenu : sans ça, il se
   réduisait à la largeur de son plus large enfant et débordait des deux côtés. */
main {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(32px, 5vw, 56px);
  padding: 0 16px clamp(32px, 6vw, 64px);
}

/* Lien d'évitement (RGAA 12.7 / OPQUAST) : visible uniquement au focus clavier. */
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 2000;
  padding: 8px 16px;
  background: #130a2d;
  color: #fff;
  border: 2px solid #fff;
}

.skip-link:focus {
  left: 8px;
  top: 8px;
}

#main-content:focus {
  outline: none;
}
</style>
