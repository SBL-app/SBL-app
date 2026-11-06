import { ref } from "vue";
import { defineStore } from "pinia";
import { API_URL } from "../../API_URL";

const TIMEOUT_MS = 10000;

// Équivalent web de /apistatus : ping de l'API, code HTTP, latence et infos (nom/version) si JSON.
export const useApiStatusStore = defineStore("apiStatus", () => {
  const loading = ref(false);
  const online = ref(null); // null = pas encore vérifié
  const httpStatus = ref(null);
  const responseTime = ref(null);
  const info = ref(null); // { name, version, status }
  const error = ref(null);
  const checkedAt = ref(null);

  const checkStatus = async () => {
    loading.value = true;
    error.value = null;
    info.value = null;
    const start = Date.now();
    try {
      const response = await fetch(API_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      responseTime.value = Date.now() - start;
      httpStatus.value = response.status;
      online.value = response.ok;
      if (response.ok && (response.headers.get("content-type") || "").includes("application/json")) {
        try {
          const data = await response.json();
          const { name, version, status } = data || {};
          if (name || version || status) info.value = { name, version, status };
        } catch {
          // Corps illisible : les infos de base suffisent.
        }
      }
    } catch (e) {
      responseTime.value = null;
      httpStatus.value = null;
      online.value = false;
      error.value = e?.name === "TimeoutError" ? "Timeout : l'API ne répond pas à temps" : e?.message || "Erreur de connexion";
    } finally {
      checkedAt.value = new Date();
      loading.value = false;
    }
  };

  return { loading, online, httpStatus, responseTime, info, error, checkedAt, checkStatus };
});
