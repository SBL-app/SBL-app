<script setup>
import TheNavbar from "./components/TheNavbar.vue";
import InstallPrompt from './components/InstallPrompt.vue'
</script>

<template>
  <TheNavbar />
  <router-view />
  <InstallPrompt />
</template>

<style scoped>
</style>
