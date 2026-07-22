<script setup>
import { ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";

// `useRoute()` est indéfini si le composant est monté hors routeur (tests unitaires).
const route = useRoute();
const isMenuOpen = ref(false);

// Le menu mobile se referme dès qu'on change de page.
watch(
  () => route?.fullPath,
  () => {
    isMenuOpen.value = false;
  }
);
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
.links a:focus-visible {
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
}
</style>
