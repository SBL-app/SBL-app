<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import TheNavbar from "./components/TheNavbar.vue";
import InstallPrompt from "./components/InstallPrompt.vue";

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
  <a class="skip-link" href="#main-content">Aller au contenu principal</a>
  <header class="site-header">
    <TheNavbar />
  </header>
  <main id="main-content" tabindex="-1">
    <router-view />
  </main>
  <InstallPrompt />
</template>

<style scoped>
/* La navbar est déjà `position: sticky`; le header qui l'enveloppe doit l'être
   aussi, sinon le sticky serait borné à la hauteur du header (64px). */
.site-header {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
}

/* `#app` fournit le contexte flex (colonne, gap 64px). En interposant <main>
   entre #app et la vue, on recrée ce contexte pour ne pas casser l'espacement
   des sections de page. */
#main-content {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
}

#main-content:focus {
  outline: none;
}

/* Lien d'évitement (RGAA 12.7 / OPQUAST) : visible uniquement au focus clavier. */
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 2000;
  padding: 8px 16px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--accent-violet);
  border-radius: 8px;
}

.skip-link:focus {
  left: 8px;
  top: 8px;
}
</style>
