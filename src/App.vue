<script setup>
import TheNavbar from "./components/TheNavbar.vue";
</script>

<template>
  <div class="TheNavbar">
    <TheNavbar />
  </div>
  <router-view />
</template>

<style scoped>
.TheNavbar {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
}
</style>
