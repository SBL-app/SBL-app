# Journal des versions — SBL App (frontend)

Toutes les évolutions notables du site public SBL sont consignées dans ce fichier.

Le format suit la convention [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et le projet applique le [versionnage sémantique](https://semver.org/lang/fr/).

---

## [Non publié]

Développements intégrés sur la branche `dev`, en attente de publication.

### Ajouté

- **Écran de création d'équipe** — un joueur peut créer son équipe et y ajouter des coéquipiers sans intervention administrateur (#27).
- **Report de match par le capitaine** — déclaration d'un report depuis l'interface (#26).
- **Génération du planning** depuis la fiche division (#21).
- **`robots.txt`** — directives d'exploration explicites et déclaration du sitemap, servi hors du fallback SPA.
- **Squelette de chargement sur le bloc des saisons** — cartes fictives reprenant la géométrie du rendu final, éliminant le décalage de mise en page à l'arrivée des données. Animation désactivée sous `prefers-reduced-motion`.
- Documentation de l'ensemble des rôles de l'application (#24).

### Modifié

- **En-tête `Strict-Transport-Security`** ajouté à la configuration Nginx.
- Nettoyage des imports inutilisés dans les vues.

### Corrigé

- **Statut des saisons** — le prochain évènement de la page d'accueil (et les cartes de saison) s'affichait « en cours » avant même son début : le statut (« à venir », « en cours », « terminé ») est désormais déduit des dates de la saison.
- **Nombre d'équipes du prochain évènement** — la page d'accueil affichait le nombre de saisons au lieu du nombre d'équipes inscrites.
- **Décalage de mise en page (CLS) sur mobile** — le bloc des saisons s'affichait vide puis poussait le contenu vers le bas à l'arrivée des données. L'espace est désormais réservé dès le premier rendu.
- Restauration de l'attribut `lang="fr"`, du lien d'évitement et des repères `header` / `main` après la refonte d'interface.
- Fuite de l'état `isLoading`, contrôle de l'origine dans le service worker, et nettoyage de la fermeture de l'invite d'installation.
- Resynchronisation de `package-lock.json` avec `package.json`.

---

## [1.0.0] — 2026-07-19

### Ajouté

- **Chaîne d'intégration et de déploiement continus** — ESLint avec règles d'accessibilité, Vitest avec seuils de couverture bloquants, construction de production, `npm audit`, déploiement par SSH.
- **En-têtes de sécurité et politique de sécurité de contenu** au niveau de Nginx.
- **`SECURITY.md`** et **`ACCESSIBILITE.md`** — référentiels retenus et mesures appliquées.
- **Authentification Discord OAuth** — store Pinia dédié, gestion du callback, composant `TheUserMenu`.
- **Progressive Web App** — `vite-plugin-pwa` en stratégie `injectManifest`, service worker personnalisé avec gestion des notifications push, composant `InstallPrompt`, icônes et métadonnées.
- **Recherche globale** — composant `TheSearchDropdown` et store de recherche unifié, avec attributs ARIA, gestion du `focus-visible` et fermeture au clic extérieur.
- **Refonte d'interface « Midnight Pro »** — système de design, navbar en verre dépoli, cartes de saison, barres de progression en dégradé, fil d'Ariane, mise en avant du top 3.
- **Statistiques d'équipe et de joueur**, affichage des résultats sur la fiche équipe.
- Interface responsive mobile et tri des saisons de la plus récente à la plus ancienne.

### Modifié

- Migration des composants vers la syntaxe `<script setup>`.
- Gestion de l'URL d'API par variable d'environnement.

### Corrigé

- Résolution de la route racine et des problèmes d'affichage numérique.

---

## [0.1] — 2025-03-28

Première version publique du site.

### Ajouté

- **Socle Vue 3 et Vite** — routage `vue-router` en mode `history`, état géré par Pinia, requêtes HTTP via `ky`.
- **Vues de consultation** — accueil, saisons, détail de saison, détail de division, équipes, détail d'équipe, fiche joueur, événements et détail d'événement.
- **Composant `IncomingEvents`** et affichage dynamique de la saison en cours.
- Affichage des équipes engagées par division et tri des classements.
- Barre de navigation *sticky*, liens vers Discord et X.
- Formatage du code par Prettier.

### Corrigé

- Gestion des cas limites : aucune saison disponible, aucune équipe dans une division.
- Correction des liens de navigation et des redirections sur les événements passés.

---

## Procédure de publication

```bash
git checkout main && git pull
# 1. Basculer la section [Non publié] de ce fichier vers une section versionnée
# 2. Commiter la mise à jour du journal
git tag -a v1.1.0 -m "Description de la version"
git push origin v1.1.0
```
