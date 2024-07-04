<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <div class="season-container">
    <p class="title">Saisons :</p>
    <div class="seasons">
      <router-link to="/seasons/1" class="season-item">
        <p class="item-title">Saison 1</p>
        <div class="progressbar"></div>
        <p class="item-status">Terminé</p>
      </router-link>
      <router-link to="/seasons/2" class="season-item">
        <p class="item-title">Saison 2</p>
        <div class="progressbar"></div>
        <p class="item-status">Terminé</p>
      </router-link>
      <router-link to="/seasons/3" class="season-item">
        <p class="item-title">Saison 2</p>
        <div class="progressbar"></div>
        <p class="item-status">Terminé</p>
      </router-link>
    </div>
  </div>
</template>
<style scoped>
.season-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
}

.seasons {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
}

.season-item {
  display: flex;
  padding: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  border-radius: 8px;
  background: var(--embed-color-1, #5c47e0);
}

.title {
  text-decoration-line: underline;
}

p {
  color: #fff;
  text-align: center;
  font-family: Lexend;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.progressbar {
  width: 160px;
  height: 9px;
  border-radius: 99px;
  background: #04d200;
}
</style>
