<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { API_URL } from "../../API_URL";
import TheSearchDropdown from "./TheSearchDropdown.vue";
import TheUserMenu from "./TheUserMenu.vue";
import { usePushNotifications } from "@/composables/usePushNotifications";

// `useRoute()` est indéfini si le composant est monté hors routeur (tests unitaires).
const route = useRoute();
const isMenuOpen = ref(false);
const searchOpen = ref(false);
const auth = useAuthStore();

// Le menu mobile et la recherche se referment dès qu'on change de page.
watch(
  () => route?.fullPath,
  () => {
    isMenuOpen.value = false;
    searchOpen.value = false;
  }
);

const discordLoginUrl = computed(() => {
  const redirectAfter = encodeURIComponent(window.location.origin);
  return `${API_URL}/auth/discord?redirect_after=${redirectAfter}`;
});

const {
  isSupported,
  permission,
  isSubscribed,
  isLoading,
  subscribe,
  unsubscribe,
  checkSubscriptionStatus,
} = usePushNotifications();

onMounted(() => {
  checkSubscriptionStatus();
});

function toggleNotifications() {
  if (isSubscribed.value) {
    unsubscribe();
  } else {
    subscribe();
  }
}
</script>
<template>
  <nav class="nav" aria-label="Navigation principale">
    <RouterLink to="/home" aria-label="Accueil — Splatoon Baguette League">
      <div class="logo">
        <div class="logo-sbl" role="img" aria-label="Logo Splatoon Baguette League"></div>
        <div class="logo-text">
          <p>Splatoon Baguette League</p>
        </div>
      </div>
    </RouterLink>

    <button
      type="button"
      class="burger"
      :aria-expanded="isMenuOpen"
      aria-controls="nav-links"
      :aria-label="isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
      @click="isMenuOpen = !isMenuOpen"
    >
      <span class="burger-bar" :class="{ open: isMenuOpen }" aria-hidden="true"></span>
      <span class="burger-bar" :class="{ open: isMenuOpen }" aria-hidden="true"></span>
      <span class="burger-bar" :class="{ open: isMenuOpen }" aria-hidden="true"></span>
    </button>

    <div id="nav-links" class="links" :class="{ open: isMenuOpen }">
      <RouterLink to="/home">Accueil</RouterLink>
      <RouterLink to="/seasons">Saisons</RouterLink>
      <RouterLink to="/events">Évènements</RouterLink>
      <RouterLink to="/teams">Équipes</RouterLink>
      <div class="socials">
        <a
          href="https://discord.gg/SJgnEYQwcV"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rejoindre le serveur Discord (nouvel onglet)"
        >
          <div class="discord-logo" aria-hidden="true"></div>
        </a>
        <a
          href="https://x.com/sbaguetteleague"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Suivre la ligue sur X (nouvel onglet)"
        >
          <div class="x-logo" aria-hidden="true"></div>
        </a>
      </div>

      <div class="nav-actions">
        <div class="search-wrapper">
          <button
            type="button"
            class="search-btn"
            :class="{ active: searchOpen }"
            aria-label="Rechercher"
            :aria-expanded="searchOpen"
            @click="searchOpen = !searchOpen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <TheSearchDropdown v-if="searchOpen" @close="searchOpen = false" />
        </div>

        <button
          v-if="isSupported && permission !== 'denied'"
          type="button"
          class="notif-btn"
          :class="{ active: isSubscribed, loading: isLoading }"
          :aria-label="isSubscribed ? 'Désactiver les notifications' : 'Activer les notifications'"
          :disabled="isLoading"
          @click="toggleNotifications"
        >
          <svg v-if="!isSubscribed" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <div class="nav-auth">
          <TheUserMenu v-if="auth.isAuthenticated" />
          <a v-else :href="discordLoginUrl" class="login-btn">
            <div class="discord-logo-sm" aria-hidden="true"></div>
            Se connecter
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>
<style scoped>
.nav {
  display: flex;
  width: 100%;
  min-height: 80px;
  padding: 0 16px 0 0;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  border-bottom: 2px solid #fff;
  background: linear-gradient(90deg, #2a1c59 0%, #130a2d 50%, #281a54 100%);
}

/* Annule le `padding: 3px` global sur les liens, qui gonflait la hauteur de la barre. */
.nav > a {
  padding: 0;
  display: flex;
}

.logo {
  display: flex;
  align-items: center;
  min-width: 0;
}

.logo-sbl {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  background: url(img/sbl-logo.png) center / cover no-repeat;
}

.logo-text {
  display: flex;
  align-items: center;
  min-width: 0;
}

.links {
  display: flex;
  align-items: center;
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

/* Groupe des contrôles à droite : recherche, notifications, connexion. */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-wrapper {
  position: relative;
  display: flex;
}

.search-btn,
.notif-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.search-btn:hover,
.search-btn.active,
.notif-btn:hover,
.notif-btn.active {
  background: rgba(255, 255, 255, 0.18);
  border-color: #fff;
}

.notif-btn:disabled,
.notif-btn.loading {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-auth {
  display: flex;
  align-items: center;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(88, 101, 242, 0.25);
  border: 1px solid rgba(88, 101, 242, 0.6);
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s, border-color 0.2s;
}

.login-btn:hover {
  background: rgba(88, 101, 242, 0.45);
  border-color: #5865f2;
}

.discord-logo-sm {
  width: 20px;
  height: 15px;
  flex-shrink: 0;
  background: url(img/discord-logo.png) center / cover no-repeat;
}

/* Bouton hamburger : masqué sur grand écran, seul point d'entrée du menu en mobile. */
.burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
}

.burger-bar {
  display: block;
  width: 100%;
  height: 2px;
  background: #fff;
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
.links a:focus-visible,
.search-btn:focus-visible,
.notif-btn:focus-visible,
.login-btn:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

@media (max-width: 900px) {
  .nav {
    min-height: 64px;
    flex-wrap: wrap;
  }

  /* Le bloc logo peut rétrécir pour que le hamburger reste sur la même ligne,
     même sur un écran de 320 px. */
  .nav > a {
    flex: 1;
    min-width: 0;
  }

  .logo-sbl {
    width: 56px;
    height: 56px;
  }

  .logo-text p {
    font-size: 16px;
  }

  .burger {
    flex-shrink: 0;
  }

  /* Le panneau occupe systématiquement sa propre ligne. */
  .links {
    flex-basis: 100%;
  }

  /* Le padding passe de la barre au bouton et au panneau, pour que le menu
     déroulant garde une marge identique à gauche et à droite. */
  .nav {
    padding-right: 0;
  }

  .burger {
    display: flex;
    margin-right: 16px;
  }

  /* Panneau déroulant : occupe toute la largeur sous la barre plutôt que de
     déborder horizontalement. */
  .links {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 8px 16px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
  }

  .links.open {
    display: flex;
  }

  .links a {
    width: 100%;
    padding: 10px 4px;
  }

  .socials {
    padding-top: 8px;
  }

  .socials a {
    width: auto;
  }

  /* Les contrôles (recherche / notif / connexion) passent en ligne dédiée,
     alignés à gauche comme les liens du menu. */
  .nav-actions {
    width: 100%;
    padding-top: 8px;
    flex-wrap: wrap;
  }

  .login-btn {
    width: auto;
  }
}
</style>
