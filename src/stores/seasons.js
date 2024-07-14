import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";

const API_URL = "http://localhost:8000";

export const useSeasonStore = defineStore("seasons", () => {
  const seasons = ref([]);
  const season = ref({});

  const fetchAllSeasons = async () => {
    const response = await ky.get(`${API_URL}/seasons`);
    seasons.value = await response.json();
  };

  const fetchSeason = async (id) => {
    const response = await ky.get(`${API_URL}/season/${id}`);
    season.value = await response.json();
  };

  return {
    seasons,
    season,
    fetchAllSeasons,
    fetchSeason,
  };
});
