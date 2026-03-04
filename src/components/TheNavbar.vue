<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import TheSearchDropdown from "./TheSearchDropdown.vue";

const searchOpen = ref(false);
const router = useRouter();

router.afterEach(() => {
  searchOpen.value = false;
});
</script>
<template>
  <div class="nav">
    <RouterLink to="/home" class="logo-link">
      <div class="logo">
        <div class="logo-sbl"></div>
        <div class="logo-text">
          <p>Splatoon Baguette League</p>
        </div>
      </div>
    </RouterLink>
    <div class="links">
      <RouterLink to="/home">Home</RouterLink>
      <RouterLink to="/seasons">saisons</RouterLink>
      <RouterLink to="/events">évènements</RouterLink>
      <RouterLink to="/teams">équipes</RouterLink>
    </div>
    <div class="nav-right">
      <div class="search-wrapper">
        <button
          class="search-btn"
          :class="{ active: searchOpen }"
          aria-label="Rechercher"
          @click="searchOpen = !searchOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        <TheSearchDropdown v-if="searchOpen" @close="searchOpen = false" />
      </div>
      <div class="socials">
        <a href="https://discord.gg/SJgnEYQwcV">
          <div class="discord-logo"></div>
        </a>
        <a href="https://x.com/sbaguetteleague">
          <div class="x-logo"></div>
        </a>
      </div>
    </div>
  </div>
</template>
<style scoped>
.nav {
  display: flex;
  width: 100%;
  height: 64px;
  justify-content: space-between;
  align-items: center;
  background: rgba(8, 8, 15, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0 24px;
}

/* Bordure dégradée en bas */
.nav::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--accent-violet), var(--accent-cyan));
}

.logo-link {
  text-decoration: none;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-sbl {
  width: 44px;
  height: 44px;
  background: url(/img/sbl-logo.png) center / cover no-repeat;
  flex-shrink: 0;
}

.logo-text p {
  font-size: 15px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.3;
}

.links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.links a {
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  padding: 4px 0;
  position: relative;
  transition: color 0.2s;
}

.links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent-cyan);
  transition: width 0.2s;
}

.links a:hover {
  color: var(--text-primary);
}

.links a:hover::after {
  width: 100%;
}

.links a.router-link-active {
  color: var(--text-primary);
}

.links a.router-link-active::after {
  width: 100%;
  background: var(--accent-violet);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-wrapper {
  position: relative;
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.search-btn:hover,
.search-btn.active {
  background: rgba(124, 58, 237, 0.15);
  border-color: var(--accent-violet);
  color: var(--text-primary);
}

.socials {
  display: flex;
  align-items: center;
  gap: 16px;
}

.socials a {
  opacity: 0.7;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
}

.socials a:hover {
  opacity: 1;
}

.discord-logo {
  width: 26px;
  height: 20px;
  background: url(/img/discord-logo.png) center / cover no-repeat;
}

.x-logo {
  width: 20px;
  height: 20px;
  background: url(/img/x-logo.png) center / cover no-repeat;
}
</style>
