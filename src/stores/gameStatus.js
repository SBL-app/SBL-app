import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";

export const useGameStatusStore = defineStore("gameStatus", () => {
  const gameStatuses = ref([]);
  const gameStatus = ref({});

  const fetchAllGameStatuses = async () => {
    const response = await ky.get(`${API_URL}/gameStatuses`);
    gameStatuses.value = await response.json();
  };

  const fetchGameStatus = async (id) => {
    const response = await ky.get(`${API_URL}/gameStatus/${id}`);
    gameStatus.value = await response.json();
  };

  return {
    gameStatuses,
    gameStatus,
    fetchAllGameStatuses,
    fetchGameStatus,
  };
});
