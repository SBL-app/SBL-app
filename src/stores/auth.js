// SBL-app/src/stores/auth.js
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL.js";

const STORAGE_KEY = "sbl_auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  /**
   * Instance ky authentifiée.
   * Ajoute automatiquement le JWT et gère le refresh/expiration.
   */
  const api = computed(() =>
    ky.create({
      prefixUrl: API_URL,
      hooks: {
        beforeRequest: [
          (request) => {
            if (token.value) {
              request.headers.set("Authorization", `Bearer ${token.value}`);
            }
          },
        ],
        afterResponse: [
          async (_request, _options, response) => {
            if (response.status === 401 && token.value) {
              // Token expiré, tenter un refresh
              const refreshed = await refreshToken();
              if (!refreshed) {
                logout();
              }
            }
          },
        ],
      },
    })
  );

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      token.value = data.token ?? null;
      user.value = data.user ?? null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function initFromCallback(rawToken, userBase64) {
    try {
      // Valider le format JWT (3 segments séparés par des points)
      const JWT_REGEX = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
      if (!JWT_REGEX.test(rawToken)) {
        throw new Error("Invalid token format");
      }
      const decoded = JSON.parse(atob(userBase64));
      if (!decoded || typeof decoded !== 'object' || !decoded.id) {
        throw new Error("Invalid user payload");
      }
      token.value = rawToken;
      user.value = decoded;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: rawToken, user: decoded }));
    } catch {
      console.error("Failed to parse auth callback data");
      logout();
    }
  }

  async function refreshToken() {
    if (!token.value) return false;

    try {
      const response = await ky.post(`${API_URL}/auth/refresh`, {
        headers: { Authorization: `Bearer ${token.value}` },
      }).json();

      token.value = response.token;
      if (response.user) {
        user.value = response.user;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: token.value, user: user.value }));
      return true;
    } catch {
      return false;
    }
  }

  async function logout() {
    // Appeler l'API pour invalider le token côté serveur
    if (token.value) {
      try {
        await ky.post(`${API_URL}/auth/logout`, {
          headers: { Authorization: `Bearer ${token.value}` },
        });
      } catch {
        // On logout localement même si l'API échoue
      }
    }

    token.value = null;
    user.value = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  return { user, token, isAuthenticated, api, loadFromStorage, initFromCallback, logout, refreshToken };
});
