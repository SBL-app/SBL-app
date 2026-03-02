<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <div class="nav">
    <RouterLink to="/home">
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
    <div class="socials">
      <a href="https://discord.gg/SJgnEYQwcV"> <!-- TODO : check the link -->
        <div class="discord-logo"></div>
      </a>
      <a href="https://x.com/sbaguetteleague">
        <div class="x-logo"></div>
      </a>
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
  position: relative;
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

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
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
