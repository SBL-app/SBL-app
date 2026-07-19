<script setup>
import TheNavbar from "./components/TheNavbar.vue";
</script>

<template>
  <a class="skip-link" href="#main-content">Aller au contenu principal</a>
  <header class="TheNavbar">
    <TheNavbar />
  </header>
  <main id="main-content" tabindex="-1">
    <router-view />
  </main>
</template>

<style scoped>
.TheNavbar {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
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
