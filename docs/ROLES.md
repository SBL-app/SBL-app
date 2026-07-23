# Rôles de l'application SBL

Ce document recense **tous les rôles** de l'application SBL (Symfony Baguette
League) et les autorisations associées, à travers les trois composants : API
(Symfony), application web (Vue) et bot Discord.

Il existe deux familles de rôles :

1. **Rôles de sécurité** (portés par le compte `User`, vérifiés par l'API)
2. **Rôles d'équipe** (portés par l'entité `TeamMember`, propres à une équipe)

---

## 1. Rôles de sécurité (compte utilisateur)

Ces rôles sont stockés sur l'entité `User` (`roles: []`) et évalués par l'API
via `config/packages/security.yaml` et `ApiAccessVoter`.

| Rôle | Attribué à | Description |
|------|-----------|-------------|
| `PUBLIC_ACCESS` | Tout le monde (anonyme) | Accès en **lecture seule** aux endpoints `GET /api/*`. |
| `ROLE_USER` | Tout utilisateur authentifié (login Discord) | Utilisateur connecté. Accès à son profil et aux actions d'équipe le concernant. |
| `ROLE_API` | Comptes service / bot, administrateurs | Autorise les **écritures** (`POST/PUT/PATCH/DELETE`) sur `/api/*`. |
| `ROLE_ADMIN` | Administrateurs de la ligue | Actions d'administration (validation forcée, report forcé, gestion des saisons, promotion/relégation…). |

### Règles d'accès (résumé)

| Méthode / route | Rôle requis |
|-----------------|-------------|
| `GET /api/*` | `PUBLIC_ACCESS` (lecture publique) |
| `POST/PUT/PATCH/DELETE /api/*` | `ROLE_API` |
| `GET /api/users/me` | `ROLE_USER` |
| `/api/teams/{id}/members*` | `ROLE_USER` (capitaine pour les modifications) |
| `/api/teams/{id}/players*` | `ROLE_USER` (capitaine) |
| `/api/seasons/{id}/register` | `ROLE_USER` (capitaine) |
| `/api/push/subscribe` | `ROLE_USER` |
| Actions `admin-*` (report, validation, promotions) | `ROLE_ADMIN` |

> **Hiérarchie recommandée** : `ROLE_ADMIN` devrait impliquer `ROLE_API`
> (les endpoints admin sont des écritures et passent par le contrôle `ROLE_API`).
> À déclarer via `role_hierarchy` dans `security.yaml` si ce n'est pas déjà le cas.

---

## 2. Rôles d'équipe (`TeamMember`)

Ces rôles décrivent la position d'un utilisateur **au sein d'une équipe** et
sont indépendants des rôles de sécurité. Ils sont portés par l'entité
`TeamMember` (`role`).

| Rôle | Constante | Description |
|------|-----------|-------------|
| Capitaine | `TeamMember::ROLE_CAPTAIN` (`captain`) | Gère l'équipe : ajout/retrait de membres et de joueurs (roster), nomination d'un autre capitaine, inscription à une saison, propositions/validations de matchs, report de match. Une équipe peut avoir **plusieurs capitaines** ; le dernier capitaine ne peut pas se retirer/rétrograder. |
| Membre | `TeamMember::ROLE_MEMBER` (`member`) | Appartient à l'équipe sans droit de gestion. |

### Ce qu'un capitaine peut faire

- Créer une équipe (devient automatiquement capitaine)
- Ajouter / retirer des **membres** (comptes utilisateurs liés à Discord)
- Ajouter / retirer des **joueurs** du roster (`Player`)
- Nommer un membre comme **capitaine** (ou rétrograder, sauf le dernier)
- **Inscrire** l'équipe à une saison ouverte
- Proposer / accepter des dates de match
- Soumettre / valider un score de match
- **Reporter** un match (dans la limite autorisée par saison)

---

## 3. Méthodes d'authentification

L'API accepte plusieurs mécanismes d'authentification, qui aboutissent tous à
l'attribution de rôles :

| Méthode | Usage | Rôles typiques |
|---------|-------|----------------|
| **Discord OAuth2** | Connexion des utilisateurs via l'app web | `ROLE_USER` |
| **JWT** (lexik) | Jeton porté par le header `Authorization: Bearer` | selon le compte |
| **Clé API** | Accès service avec expiration | `ROLE_API` |
| **Secret bot** (`X-Bot-Secret`) | Authentification du bot Discord auprès de l'API | `ROLE_API` |

---

## 4. Utilisation côté application web (Vue)

- Le store `auth` (`src/stores/auth.js`) conserve l'utilisateur et le JWT, et
  expose une instance `ky` **authentifiée** (`auth.api`) pour les écritures.
- Les routes privées sont protégées par `meta.requiresAuth` (garde de routeur
  dans `src/router/index.js`), qui redirige les utilisateurs non connectés.
- Les actions réservées (créer une équipe, générer un planning, reporter un
  match…) ne sont affichées que si `auth.isAuthenticated` est vrai ; l'API
  reste l'autorité finale sur les autorisations (capitaine / admin).

---

## 5. Récapitulatif visuel

```
Anonyme ──(lecture GET)──> API
   │
   └─ login Discord ─> ROLE_USER
                          │
                          ├─ capitaine d'une équipe (TeamMember: captain)
                          │     └─ gestion d'équipe, inscription, reports…
                          │
                          └─ membre d'une équipe (TeamMember: member)

Service / Bot ─(clé API / X-Bot-Secret)─> ROLE_API ──(écritures)──> API

Administrateur ─> ROLE_ADMIN (+ ROLE_API) ──(actions admin)──> API
```
