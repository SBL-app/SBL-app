# syntax=docker/dockerfile:1

# ---- Étape 1 : build de l'application Vue ----
FROM node:20-alpine AS build

WORKDIR /app

# L'URL de l'API est injectée au build (Vite n'expose que les variables VITE_*).
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# ---- Étape 2 : service statique via Nginx ----
FROM nginx:alpine AS runtime

# Configuration durcie (en-têtes de sécurité, fallback SPA).
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
