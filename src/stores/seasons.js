import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";

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

  const fetchSeasonPercentage = async (id) => {
    const response = await ky.get(`${API_URL}/season/${id}/percent`);
    season.value = await response.json();
  }

  const fetchTeamsBySeason = async (id) => {
    const response = await ky.get(`${API_URL}/season/${id}/teams`);
    season.value = await response.json();
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
