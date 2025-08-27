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
    const response = await ky.get(`${API_URL}/teams?id=${id}`);
    team.value = await response.json();
  };

  const fetchTeamsByDivision = async (divisionId) => {
    // Pour récupérer les équipes d'une division, on utilise l'endpoint teamStats filtré par division
    const response = await ky.get(`${API_URL}/teamStats`, {
      searchParams: { division_id: divisionId }
    });
    const teamStatsData = await response.json();
    // Extraire uniquement les informations des équipes
    teams.value = teamStatsData.map(stat => ({
      id: stat.team_id,
      name: stat.team_name
    }));
  };

  return {
    teams,
    team,
    fetchAllTeams,
    fetchTeam,
    fetchTeamsByDivision,
  };
});
