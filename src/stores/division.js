import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";

export const useDivisionStore = defineStore("divisions", () => {
  const divisions = ref([]);
  const division = ref({});

  const fetchAllDivisions = async () => {
    try {
      // Essayer d'abord la nouvelle API
      const response = await ky.get(`${API_URL}/division`);
      divisions.value = await response.json();
    } catch (error) {
      if (error.response?.status === 404) {
        // Fallback vers l'ancienne API
        const response = await ky.get(`${API_URL}/divisions`);
        divisions.value = await response.json();
      } else {
        throw error;
      }
    }
  };

  const fetchDivisionBySeason = async (seasonId) => {
    try {
      // Essayer d'abord la nouvelle API
      const response = await ky.get(`${API_URL}/division/season?id=${seasonId}`);
      const divisionsData = await response.json();

      const sortedDivisions = divisionsData.map((division) => {
        let sortedDivision = { ...division };
        sortedDivision.teams = [...division.teams].sort((a, b) => b.points - a.points);
        return sortedDivision;
      });

      divisions.value = sortedDivisions;
    } catch (error) {
      if (error.response?.status === 404) {
        // Fallback vers l'ancienne API
        const response = await ky.get(`${API_URL}/division/season/${seasonId}`);
        const divisionsData = await response.json();

        const sortedDivisions = divisionsData.map((division) => {
          let sortedDivision = { ...division };
          sortedDivision.teams = [...division.teams].sort((a, b) => b.points - a.points);
          return sortedDivision;
        });

        divisions.value = sortedDivisions;
      } else {
        throw error;
      }
    }
  }

  const fetchDivision = async (id) => {
    try {
      // Essayer d'abord la nouvelle API
      const response = await ky.get(`${API_URL}/division?id=${id}`);
      division.value = await response.json();
    } catch (error) {
      if (error.response?.status === 404) {
        // Fallback vers l'ancienne API
        const response = await ky.get(`${API_URL}/division/${id}`);
        division.value = await response.json();
      } else {
        throw error;
      }
    }
  };

  const fetchDivisionDetails = async (divisionId) => {
    const response = await ky.get(`${API_URL}/division/details?division_id=${divisionId}`);
    const data = await response.json();
    return data;
  };

  return {
    divisions,
    division,
    fetchAllDivisions,
    fetchDivisionBySeason,
    fetchDivision,
    fetchDivisionDetails,
  };
})
