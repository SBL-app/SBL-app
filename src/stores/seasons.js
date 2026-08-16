import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";

export const useSeasonStore = defineStore("seasons", () => {
  const seasons = ref([]);
  const season = ref({});
  // Vrai tant que la première requête n'a pas abouti. Permet aux vues
  // d'afficher un squelette de la taille finale plutôt qu'un bloc vide,
  // et d'éviter ainsi le décalage de mise en page à l'arrivée des données.
  const isLoadingSeasons = ref(true);

  const fetchAllSeasons = async () => {
    isLoadingSeasons.value = true;
    try {
      const response = await ky.get(`${API_URL}/seasons`);
      seasons.value = await response.json();
    } finally {
      isLoadingSeasons.value = false;
    }
  };

  const fetchSeason = async (id) => {
    const response = await ky.get(`${API_URL}/seasons/${id}`);
      season.value = await response.json();
  };

  const fetchSeasonPercentage = async (id) => {
    const response = await ky.get(`${API_URL}/seasons/${id}/completion`);
      season.value = await response.json();
  }

  const fetchTeamsBySeason = async (id) => {
    const response = await ky.get(`${API_URL}/seasons/${id}/teams`);
      season.value = await response.json();
  }

  return {
    seasons,
    season,
    isLoadingSeasons,
    fetchAllSeasons,
    fetchSeason,
    fetchSeasonPercentage,
    fetchTeamsBySeason,
  };
});
