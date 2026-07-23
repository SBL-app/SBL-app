import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";
import { useAuthStore } from "@/stores/auth";

export const useDivisionStore = defineStore("divisions", () => {
  const divisions = ref([]);
  const division = ref({});

  const fetchAllDivisions = async () => {
    const response = await ky.get(`${API_URL}/divisions`);
      divisions.value = await response.json();
  };

  const fetchDivisionBySeason = async (seasonId) => {
    const response = await ky.get(`${API_URL}/seasons/${seasonId}/divisions`);
      const divisionsData = await response.json();

      const sortedDivisions = divisionsData.map((division) => {
        let sortedDivision = { ...division };
        sortedDivision.teams = [...division.teams].sort((a, b) => b.points - a.points);
        return sortedDivision;
      });

      divisions.value = sortedDivisions;
  }

  const fetchDivision = async (id) => {
    const response = await ky.get(`${API_URL}/divisions/${id}`);
      division.value = await response.json();
  };

  const fetchDivisionDetails = async (divisionId) => {
    const response = await ky.get(`${API_URL}/divisions/${divisionId}/details`);
    const data = await response.json();
    return data;
  };

  /**
   * Génère le planning de matchs d'une division.
   * @param {number|string} divisionId
   * @param {{type: string, status_id: number, start_date?: string, days_between_weeks?: number}} options
   * @returns {Promise<object>}
   */
  const generateSchedule = async (divisionId, options) => {
    const auth = useAuthStore();
    const response = await auth.api.post(`divisions/${divisionId}/schedule`, {
      json: options,
    });
    return await response.json();
  };

  return {
    divisions,
    division,
    fetchAllDivisions,
    fetchDivisionBySeason,
    fetchDivision,
    fetchDivisionDetails,
    generateSchedule,
  };
})
