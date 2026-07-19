// URL de l'API. En production, la valeur est injectée au build via la variable
// d'environnement Vite `VITE_API_URL` (voir docker-compose / Dockerfile).
// À défaut, on retombe sur l'URL publique par défaut.
export const API_URL =
  import.meta.env.VITE_API_URL || "https://sbl-api.alexandre-giordana.fr";
