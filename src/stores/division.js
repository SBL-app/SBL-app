import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";

export const useDivisionStore = defineStore("divisions", () => {
  const divisions = ref([]);
  const division = ref({});

  const fetchAllDivisions = async () => {
    const response = await ky.get(`${API_URL}/divisions`);
    divisions.value = await response.json();
  };

  const fetchDivisionBySeason = async (seasonId) => {
    const response = await ky.get(`${API_URL}/division/season/${seasonId}`);
    const divisionsData = await response.json();

    const sortedDivisions = divisionsData.map((division) => {
      let sortedDivision = { ...division };
      sortedDivision.teams = [...division.teams].sort((a, b) => b.points - a.points);
      return sortedDivision;
    });

    divisions.value = sortedDivisions;
  }

  const fetchDivision = async (id) => {
    const response = await ky.get(`${API_URL}/division/${id}`);
    division.value = await response.json();
  };

  return {
    divisions,
    division,
    fetchAllDivisions,
    fetchDivisionBySeason,
    fetchDivision,
  };
})
