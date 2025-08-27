import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";

export const useSeasonStore = defineStore("seasons", () => {
  const seasons = ref([]);
  const season = ref({});

  const fetchAllSeasons = async () => {
    try {
      // Essayer d'abord la nouvelle API
      const response = await ky.get(`${API_URL}/season`);
      seasons.value = await response.json();
    } catch (error) {
      if (error.response?.status === 404) {
        // Fallback vers l'ancienne API
        const response = await ky.get(`${API_URL}/seasons`);
        seasons.value = await response.json();
      } else {
        throw error;
      }
    }
  };

  const fetchSeason = async (id) => {
    try {
      // Essayer d'abord la nouvelle API
      const response = await ky.get(`${API_URL}/season?id=${id}`);
      season.value = await response.json();
    } catch (error) {
      if (error.response?.status === 404) {
        // Fallback vers l'ancienne API
        const response = await ky.get(`${API_URL}/season/${id}`);
        season.value = await response.json();
      } else {
        throw error;
      }
    }
  };

  const fetchSeasonPercentage = async (id) => {
    try {
      // Essayer d'abord la nouvelle API
      const response = await ky.get(`${API_URL}/season/pourcent?id=${id}`);
      season.value = await response.json();
    } catch (error) {
      if (error.response?.status === 404) {
        // Fallback vers l'ancienne API
        const response = await ky.get(`${API_URL}/season/${id}/percent`);
        season.value = await response.json();
      } else {
        throw error;
      }
    }
  }

  const fetchTeamsBySeason = async (id) => {
    try {
      // Essayer d'abord la nouvelle API
      const response = await ky.get(`${API_URL}/season/teams?id=${id}`);
      season.value = await response.json();
    } catch (error) {
      if (error.response?.status === 404) {
        // Fallback vers l'ancienne API
        const response = await ky.get(`${API_URL}/season/${id}/teams`);
        season.value = await response.json();
      } else {
        throw error;
      }
    }
  }
  
  return {
    seasons,
    season,
    fetchAllSeasons,
    fetchSeason,
    fetchSeasonPercentage,
    fetchTeamsBySeason,
  };
});
