import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";

export const useRegistrationStore = defineStore("registrations", () => {
  const registrations = ref([]);
  const registration = ref({});

  const fetchAllRegistrations = async () => {
    const response = await ky.get(`${API_URL}/registrations`);
    registrations.value = await response.json();
  };

  const fetchRegistrationsBySeasonId = async (seasonId) => {
    const response = await ky.get(`${API_URL}/registrations?season_id=${seasonId}`);
    registrations.value = await response.json();
  };

  const fetchRegistrationsByTeamId = async (teamId) => {
    const response = await ky.get(`${API_URL}/registrations?team_id=${teamId}`);
    registrations.value = await response.json();
  };

  const fetchRegistration = async (id) => {
    const response = await ky.get(`${API_URL}/registrations?id=${id}`);
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

  return {
    registrations,
    registration,
    fetchAllRegistrations,
    fetchRegistrationsBySeasonId,
    fetchRegistrationsByTeamId,
    fetchRegistration,
    createRegistration,
  };
});
