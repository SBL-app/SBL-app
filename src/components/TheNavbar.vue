<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { API_URL } from "../../API_URL";
import TheSearchDropdown from "./TheSearchDropdown.vue";
import TheUserMenu from "./TheUserMenu.vue";

const searchOpen = ref(false);
const menuOpen = ref(false);
const router = useRouter();
const auth = useAuthStore();

// Recherche et menu mobile se referment à chaque changement de page.
router.afterEach(() => {
  searchOpen.value = false;
  menuOpen.value = false;
});

const discordLoginUrl = computed(() => {
  const redirectAfter = encodeURIComponent(window.location.origin);
  return `${API_URL}/auth/discord?redirect_after=${redirectAfter}`;
});
</script>

<template>
  <nav class="nav" aria-label="Navigation principale">
    <RouterLink to="/home" class="logo-link" aria-label="Accueil — Splatoon Baguette League">
      <div class="logo">
        <div class="logo-sbl" role="img" aria-label="Logo Splatoon Baguette League"></div>
        <div class="logo-text">
          <p>Splatoon Baguette League</p>
        </div>
      </div>
    </RouterLink>

    <div class="links" id="nav-links" :class="{ open: menuOpen }">
      <RouterLink to="/home">Home</RouterLink>
      <RouterLink to="/seasons">saisons</RouterLink>
      <RouterLink to="/events">évènements</RouterLink>
      <RouterLink to="/teams">équipes</RouterLink>
      <div class="socials socials-in-menu">
        <a href="https://discord.gg/SJgnEYQwcV" target="_blank" rel="noopener noreferrer" aria-label="Rejoindre le serveur Discord (nouvel onglet)">
          <div class="discord-logo" aria-hidden="true"></div>
        </a>
        <a href="https://x.com/sbaguetteleague" target="_blank" rel="noopener noreferrer" aria-label="Suivre la ligue sur X (nouvel onglet)">
          <div class="x-logo" aria-hidden="true"></div>
        </a>
      </div>
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
      <div class="nav-auth">
        <TheUserMenu v-if="auth.isAuthenticated" />
        <a v-else :href="discordLoginUrl" class="login-btn">
          <div class="discord-logo-sm"></div>
          Se connecter
        </a>
      </div>
      <div class="socials socials-desktop">
        <a href="https://discord.gg/SJgnEYQwcV" target="_blank" rel="noopener noreferrer" aria-label="Rejoindre le serveur Discord (nouvel onglet)">
          <div class="discord-logo" aria-hidden="true"></div>
        </a>
        <a href="https://x.com/sbaguetteleague" target="_blank" rel="noopener noreferrer" aria-label="Suivre la ligue sur X (nouvel onglet)">
          <div class="x-logo" aria-hidden="true"></div>
        </a>
      </div>
      <button
        type="button"
        class="burger"
        :aria-expanded="menuOpen"
        aria-controls="nav-links"
        :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        @click="menuOpen = !menuOpen"
      >
        <span class="burger-bar" :class="{ open: menuOpen }"></span>
        <span class="burger-bar" :class="{ open: menuOpen }"></span>
        <span class="burger-bar" :class="{ open: menuOpen }"></span>
      </button>
    </div>
  </nav>
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

.nav-auth {
  display: flex;
  align-items: center;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(88, 101, 242, 0.15);
  border: 1px solid rgba(88, 101, 242, 0.4);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.login-btn:hover {
  background: rgba(88, 101, 242, 0.3);
  border-color: #5865f2;
}

.discord-logo-sm {
  width: 18px;
  height: 14px;
  background: url(/img/discord-logo.png) center / cover no-repeat;
  flex-shrink: 0;
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

/* Les socials du menu déroulant n'apparaissent qu'en mobile. */
.socials-in-menu {
  display: none;
}

/* Bouton hamburger : masqué sur grand écran. */
.burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 9px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 8px;
  cursor: pointer;
}

.burger-bar {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text-secondary);
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.burger-bar.open:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.burger-bar.open:nth-child(2) {
  opacity: 0;
}

.burger-bar.open:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.burger:focus-visible,
.search-btn:focus-visible,
.links a:focus-visible {
  outline: 2px solid var(--accent-cyan);
  outline-offset: 2px;
}

@media (max-width: 900px) {
  .burger {
    display: flex;
  }

  .socials-desktop {
    display: none;
  }

  /* Le logo peut rétrécir pour laisser la place à la recherche + hamburger. */
  .logo-link {
    min-width: 0;
    flex-shrink: 1;
  }

  .logo-text p {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Panneau déroulant plein largeur sous la barre, plutôt que des liens qui
     débordent horizontalement. */
  .links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 12px 24px 20px;
    background: rgba(8, 8, 15, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-card);
  }

  .links.open {
    display: flex;
  }

  .links a {
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
  }

  .socials-in-menu {
    display: flex;
    padding-top: 12px;
  }
}
</style>
