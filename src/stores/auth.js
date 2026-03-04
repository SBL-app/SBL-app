// SBL-app/src/stores/auth.js
import { ref, computed } from "vue";
import { defineStore } from "pinia";

const STORAGE_KEY = "sbl_auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

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

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  return { user, token, isAuthenticated, loadFromStorage, initFromCallback, logout };
});
