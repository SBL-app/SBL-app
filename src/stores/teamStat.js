import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";

const API_URL = "http://localhost:8000";

export const useTeamStatStore = defineStore("teamStats", () => {
  const teamStats = ref([]);
  const teamStat = ref({});

  const fetchAllTeamStats = async () => {
    const response = await ky.get(`${API_URL}/teamStats`);
    teamStats.value = await response.json();
  };

  const fetchTeamStat = async (id) => {
    const response = await ky.get(`${API_URL}/teamStat/${id}`);
    teamStat.value = await response.json();
  };

  const fetchTeamStatByTeamId = async (teamId) => {
    const response = await ky.get(`${API_URL}/teamStatByTeamId/${teamId}`);
    teamStat.value = await response.json();
  };

  const fetchTeamStatBySeasonId = async (seasonId) => {
    const response = await ky.get(`${API_URL}/teamStatBySeasonId/${seasonId}`);
    teamStat.value = await response.json();
  }


  return {
    teamStats,
    teamStat,
    fetchAllTeamStats,
    fetchTeamStat,
    fetchTeamStatByTeamId,
    fetchTeamStatBySeasonId,
  };
});
