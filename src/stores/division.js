import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";

export const useDivisionStore = defineStore("divisions", () => {
  const divisions = ref([]);
  const division = ref({});

  const fetchAllDivisions = async () => {
    const response = await ky.get(`${API_URL}/division`);
      divisions.value = await response.json();
  };

  const fetchDivisionBySeason = async (seasonId) => {
    const response = await ky.get(`${API_URL}/division/season?id=${seasonId}`);
      const divisionsData = await response.json();

      const sortedDivisions = divisionsData.map((division) => {
        let sortedDivision = { ...division };
        sortedDivision.teams = [...division.teams].sort((a, b) => b.points - a.points);
        return sortedDivision;
      });

      divisions.value = sortedDivisions;
  }

  const fetchDivision = async (id) => {
    const response = await ky.get(`${API_URL}/division?id=${id}`);
      division.value = await response.json();
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
