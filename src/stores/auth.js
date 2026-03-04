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
      const decoded = JSON.parse(atob(userBase64));
      token.value = rawToken;
      user.value = decoded;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: rawToken, user: decoded }));
    } catch {
      console.error("Failed to parse auth callback data");
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  return { user, token, isAuthenticated, loadFromStorage, initFromCallback, logout };
});
