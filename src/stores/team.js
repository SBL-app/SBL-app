import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";

const API_URL = "http://localhost:8000";

export const useTeamStore = defineStore("teams", () => {
  const teams = ref([]);
  const team = ref({});

  const fetchAllTeams = async () => {
    const response = await ky.get(`${API_URL}/teams`);
    teams.value = await response.json();
  };

  const fetchTeam = async (id) => {
    const response = await ky.get(`${API_URL}/team/${id}`);
    team.value = await response.json();
  };

  const fetchTeamsByDivision = async (divisionId) => {
    const response = await ky.get(`${API_URL}/division/${divisionId}/teams`);
    teams.value = await response.json();
  };

  return {
    teams,
    team,
    fetchAllTeams,
    fetchTeam,
    fetchTeamsByDivision,
  };
});
