import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";

const API_URL = "http://localhost:8000";

export const useDivisionStore = defineStore("divisions", () => {
  const divisions = ref([]);
  const division = ref({});

  const fetchAllDivisions = async () => {
    const response = await ky.get(`${API_URL}/divisions`);
    divisions.value = await response.json();
  };

  const fetchDivisionBySeason = async (seasonId) => {
    const response = await ky.get(`${API_URL}/division/season/${seasonId}`);
    divisions.value = await response.json();
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
