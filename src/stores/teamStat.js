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
    const response = await ky.get(`${API_URL}/teamStats/${teamId}`);
    teamStats.value = await response.json();
  };

  const fetchTeamStatByDivisionId = async (divisionId) => {
    const response = await ky.get(`${API_URL}/teamStats/division/${divisionId}`);
    teamStats.value = await response.json();

    teamStats.value.sort((a, b) => b.points - a.points);
  }

  const fetchTeamStatByteamIdAndDivisionId = async (teamId, divisionId) => {
    const response = await ky.get(`${API_URL}/teamStat/${teamId}/${divisionId}`);
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
