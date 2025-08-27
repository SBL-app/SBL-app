import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";

export const useTeamStatStore = defineStore("teamStats", () => {
  const teamStats = ref([]);
  const teamStat = ref({});

  const fetchAllTeamStats = async () => {
    const response = await ky.get(`${API_URL}/teamStats`);
    teamStats.value = await response.json();
  };

  const fetchTeamStatByTeamId = async (teamId) => {
    // Note: Selon la nouvelle API, on peut filtrer par team_id avec un paramètre de requête
    const response = await ky.get(`${API_URL}/teamStats?team_id=${teamId}`);
    teamStats.value = await response.json();
  };

  const fetchTeamStatByDivisionId = async (divisionId) => {
    const response = await ky.get(`${API_URL}/teamStats?division_id=${divisionId}`);
    teamStats.value = await response.json();

    teamStats.value.sort((a, b) => b.points - a.points);
  }

  const fetchTeamStatByteamIdAndDivisionId = async (teamId, divisionId) => {
    // Note: Cette méthode peut nécessiter plusieurs appels selon la nouvelle API
    // ou peut-être filtrer les résultats côté client
    const response = await ky.get(`${API_URL}/teamStats?team_id=${teamId}&division_id=${divisionId}`);
    teamStat.value = await response.json();
  }

  return {
    teamStats,
    teamStat,
    fetchAllTeamStats,
    fetchTeamStatByTeamId,
    fetchTeamStatByDivisionId,
    fetchTeamStatByteamIdAndDivisionId,
  };
});
