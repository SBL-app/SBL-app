import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";
import { useAuthStore } from "@/stores/auth";

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

  /**
   * Crée une équipe dont l'utilisateur authentifié devient capitaine.
   * @param {string} name
   * @returns {Promise<object>} l'équipe créée (avec son id)
   */
  const createTeam = async (name) => {
    const auth = useAuthStore();
    const response = await auth.api.post("teams", {
      json: { name, captain: true },
    });
    return await response.json();
  };

  /**
   * Ajoute un joueur (roster) à une équipe dont l'utilisateur est capitaine.
   * @param {number|string} teamId
   * @param {{name: string, discord?: string}} player
   * @returns {Promise<object>}
   */
  const addPlayer = async (teamId, player) => {
    const auth = useAuthStore();
    const response = await auth.api.post(`teams/${teamId}/players`, {
      json: { name: player.name, discord: player.discord || null },
    });
    return await response.json();
  };

  /** Équipes de l'utilisateur authentifié : [{team, role, members_count}] */
  const fetchMyTeams = async () => {
    const auth = useAuthStore();
    return await auth.api.get("users/me/teams").json();
  };

  /** Membres d'une équipe : {team, members: [{role, discord_id, discord_username}]} */
  const fetchMembers = async (teamId) => {
    const auth = useAuthStore();
    return await auth.api.get(`teams/${teamId}/members`).json();
  };

  const addMember = async (teamId, discordId) => {
    const auth = useAuthStore();
    return await auth.api
      .post(`teams/${teamId}/members`, { json: { discord_id: discordId } })
      .json();
  };

  /** Retire un membre (capitaine) ; sans discordId, l'utilisateur quitte l'équipe. */
  const removeMember = async (teamId, discordId) => {
    const auth = useAuthStore();
    await auth.api.delete(`teams/${teamId}/members`, {
      json: discordId ? { discord_id: discordId } : {},
    });
  };

  const leaveTeam = (teamId) => removeMember(teamId, null);

  /** @param {"captain"|"member"} role */
  const changeRole = async (teamId, discordId, role) => {
    const auth = useAuthStore();
    return await auth.api
      .patch(`teams/${teamId}/members/role`, { json: { discord_id: discordId, role } })
      .json();
  };

  return {
    fetchMyTeams,
    fetchMembers,
    addMember,
    removeMember,
    leaveTeam,
    changeRole,
    teams,
    team,
    fetchAllTeams,
    fetchTeam,
    fetchTeamsByDivision,
    fetchTeamDetails,
    createTeam,
    addPlayer,
  };
});
