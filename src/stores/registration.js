import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";
import { useAuthStore } from "@/stores/auth";

export const useRegistrationStore = defineStore("registrations", () => {
  const registrations = ref([]);
  const registration = ref({});

  const fetchAllRegistrations = async () => {
    const response = await ky.get(`${API_URL}/registrations`);
    registrations.value = await response.json();
  };

  const fetchRegistrationsBySeasonId = async (seasonId) => {
    const response = await ky.get(`${API_URL}/registrations`, {
      searchParams: { season_id: seasonId }
    });
    registrations.value = await response.json();
  };

  const fetchRegistrationsByTeamId = async (teamId) => {
    const response = await ky.get(`${API_URL}/registrations`, {
      searchParams: { team_id: teamId }
    });
    registrations.value = await response.json();
  };

  const fetchRegistration = async (id) => {
    const response = await ky.get(`${API_URL}/registrations/${id}`);
    registration.value = await response.json();
  };

  const createRegistration = async (seasonId, teamId) => {
    const response = await ky.post(`${API_URL}/registrations`, {
      json: {
        season: seasonId,
        team: teamId
      }
    });
    return await response.json();
  };

  /**
   * Équipes dont l'utilisateur authentifié est capitaine.
   * @returns {Promise<Array<{id: number, name: string}>>}
   */
  const fetchCaptainTeams = async () => {
    const auth = useAuthStore();
    const memberships = await auth.api.get("users/me/teams").json();
    return memberships
      .filter((m) => m.role === "captain")
      .map((m) => m.team);
  };

  /**
   * Inscrit une équipe (dont l'utilisateur est capitaine) à une saison.
   * L'inscription est créée au statut "pending" (validation admin).
   */
  const registerTeamToSeason = async (seasonId, teamId) => {
    const auth = useAuthStore();
    return await auth.api
      .post(`seasons/${seasonId}/register`, { json: { team_id: teamId } })
      .json();
  };

  return {
    fetchCaptainTeams,
    registerTeamToSeason,
    registrations,
    registration,
    fetchAllRegistrations,
    fetchRegistrationsBySeasonId,
    fetchRegistrationsByTeamId,
    fetchRegistration,
    createRegistration,
  };
});
