# Sécurité — Frontend SBL

Revue alignée sur le **OWASP Top 10 (2021)**.

| Risque OWASP | Mesure |
| --- | --- |
| **A03 — Injection / XSS** | Vue échappe par défaut les interpolations `{{ }}`. Le code n'utilise aucun `v-html` ni `innerHTML`. Une **CSP** stricte (`nginx.conf`) bloque les scripts inline et externes non autorisés. |
| **A05 — Mauvaise configuration** | En-têtes de sécurité servis par Nginx : `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `server_tokens off`. |
| **A01 — Contrôle d'accès** | Le frontend ne manipule aucun secret ; l'URL d'API est publique et injectée au build (`VITE_API_URL`). |
| **A06 — Composants vulnérables** | `npm audit` exécuté en CI ; dépendances déclarées explicitement. |
| **Tabnabbing** | Les liens externes (`target="_blank"`) portent `rel="noopener noreferrer"`. |

## CSP

La politique par défaut n'autorise que l'origine du site et l'API SBL
(`connect-src`). Si le domaine de l'API change, mettez à jour la directive
`connect-src` dans [`nginx.conf`](nginx.conf).

## Bonnes pratiques

- Ne jamais introduire de `v-html` sur des données non fiables.
- Conserver la CSP la plus restrictive possible.
