# Design Document — Refonte UI SBL App

**Date** : 2026-03-02
**Branche** : feat/update-ui
**Direction** : Modern Esport — "Midnight Pro"

---

## Objectif

Refonte visuelle complète de l'interface SBL (Splatoon Baguette League). L'UI actuelle est fonctionnelle mais basique (cartes violettes plates, hiérarchie visuelle limitée, hover vert incohérent). La nouvelle direction adopte un style modern esport avec glassmorphism, typographie bold et palette sombre contrastée.

**Contraintes immuables :**
- Ne pas modifier le logo SBL
- Ne pas modifier les liens vers Discord et X

---

## 1. Fondations visuelles

### Palette de couleurs

| Usage | Valeur |
|-------|--------|
| Fond principal | `#08080f` |
| Fond secondaire | `#0f0a1e` |
| Fond cartes (glassmorphism) | `rgba(255,255,255,0.04)` |
| Bordure cartes | `rgba(124,58,237,0.3)` |
| Accent 1 — violet électrique | `#7c3aed` |
| Accent 2 — cyan sky | `#0ea5e9` |
| Dégradé principal | `#7c3aed → #0ea5e9` |
| Highlight or (top 3, capitaine) | `#f59e0b` |
| Texte principal | `#f1f5f9` |
| Texte secondaire | `#94a3b8` |

### Typographie

- **Police** : Outfit (Google Fonts)
- Titres hero : `clamp(1.8rem, 4vw, 3rem)`, `font-weight: 700`, texte en dégradé via `background-clip: text`
- Labels/catégories : `font-weight: 600`, uppercase, `letter-spacing: 0.1em`
- Corps : `font-weight: 400`, `color: #94a3b8`

### Système de cartes (glassmorphism)

```css
background: rgba(255,255,255,0.04);
backdrop-filter: blur(12px);
border: 1px solid rgba(124,58,237,0.3);
border-radius: 16px;
transition: border-color 0.3s, transform 0.2s;

/* Hover */
border-color: rgba(14,165,233,0.5);
transform: translateY(-2px);
```

---

## 2. Navbar & Layout global

### Navbar (`TheNavbar.vue`)
- Hauteur : 64px
- Fond : `rgba(8,8,15,0.85)` + `backdrop-filter: blur(20px)`
- Bordure bas : dégradé `#7c3aed → #0ea5e9` (1px)
- Logo SBL : **inchangé**
- Nom "Splatoon Baguette League" : dégradé violet→cyan, `font-weight: 700`
- Liens de navigation : `#94a3b8` au repos, blanc au hover avec underline animé cyan, lien actif blanc + underline violet
- Icônes Discord/X : **liens inchangés**, `opacity: 0.7 → 1` au hover

### Layout global (`#app`)
- Fond : `radial-gradient(ellipse at 50% -20%, rgba(124,58,237,0.15) 0%, #08080f 60%)`
- Contenu centré : `max-width: 1200px`, `padding: 0 24px`
- Gap entre sections : 64px

### Liens globaux
- Remplacer `background-color: hsla(160, 100%, 37%, 0.2)` (vert incohérent) par `color: #0ea5e9` avec `transition: 0.2s`

---

## 3. Page Home & composants

### `IncomingEvents.vue`
- Titre : dégradé violet→cyan, bold, uppercase
- Hero card : glassmorphism + `border-left: 3px solid #7c3aed`
- Badge statut : pill vert (#22c55e) pour "en cours", gris pour "terminé"
- Dates : `color: #94a3b8`, flèche SVG en cyan

### `TheSeasons.vue`
- Grid responsive : `repeat(auto-fill, minmax(240px, 1fr))`
- Cartes glassmorphism
- Barre de progression : track `rgba(255,255,255,0.1)`, fill dégradé `#7c3aed → #0ea5e9`
- Badge pourcentage flottant au-dessus de la barre
- Statut "en cours" : dot animé (pulse)

### `ThePresentation.vue`
- Fond : `rgba(124,58,237,0.08)` + `border-left: 3px solid #7c3aed`
- Texte : `color: #94a3b8`, `line-height: 1.8`, `max-width: 700px`
- Titre avec dégradé (remplace le soulignement)

---

## 4. Pages internes

### `SeasonsView` & `EventsView`
- Labels de section : uppercase, `letter-spacing: 0.1em`, `color: #94a3b8`
- Séparateur entre dernière saison et anciennes : ligne dégradée `#7c3aed → transparent`

### `TeamsView`
- Grid responsive conservée
- Cartes : glassmorphism + initiales équipe dans cercle dégradé (avatar placeholder)
- Nom : `font-weight: 600`

### `SeasonDetailView`
- Breadcrumb : "Saisons > Nom de la saison"
- Hero card info saison avec dégradé
- Tableau classement : header violet sombre, lignes alternées `rgba(255,255,255,0.03)`
- Top 3 : or `#f59e0b` / argent `#94a3b8` / bronze `#cd7c2f`

### `DivisionDetailView`
- Tableau classement : top 3 mis en valeur, même palette
- Planning : cartes glassmorphism par semaine, badges statut conservés (vert/orange/rouge)
- Section équipes : cartes membres compactes

### `TeamDetailView` & `PlayerDetailView`
- Tableaux stats : header dégradé violet→cyan, cellules alternées
- Hero card en haut de page
- Breadcrumbs vers saison/division

---

## Fichiers à modifier

| Fichier | Changements |
|---------|------------|
| `src/assets/base.css` | Import Outfit, variables CSS custom |
| `src/assets/main.css` | Fond global, hover links, layout |
| `src/components/TheNavbar.vue` | Style complet |
| `src/components/IncomingEvents.vue` | Hero card, badges, titre |
| `src/components/TheSeasons.vue` | Cartes glassmorphism, barre de progression |
| `src/components/ThePresentation.vue` | Fond, texte, titre |
| `src/views/SeasonsView.vue` | Labels, séparateur |
| `src/views/EventsView.vue` | Labels, cartes |
| `src/views/TeamsView.vue` | Cartes + avatar initiales |
| `src/views/SeasonDetailView.vue` | Breadcrumb, tableau, top 3 |
| `src/views/DivisionDetailView.vue` | Tableau, planning, équipes |
| `src/views/TeamDetailView.vue` | Hero card, tableaux |
| `src/views/PlayerDetailView.vue` | Hero card, tableaux |
