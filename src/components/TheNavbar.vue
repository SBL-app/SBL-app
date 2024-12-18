<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <div class="nav">
    <RouterLink to="home">
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
  height: 80px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #fff;
  background: linear-gradient(90deg, #2a1c59 0%, #130a2d 50%, #281a54 100%);
  position: sticky;
}

.logo {
  display: flex;
  align-items: center;
  justify-items: center;
}

.logo-sbl {
  width: 80px;
  height: 80px;
  display: flex;
  background: url(img/sbl-logo.png) center / cover no-repeat;
}

.logo-text {
  display: flex;
  align-items: center;
  justify-items: center;
}

.links {
  display: flex;
  align-items: flex-start;
  gap: 40px;
}

.active {
  text-decoration: underline;
}

.socials {
  display: flex;
  align-items: center;
  gap: 16px;
}

.discord-logo {
  width: 30px;
  height: 23px;
  background: url(img/discord-logo.png) center / cover no-repeat;
}

.x-logo {
  width: 36px;
  height: 36px;
  background: url(img/x-logo.png) center / cover no-repeat;
}

a,
p {
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-decoration: none;
}
</style>
