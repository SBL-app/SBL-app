import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";

export const useTeamStore = defineStore("teams", () => {
  const teams = ref([]);
  const team = ref({});

  const fetchAllTeams = async () => {
    const response = await ky.get(`${API_URL}/teams`);
    teams.value = await response.json();
  };

  const fetchTeam = async (id) => {
    const response = await ky.get(`${API_URL}/teams/${id}`);
    team.value = await response.json();
  };

  const fetchTeamsByDivision = async (divisionId) => {
    const response = await ky.get(`${API_URL}/team-stats`, {
      searchParams: { division_id: divisionId }
    });
    const teamStatsData = await response.json();
    teams.value = teamStatsData.map(stat => ({
      id: stat.team_id,
      name: stat.team_name
    }));
  };

  const fetchTeamDetails = async (teamId) => {
    const response = await ky.get(`${API_URL}/teams/${teamId}`, {
      searchParams: { expand: "players,stats" }
    });
    const data = await response.json();
    return data;
  };

  return {
    teams,
    team,
    fetchAllTeams,
    fetchTeam,
    fetchTeamsByDivision,
    fetchTeamDetails,
  };
});
