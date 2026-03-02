# UI Refonte "Midnight Pro" — Plan d'implémentation

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refonte visuelle complète de l'interface SBL vers un style modern esport (glassmorphism, typographie Outfit bold, palette sombre #08080f + violet #7c3aed + cyan #0ea5e9).

**Architecture:** Mise à jour des fichiers CSS globaux pour établir les fondations (variables, typographie, layout), puis refonte composant par composant. Aucune modification de la logique métier ni des liens Discord/X ni du logo SBL.

**Tech Stack:** Vue 3, CSS scoped, Google Fonts (Outfit), Vite — pas de librairie CSS externe.

---

## Vérification avant de commencer

```bash
cd /home/alexandre/Documents/devlopement/sbl/SBL-app
npm run dev
# Vérifier que le serveur démarre sur http://localhost:5173
# Garder l'onglet ouvert pour valider visuellement chaque étape
```

---

### Task 1 : Fondations CSS globales

**Files:**
- Modify: `src/assets/base.css`
- Modify: `src/assets/main.css`

**Step 1 : Ajouter l'import de la police Outfit dans `index.html`**

Ouvrir `index.html` (racine du projet) et ajouter dans `<head>` avant les autres styles :

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet">
```

**Step 2 : Remplacer le contenu de `src/assets/base.css`**

```css
/* Variables SBL — Midnight Pro */
:root {
  --bg-primary: #08080f;
  --bg-secondary: #0f0a1e;
  --bg-card: rgba(255, 255, 255, 0.04);
  --bg-card-hover: rgba(255, 255, 255, 0.07);

  --accent-violet: #7c3aed;
  --accent-cyan: #0ea5e9;
  --accent-gold: #f59e0b;
  --accent-silver: #94a3b8;
  --accent-bronze: #cd7c2f;

  --gradient-main: linear-gradient(135deg, #7c3aed, #0ea5e9);
  --gradient-text: linear-gradient(135deg, #7c3aed, #0ea5e9);

  --border-card: rgba(124, 58, 237, 0.3);
  --border-card-hover: rgba(14, 165, 233, 0.5);

  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  --status-active: #22c55e;
  --status-done: #64748b;
  --status-scheduled: #f59e0b;
  --status-cancelled: #ef4444;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  font-weight: normal;
}

body {
  min-height: 100vh;
  color: var(--text-primary);
  background: var(--bg-primary);
  line-height: 1.6;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 15px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Step 3 : Remplacer le contenu de `src/assets/main.css`**

```css
@import "./base.css";

#app {
  display: flex;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  background:
    radial-gradient(ellipse at 50% -20%, rgba(124, 58, 237, 0.15) 0%, transparent 60%),
    var(--bg-primary);
  padding-bottom: 80px;
}

/* Liens globaux */
a {
  text-decoration: none;
  color: var(--text-primary);
  transition: color 0.2s;
  padding: 3px;
  font-size: 16px;
}

@media (hover: hover) {
  a:hover {
    color: var(--accent-cyan);
  }
}

/* Utilitaires globaux réutilisables */
.gradient-text {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-card);
  border-radius: 16px;
  transition: border-color 0.3s, transform 0.2s, background 0.3s;
}

.glass-card:hover {
  border-color: var(--border-card-hover);
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.page-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 700;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.active {
  background: rgba(34, 197, 94, 0.15);
  color: var(--status-active);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-badge.active::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--status-active);
  animation: pulse 1.5s infinite;
}

.status-badge.done {
  background: rgba(100, 116, 139, 0.15);
  color: var(--status-done);
  border: 1px solid rgba(100, 116, 139, 0.3);
}

.status-badge.scheduled {
  background: rgba(245, 158, 11, 0.15);
  color: var(--status-scheduled);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-badge.cancelled {
  background: rgba(239, 68, 68, 0.15);
  color: var(--status-cancelled);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.gradient-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, var(--accent-violet), transparent);
  border: none;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* Layout wrapper pour centrer le contenu des pages */
.page-wrapper {
  width: 100%;
  max-width: 1200px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
}
```

**Step 4 : Vérifier visuellement**

```bash
# Le serveur dev doit déjà tourner
# Ouvrir http://localhost:5173
# Vérifier : fond quasi-noir, police Outfit chargée, liens changent de couleur au hover
```

**Step 5 : Commit**

```bash
git add src/assets/base.css src/assets/main.css index.html
git commit -m "feat(ui): add Outfit font and CSS design system foundations"
```

---

### Task 2 : Navbar

**Files:**
- Modify: `src/components/TheNavbar.vue`

**Step 1 : Remplacer le style de TheNavbar.vue**

Remplacer tout le bloc `<style scoped>` par :

```css
.nav {
  display: flex;
  width: 100%;
  height: 64px;
  justify-content: space-between;
  align-items: center;
  background: rgba(8, 8, 15, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid transparent;
  background-clip: padding-box;
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
```

**Step 2 : Vérifier visuellement**

```
- Navbar avec fond semi-transparent et flou
- Bordure bas dégradée violet→cyan
- Nom "Splatoon Baguette League" avec dégradé
- Logo SBL inchangé
- Liens Discord/X inchangés, avec opacity au hover
- Liens nav avec underline animé
```

**Step 3 : Commit**

```bash
git add src/components/TheNavbar.vue
git commit -m "feat(ui): redesign navbar with glassmorphism and gradient border"
```

---

### Task 3 : Composant IncomingEvents

**Files:**
- Modify: `src/components/IncomingEvents.vue`

**Step 1 : Remplacer le template**

Remplacer le bloc `<template>` par :

```html
<template>
  <div class="event-container">
    <p class="section-label">Prochain évènement</p>
    <RouterLink
      v-if="lastSeason"
      :to="{ name: 'event', params: { id: lastSeason.id } }"
      class="event-card glass-card"
    >
      <div class="event-accent"></div>
      <div class="event-content">
        <p class="event-name">{{ lastSeason.name }}</p>
        <div class="event-meta">
          <span class="meta-item">{{ seasons.length }} équipes</span>
          <span class="meta-sep">·</span>
          <div class="dates">
            <span class="date">{{ lastSeason.start_date }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" class="arrow-icon">
              <path d="M10.7832 8.66675H2.6665V7.33342H10.7832L7.04984 3.60008L7.99984 2.66675L13.3332 8.00008L7.99984 13.3334L7.04984 12.4001L10.7832 8.66675Z" fill="currentColor"/>
            </svg>
            <span class="date">{{ lastSeason.end_date }}</span>
          </div>
        </div>
        <span
          class="status-badge"
          :class="lastSeason.percentage === 100 ? 'done' : 'active'"
        >
          {{ lastSeason.percentage === 100 ? 'terminé' : 'en cours' }}
        </span>
      </div>
    </RouterLink>
    <div v-else class="no-event">
      <p>Aucun évènement disponible</p>
    </div>
  </div>
</template>
```

**Step 2 : Remplacer le style scoped**

```css
.event-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 800px;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.event-card {
  display: flex;
  align-items: stretch;
  width: 100%;
  overflow: hidden;
  text-decoration: none;
}

.event-accent {
  width: 4px;
  background: var(--gradient-main);
  flex-shrink: 0;
}

.event-content {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
  flex: 1;
  flex-wrap: wrap;
}

.event-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 14px;
}

.meta-sep {
  color: var(--text-muted);
}

.dates {
  display: flex;
  align-items: center;
  gap: 6px;
}

.date {
  color: var(--text-secondary);
  font-size: 14px;
}

.arrow-icon {
  color: var(--accent-cyan);
}

.no-event p {
  color: var(--text-secondary);
  font-size: 16px;
}
```

**Step 3 : Vérifier visuellement**

```
- Carte événement avec barre gauche dégradée
- Badge de statut coloré (vert "en cours" ou gris "terminé")
- Dates avec flèche cyan
- Hover : légère élévation et bordure cyan
```

**Step 4 : Commit**

```bash
git add src/components/IncomingEvents.vue
git commit -m "feat(ui): redesign IncomingEvents with hero card and status badge"
```

---

### Task 4 : Composant TheSeasons

**Files:**
- Modify: `src/components/TheSeasons.vue`

**Step 1 : Remplacer le template**

```html
<template>
  <div class="season-container">
    <p class="section-label">Saisons</p>
    <div class="seasons" v-if="seasons.length > 0">
      <router-link
        :to="{ name: 'season', params: { id: season.id } }"
        class="season-card glass-card"
        v-for="season in seasons"
        :key="season.id"
      >
        <p class="season-name">{{ season.name }}</p>
        <div class="progress-wrapper">
          <div class="progress-track">
            <div class="progress-fill" :style="progressStyle(season.percentage)"></div>
          </div>
          <span class="progress-pct">{{ season.percentage }}%</span>
        </div>
        <span
          class="status-badge"
          :class="Number(season.percentage) === 100 ? 'done' : 'active'"
        >
          {{ Number(season.percentage) === 100 ? 'terminé' : 'en cours' }}
        </span>
      </router-link>
    </div>
    <p v-else class="empty-msg">Aucune saison en cours</p>
  </div>
</template>
```

**Step 2 : Remplacer le style scoped**

```css
.season-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.seasons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 900px;
}

.season-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 20px;
  text-decoration: none;
}

.season-name {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 700;
  text-align: center;
}

.progress-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.progress-pct {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.progress-track {
  width: 100%;
  height: 6px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--accent-violet), var(--accent-cyan));
  transition: width 0.4s ease;
}

.empty-msg {
  color: var(--text-secondary);
  font-size: 16px;
}
```

**Step 3 : Mettre à jour la fonction `progressStyle`**

La fonction ne retourne plus une couleur (gérée par CSS), seulement la largeur :

```js
function progressStyle(percentage) {
  return {
    width: percentage + "%",
  };
}
```

**Step 4 : Vérifier visuellement**

```
- Cartes glassmorphism en grid responsive
- Barre de progression dégradée violet→cyan
- Badge de statut
- Hover : élévation + bordure cyan
```

**Step 5 : Commit**

```bash
git add src/components/TheSeasons.vue
git commit -m "feat(ui): redesign TheSeasons with glass cards and gradient progress bar"
```

---

### Task 5 : Composant ThePresentation

**Files:**
- Modify: `src/components/ThePresentation.vue`

**Step 1 : Remplacer le template**

```html
<template>
  <div class="presentation-container">
    <div class="presentation-card">
      <p class="section-label">Qui sommes-nous ?</p>
      <p class="text">
        Créer en 2022, la Splatoon Baguette League se charge d'organiser des
        ligues sur Splatoon le plus souvent possible afin de soutenir la scène
        compétitive française présente sur le jeu. Depuis sa création la SBL à
        assurer {{ seasons.length - 1 }} saisons ainsi que différents tournois gravitant autour de ces
        saisons et prépare actuellement sa {{ seasons.length }} ème saison.
      </p>
    </div>
  </div>
</template>
```

**Step 2 : Remplacer le style scoped**

```css
.presentation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
}

.presentation-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px 32px;
  width: 100%;
  background: rgba(124, 58, 237, 0.06);
  border-left: 3px solid var(--accent-violet);
  border-radius: 0 12px 12px 0;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-violet);
}

.text {
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.8;
  max-width: 700px;
}
```

**Step 3 : Vérifier visuellement**

```
- Carte avec bordure gauche violette
- Fond légèrement violet
- Texte en gris-bleu lisible
```

**Step 4 : Commit**

```bash
git add src/components/ThePresentation.vue
git commit -m "feat(ui): redesign ThePresentation with accent card style"
```

---

### Task 6 : SeasonsView

**Files:**
- Modify: `src/views/SeasonsView.vue`

**Step 1 : Remplacer le template**

```html
<template>
  <div class="page-wrapper">
    <div class="section">
      <p class="section-label">Saison en cours</p>
      <div class="seasons-grid single" v-if="lastSeason">
        <router-link
          :to="{ name: 'season', params: { id: lastSeason.id } }"
          class="season-card glass-card featured"
        >
          <p class="season-name">{{ lastSeason.name }}</p>
          <div class="progress-wrapper">
            <div class="progress-track">
              <div class="progress-fill" :style="progressStyle(lastSeason.percentage)"></div>
            </div>
            <span class="progress-pct">{{ lastSeason.percentage }}%</span>
          </div>
          <span class="status-badge" :class="Number(lastSeason.percentage) === 100 ? 'done' : 'active'">
            {{ Number(lastSeason.percentage) === 100 ? "terminé" : "en cours" }}
          </span>
        </router-link>
      </div>
    </div>

    <hr class="gradient-divider" />

    <div class="section" v-if="oldSeasons.length > 0">
      <p class="section-label">Saisons précédentes</p>
      <div class="seasons-grid">
        <router-link
          v-for="season in oldSeasons"
          :key="season.id"
          :to="{ name: 'season', params: { id: season.id } }"
          class="season-card glass-card"
        >
          <p class="season-name">{{ season.name }}</p>
          <div class="progress-wrapper">
            <div class="progress-track">
              <div class="progress-fill" :style="progressStyle(season.percentage)"></div>
            </div>
            <span class="progress-pct">{{ season.percentage }}%</span>
          </div>
          <span class="status-badge done">terminé</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
```

**Step 2 : Remplacer le style scoped**

```css
.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.seasons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
}

.seasons-grid.single {
  max-width: 320px;
}

.season-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 20px;
  text-decoration: none;
}

.season-card.featured {
  border-color: rgba(124, 58, 237, 0.5);
}

.season-name {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 700;
  text-align: center;
}

.progress-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.progress-pct {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.progress-track {
  width: 100%;
  height: 6px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--accent-violet), var(--accent-cyan));
}

.gradient-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, var(--accent-violet), transparent);
  border: none;
}
```

**Step 3 : Mettre à jour `progressStyle` pour ne retourner que la largeur**

```js
function progressStyle(percentage) {
  return { width: percentage + "%" };
}
```

**Step 4 : Commit**

```bash
git add src/views/SeasonsView.vue
git commit -m "feat(ui): redesign SeasonsView with gradient divider and glass cards"
```

---

### Task 7 : EventsView

**Files:**
- Modify: `src/views/EventsView.vue`

**Step 1 : Remplacer le template**

```html
<template>
  <div class="page-wrapper">
    <IncomingEvents />
    <hr class="gradient-divider" />
    <div class="section" v-if="oldSeasons.length > 0">
      <p class="section-label">Anciens évènements</p>
      <div class="events-list">
        <RouterLink
          v-for="season in oldSeasons"
          :key="season.id"
          :to="{ name: 'season', params: { id: season.id } }"
          class="event-card glass-card"
        >
          <div class="event-accent"></div>
          <div class="event-content">
            <p class="event-name">{{ season.name }}</p>
            <div class="event-meta">
              <div class="dates">
                <span class="date">{{ season.start_date }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" class="arrow-icon">
                  <path d="M10.7832 8.66675H2.6665V7.33342H10.7832L7.04984 3.60008L7.99984 2.66675L13.3332 8.00008L7.99984 13.3334L7.04984 12.4001L10.7832 8.66675Z" fill="currentColor"/>
                </svg>
                <span class="date">{{ season.end_date }}</span>
              </div>
            </div>
            <span class="status-badge done">terminé</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
```

**Step 2 : Remplacer le style scoped**

```css
.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 800px;
}

.event-card {
  display: flex;
  align-items: stretch;
  overflow: hidden;
}

.event-accent {
  width: 4px;
  background: linear-gradient(180deg, var(--accent-violet), var(--accent-cyan));
  flex-shrink: 0;
}

.event-content {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 20px;
  flex: 1;
  flex-wrap: wrap;
}

.event-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dates {
  display: flex;
  align-items: center;
  gap: 6px;
}

.date {
  color: var(--text-secondary);
  font-size: 14px;
}

.arrow-icon {
  color: var(--accent-cyan);
}

.gradient-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, var(--accent-violet), transparent);
  border: none;
}
```

**Step 3 : Commit**

```bash
git add src/views/EventsView.vue
git commit -m "feat(ui): redesign EventsView with consistent event cards"
```

---

### Task 8 : TeamsView

**Files:**
- Modify: `src/views/TeamsView.vue`

**Step 1 : Remplacer le template**

```html
<template>
  <div class="page-wrapper">
    <p class="section-label">Équipes</p>
    <div class="teams-grid">
      <RouterLink
        class="team-card glass-card"
        v-for="team in teams"
        :key="team.id"
        :to="{ name: 'team', params: { id: team.id } }"
      >
        <div class="team-avatar">
          <span>{{ team.name.substring(0, 2).toUpperCase() }}</span>
        </div>
        <p class="team-name">{{ team.name }}</p>
      </RouterLink>
    </div>
  </div>
</template>
```

**Step 2 : Remplacer le style scoped**

```css
.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  width: 100%;
}

.team-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 28px 16px 20px;
  text-decoration: none;
}

.team-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.team-avatar span {
  color: white;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.team-name {
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 600;
  text-align: center;
}
```

**Step 3 : Commit**

```bash
git add src/views/TeamsView.vue
git commit -m "feat(ui): redesign TeamsView with avatar initials and glass cards"
```

---

### Task 9 : SeasonDetailView

**Files:**
- Modify: `src/views/SeasonDetailView.vue`

**Step 1 : Remplacer le template**

```html
<template>
  <div class="page-wrapper">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <RouterLink to="/seasons" class="breadcrumb-link">Saisons</RouterLink>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">{{ season.name }}</span>
    </div>

    <!-- Hero card saison -->
    <div class="season-hero glass-card">
      <p class="hero-title">{{ season.name }}</p>
      <div class="hero-meta">
        <div class="dates">
          <span class="date">{{ season.start_date }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" class="arrow-icon">
            <path d="M10.7832 8.66675H2.6665V7.33342H10.7832L7.04984 3.60008L7.99984 2.66675L13.3332 8.00008L7.99984 13.3334L7.04984 12.4001L10.7832 8.66675Z" fill="currentColor"/>
          </svg>
          <span class="date">{{ season.end_date }}</span>
        </div>
      </div>
    </div>

    <!-- Divisions -->
    <div class="divisions-section">
      <p class="section-label">Divisions</p>
      <div class="divisions-grid">
        <router-link
          :to="{ name: 'division', params: { id: division.id } }"
          class="division-card glass-card"
          v-for="division in divisions"
          :key="division.id"
        >
          <p class="division-title">{{ division.name }}</p>
          <div class="ranking-table">
            <div class="ranking-header">
              <span class="col-rank">P</span>
              <span class="col-name">Équipe</span>
              <span class="col-stat">V</span>
              <span class="col-stat">D</span>
              <span class="col-stat">Pts</span>
            </div>
            <div
              class="ranking-row"
              :class="{ 'top-1': index === 0, 'top-2': index === 1, 'top-3': index === 2 }"
              v-for="(team, index) in division.teams"
              :key="index"
            >
              <span class="col-rank rank-num">{{ index + 1 }}</span>
              <span class="col-name team-nm">{{ team.name }}</span>
              <span class="col-stat">{{ team.wins }}</span>
              <span class="col-stat">{{ team.losses }}</span>
              <span class="col-stat">{{ team.points }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
```

**Step 2 : Remplacer le style scoped**

```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
}

.breadcrumb-link {
  color: var(--text-secondary);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: var(--accent-cyan);
}

.breadcrumb-sep {
  color: var(--text-muted);
  font-size: 14px;
}

.breadcrumb-current {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.season-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  width: 100%;
  flex-wrap: wrap;
  gap: 16px;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dates {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date {
  color: var(--text-secondary);
  font-size: 14px;
}

.arrow-icon {
  color: var(--accent-cyan);
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.divisions-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.divisions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
  width: 100%;
}

.division-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  text-decoration: none;
}

.division-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ranking-table {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ranking-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(124, 58, 237, 0.2);
  border-radius: 8px 8px 0 0;
}

.ranking-header span {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.ranking-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  transition: background 0.2s;
}

.ranking-row:nth-child(even) {
  background: rgba(255, 255, 255, 0.04);
}

.ranking-row:last-child {
  border-radius: 0 0 8px 8px;
}

.rank-num {
  font-weight: 700;
}

.top-1 .rank-num { color: var(--accent-gold); }
.top-2 .rank-num { color: var(--accent-silver); }
.top-3 .rank-num { color: var(--accent-bronze); }

.col-rank {
  width: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--text-primary);
}

.col-name {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-stat {
  width: 32px;
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}
```

**Step 3 : Commit**

```bash
git add src/views/SeasonDetailView.vue
git commit -m "feat(ui): redesign SeasonDetailView with breadcrumb and top-3 highlighting"
```

---

### Task 10 : DivisionDetailView

**Files:**
- Modify: `src/views/DivisionDetailView.vue`

**Step 1 : Remplacer le template**

```html
<template>
  <div class="page-wrapper" v-if="divisionData">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <router-link
        :to="{ name: 'season', params: { id: divisionData.season_id } }"
        class="breadcrumb-link"
      >{{ divisionData.season_name }}</router-link>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">{{ divisionData.name }}</span>
    </div>

    <!-- Classement -->
    <div class="section">
      <p class="section-label">Classement</p>
      <div class="ranking-card glass-card">
        <div class="ranking-header">
          <span class="col-rank">#</span>
          <span class="col-name">Équipe</span>
          <span class="col-stat">V</span>
          <span class="col-stat">N</span>
          <span class="col-stat">D</span>
          <span class="col-stat">F</span>
          <span class="col-stat">MG</span>
          <span class="col-stat">MP</span>
          <span class="col-stat">+/-</span>
          <span class="col-stat">Pts</span>
        </div>
        <div
          class="ranking-row"
          :class="{ 'top-1': teamRanking.position === 1, 'top-2': teamRanking.position === 2, 'top-3': teamRanking.position === 3 }"
          v-for="teamRanking in ranking"
          :key="teamRanking.team_id"
        >
          <span class="col-rank rank-num">{{ teamRanking.position }}</span>
          <span class="col-name">{{ teamRanking.team_name }}</span>
          <span class="col-stat">{{ teamRanking.stats.wins }}</span>
          <span class="col-stat">{{ teamRanking.stats.ties }}</span>
          <span class="col-stat">{{ teamRanking.stats.losses }}</span>
          <span class="col-stat">0</span>
          <span class="col-stat">{{ teamRanking.stats.winRounds }}</span>
          <span class="col-stat">{{ teamRanking.stats.looseRounds }}</span>
          <span class="col-stat">{{ teamRanking.stats.winRounds - teamRanking.stats.looseRounds }}</span>
          <span class="col-stat pts">{{ teamRanking.stats.points }}</span>
        </div>
      </div>
    </div>

    <!-- Planning -->
    <div class="section">
      <p class="section-label">Planning</p>
      <div class="planning-list" v-if="games.length > 0">
        <div class="week-card glass-card" v-for="week in games" :key="week.week">
          <p class="week-title">Semaine {{ week.week }}</p>
          <div class="matches">
            <div class="match-card" v-for="game in week.games" :key="game.id">
              <span class="match-date">{{ game.date }}</span>
              <div class="match-teams">
                <span class="team-name">{{ game.team1 }}</span>
                <div class="match-score">
                  <span class="score">{{ game.score1 }}</span>
                  <span class="vs">VS</span>
                  <span class="score">{{ game.score2 }}</span>
                </div>
                <span class="team-name">{{ game.team2 }}</span>
              </div>
              <span
                class="status-badge"
                :class="game.status === 'joué' ? 'done' : game.status === 'prévu' ? 'scheduled' : 'cancelled'"
              >{{ game.status }}</span>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="empty-msg">Aucun match prévu</p>
    </div>

    <!-- Équipes -->
    <div class="section">
      <p class="section-label">Équipes</p>
      <div class="teams-grid" v-if="teams.length > 0">
        <div class="team-card glass-card" v-for="team in teams" :key="team.id">
          <p class="team-title">{{ team.name }}</p>
          <p class="captain" v-if="team.captain">Capitaine : {{ team.captain }}</p>
          <div class="members-section">
            <p class="members-label">Membres</p>
            <div class="members-list">
              <div class="member" v-for="member in team.members" :key="member.id">
                <span class="member-name">{{ member.name }}</span>
                <span class="member-discord" v-if="member.discord">{{ member.discord }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="empty-msg">Aucune équipe</p>
    </div>
  </div>
</template>
```

**Step 2 : Remplacer le style scoped**

```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
}

.breadcrumb-link {
  color: var(--text-secondary);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover { color: var(--accent-cyan); }

.breadcrumb-sep { color: var(--text-muted); font-size: 14px; }

.breadcrumb-current {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.ranking-card {
  width: 100%;
  overflow: hidden;
  overflow-x: auto;
}

.ranking-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(124, 58, 237, 0.2);
}

.ranking-header span {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.ranking-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  transition: background 0.15s;
}

.ranking-row:nth-child(even) { background: rgba(255,255,255,0.02); }
.ranking-row:hover { background: rgba(255,255,255,0.05); }

.top-1 .rank-num { color: var(--accent-gold); font-weight: 700; }
.top-2 .rank-num { color: var(--accent-silver); font-weight: 700; }
.top-3 .rank-num { color: var(--accent-bronze); font-weight: 700; }

.col-rank {
  width: 28px;
  text-align: center;
  font-size: 14px;
  color: var(--text-primary);
}

.col-name {
  flex: 1;
  min-width: 140px;
  font-size: 14px;
  color: var(--text-primary);
}

.col-stat {
  width: 36px;
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}

.pts { color: var(--text-primary); font-weight: 700; }

.planning-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.week-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px;
}

.week-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.matches {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.match-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  flex-wrap: wrap;
}

.match-date {
  font-size: 13px;
  color: var(--text-muted);
  min-width: 90px;
}

.match-teams {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: center;
}

.team-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 120px;
  text-align: center;
}

.match-score {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.vs {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
}

.team-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

.team-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
}

.captain {
  font-size: 14px;
  color: var(--accent-gold);
  font-weight: 600;
  text-align: center;
}

.members-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.members-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
}

.member-name {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.member-discord {
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
}

.empty-msg {
  color: var(--text-secondary);
  font-size: 15px;
}
```

**Step 3 : Commit**

```bash
git add src/views/DivisionDetailView.vue
git commit -m "feat(ui): redesign DivisionDetailView with ranking, planning and teams"
```

---

### Task 11 : TeamDetailView

**Files:**
- Modify: `src/views/TeamDetailView.vue`

**Step 1 : Remplacer le template**

```html
<template>
  <div class="page-wrapper" v-if="teamData">
    <!-- Hero équipe -->
    <div class="team-hero glass-card">
      <div class="team-avatar">
        <span>{{ teamData.name.substring(0, 2).toUpperCase() }}</span>
      </div>
      <div class="team-info">
        <p class="team-name">{{ teamData.name }}</p>
        <p class="captain-info" v-if="teamData.captain">Capitaine : {{ teamData.captain }}</p>
        <p class="captain-info muted" v-else>Aucun capitaine défini</p>
      </div>
    </div>

    <!-- Joueurs -->
    <div class="section">
      <p class="section-label">Joueurs</p>
      <div class="players-grid" v-if="players.length > 0">
        <RouterLink
          class="player-card glass-card"
          v-for="player in players"
          :key="player.id"
          :to="{ name: 'player', params: { id: player.id } }"
        >
          <p class="player-name">{{ player.name }}</p>
        </RouterLink>
      </div>
      <p v-else class="empty-msg">Aucun joueur trouvé</p>
    </div>

    <!-- Résultats -->
    <div class="section" v-if="teamStats.length > 0">
      <p class="section-label">Résultats</p>
      <div class="stats-list">
        <div class="stat-card glass-card" v-for="stat in teamStats" :key="`${stat.division_id}-${stat.season_id}`">
          <div class="stat-breadcrumb">
            <RouterLink :to="{ name: 'season', params: { id: stat.season_id } }" class="bc-link">{{ stat.season_name }}</RouterLink>
            <span class="bc-sep">/</span>
            <RouterLink :to="{ name: 'division', params: { id: stat.division_id } }" class="bc-link">{{ stat.division_name }}</RouterLink>
          </div>
          <div class="stat-table-wrapper">
            <table class="stat-table">
              <thead>
                <tr>
                  <th>Pos</th><th>V</th><th>D</th><th>N</th><th>J</th>
                  <th>MG</th><th>MP</th><th>Pts</th><th>+/-</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ stat.position }}/{{ stat.total_teams }}</td>
                  <td>{{ stat.wins }}</td>
                  <td>{{ stat.losses }}</td>
                  <td>{{ stat.ties }}</td>
                  <td>{{ stat.wins + stat.losses + stat.ties }}</td>
                  <td>{{ stat.winRounds }}</td>
                  <td>{{ stat.looseRounds }}</td>
                  <td class="pts">{{ stat.points }}</td>
                  <td>{{ stat.winRounds - stat.looseRounds }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="section" v-else>
      <p class="section-label">Résultats</p>
      <p class="empty-msg">Aucun résultat trouvé</p>
    </div>
  </div>
</template>
```

**Step 2 : Remplacer le style scoped**

```css
.team-hero {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px 32px;
  width: 100%;
}

.team-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.team-avatar span {
  color: white;
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
}

.team-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.team-name {
  font-size: 28px;
  font-weight: 800;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.captain-info {
  font-size: 14px;
  color: var(--accent-gold);
  font-weight: 600;
}

.captain-info.muted { color: var(--text-secondary); }

.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  width: 100%;
}

.player-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-decoration: none;
}

.player-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px;
}

.stat-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bc-link {
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}

.bc-link:hover { color: var(--accent-cyan); }
.bc-sep { color: var(--text-muted); font-size: 13px; }

.stat-table-wrapper { overflow-x: auto; }

.stat-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.stat-table th {
  padding: 8px 12px;
  background: rgba(124, 58, 237, 0.2);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
}

.stat-table td {
  padding: 10px 12px;
  background: rgba(255,255,255,0.03);
  color: var(--text-primary);
  text-align: center;
  font-size: 14px;
}

.stat-table .pts {
  font-weight: 700;
  color: var(--accent-cyan);
}

.empty-msg {
  color: var(--text-secondary);
  font-size: 15px;
}
```

**Step 3 : Commit**

```bash
git add src/views/TeamDetailView.vue
git commit -m "feat(ui): redesign TeamDetailView with hero card and styled stats table"
```

---

### Task 12 : PlayerDetailView

**Files:**
- Modify: `src/views/PlayerDetailView.vue`

**Step 1 : Remplacer le template**

```html
<template>
  <div class="page-wrapper">
    <div class="player-hero glass-card">
      <div class="player-avatar">
        <span>{{ player.name ? player.name.substring(0, 2).toUpperCase() : '??' }}</span>
      </div>
      <div class="player-info">
        <p class="player-name">{{ player.name }}</p>
        <router-link
          :to="{ name: 'team', params: { id: player.team_id || player.team } }"
          class="team-link"
        >{{ player.team_name }}</router-link>
        <p class="discord" v-if="player.discord != null">{{ player.discord }}</p>
      </div>
    </div>

    <div class="section">
      <p class="section-label">Résultats</p>
      <div class="stats-list" v-if="player.stats && player.stats.length > 0">
        <div class="stat-card glass-card" v-for="stat in player.stats" :key="stat.season_id">
          <div class="stat-breadcrumb">
            <RouterLink :to="{ name: 'season', params: { id: stat.season_id } }" class="bc-link">{{ stat.season_name }}</RouterLink>
            <span class="bc-sep">/</span>
            <RouterLink :to="{ name: 'division', params: { id: stat.division_id } }" class="bc-link">{{ stat.division_name }}</RouterLink>
          </div>
          <div class="stat-table-wrapper">
            <table class="stat-table">
              <thead>
                <tr>
                  <th>V</th><th>D</th><th>J</th><th>MG</th><th>MP</th><th>Pts</th><th>+/-</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ stat.wins }}</td>
                  <td>{{ stat.losses }}</td>
                  <td>{{ stat.wins + stat.losses }}</td>
                  <td>{{ stat.winRounds }}</td>
                  <td>{{ stat.looseRounds }}</td>
                  <td class="pts">{{ stat.points }}</td>
                  <td>{{ stat.winRounds - stat.looseRounds }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <p v-else class="empty-msg">Aucun résultat trouvé</p>
    </div>
  </div>
</template>
```

**Step 2 : Remplacer le style scoped**

```css
.player-hero {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px 32px;
  width: 100%;
}

.player-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.player-avatar span {
  color: white;
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.player-name {
  font-size: 28px;
  font-weight: 800;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.team-link {
  font-size: 14px;
  color: var(--accent-cyan);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.discord {
  font-size: 13px;
  color: var(--text-muted);
  font-style: italic;
}

.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px;
}

.stat-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bc-link {
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}

.bc-link:hover { color: var(--accent-cyan); }
.bc-sep { color: var(--text-muted); font-size: 13px; }

.stat-table-wrapper { overflow-x: auto; }

.stat-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.stat-table th {
  padding: 8px 12px;
  background: rgba(124, 58, 237, 0.2);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
}

.stat-table td {
  padding: 10px 12px;
  background: rgba(255,255,255,0.03);
  color: var(--text-primary);
  text-align: center;
}

.stat-table .pts {
  font-weight: 700;
  color: var(--accent-cyan);
}

.empty-msg {
  color: var(--text-secondary);
  font-size: 15px;
}
```

**Step 3 : Commit**

```bash
git add src/views/PlayerDetailView.vue
git commit -m "feat(ui): redesign PlayerDetailView with hero card and stat table"
```

---

### Task 13 : Vérification finale et build

**Step 1 : Vérifier toutes les pages visuellement**

```
Pages à vérifier :
- / ou /home → Home (IncomingEvents + TheSeasons + ThePresentation)
- /seasons → SeasonsView
- /events → EventsView
- /teams → TeamsView
- /seasons/:id → SeasonDetailView
- /seasons/:id/division/:id → DivisionDetailView (adapter l'URL selon le router)
- /teams/:id → TeamDetailView
- /players/:id → PlayerDetailView
```

**Step 2 : Vérifier que le build passe**

```bash
cd /home/alexandre/Documents/devlopement/sbl/SBL-app
npm run build
# Doit terminer sans erreur
```

**Step 3 : Commit final**

```bash
git add -A
git commit -m "feat(ui): complete Midnight Pro redesign — all pages updated"
```
