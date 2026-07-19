# sbl-front

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Qualité, tests, sécurité et accessibilité

```sh
npm run lint           # ESLint + règles d'accessibilité (vuejs-accessibility)
npm run format:check   # vérification du formatage (Prettier)
npm test               # tests unitaires (Vitest)
npm run test:coverage  # tests + couverture (seuil 75 %)
```

- **CI** (`.github/workflows/ci.yml`) : lint + accessibilité, tests +
  couverture, build, `npm audit`.
- **CD** (`.github/workflows/cd.yml`) : déploiement SSH automatique sur `main`
  (rebuild du service `frontend`). Secrets : `SSH_HOST`, `SSH_USER`, `SSH_KEY`,
  `SSH_PORT` (optionnel), `DEPLOY_PATH`.
- **Sécurité** : voir [`SECURITY.md`](SECURITY.md) — revue OWASP + CSP servie par
  Nginx ([`nginx.conf`](nginx.conf)).
- **Accessibilité** : voir [`ACCESSIBILITE.md`](ACCESSIBILITE.md) — objectif RGAA 4 / OPQUAST.

### Docker

Le [`Dockerfile`](Dockerfile) construit l'application (Vite) puis la sert via
Nginx avec des en-têtes de sécurité. L'URL de l'API est injectée au build via
l'argument `VITE_API_URL`.

```sh
docker build --build-arg VITE_API_URL=https://mon-api.example.com -t sbl-frontend .
```
