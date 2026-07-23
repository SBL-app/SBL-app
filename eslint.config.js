import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import pluginVueA11y from "eslint-plugin-vuejs-accessibility";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },
  js.configs.recommended,
  // `flat/essential` : détection des erreurs réelles (pas les règles de style,
  // gérées par Prettier). Évite de bloquer sur le formatage du code existant.
  ...pluginVue.configs["flat/essential"],
  // Règles d'accessibilité (RGAA / OPQUAST) sur les templates Vue.
  ...pluginVueA11y.configs["flat/recommended"],
  {
    files: ["**/*.{js,vue}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      // Signalé en warning pour ne pas bloquer la CI sur la dette du code
      // existant (imports inutilisés, etc.), tout en restant visible.
      "no-unused-vars": "warn",
    },
  },
  {
    // Fichiers de test : environnement Node + globals Vitest importés.
    files: ["tests/**/*.js", "vitest.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Service worker : globals spécifiques (self, clients, caches, skipWaiting…).
    files: ["src/sw.js"],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },
];
