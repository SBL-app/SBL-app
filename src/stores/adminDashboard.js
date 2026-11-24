import { ref } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "@/stores/auth";

// Dashboard admin : agrégats (GET admin/dashboard) et actions rapides (ROLE_ADMIN côté API).
export const useAdminDashboardStore = defineStore("adminDashboard", () => {
  const data = ref(null);
  const loading = ref(false);
  const error = ref("");

  const fetchDashboard = async () => {
    const auth = useAuthStore();
    loading.value = true;
    error.value = "";
    try {
      data.value = await auth.api.get("admin/dashboard").json();
    } catch {
      data.value = null;
      error.value = "Impossible de charger le dashboard.";
    } finally {
      loading.value = false;
    }
  };

  const act = async (path) => {
    await useAuthStore().api.post(path).json();
    await fetchDashboard();
  };

  const validateResult = (gameId) => act(`admin/games/${gameId}/validate-result`);
  const remind = (gameId) => act(`admin/games/${gameId}/remind`);
  const closeDivision = (divisionId) => act(`admin/divisions/${divisionId}/close`);

  return { data, loading, error, fetchDashboard, validateResult, remind, closeDivision };
});
