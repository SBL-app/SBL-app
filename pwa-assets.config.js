import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: minimal2023Preset,
  images: ['public/img/sbl-logo.png'],
  // Les fichiers générés sont placés dans le même répertoire que l'image source
  // → public/img/pwa-192x192.png, public/img/pwa-512x512.png, etc.
})
