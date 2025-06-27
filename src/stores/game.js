import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";

export const useGameStore = defineStore("games", () => {
  const games = ref([]);
  const game = ref({});

  const fetchAllGames = async () => {
    const response = await ky.get(`${API_URL}/games`);
    games.value = await response.json();
  };

  const fetchGame = async (id) => {
    const response = await ky.get(`${API_URL}/game/${id}`);
    game.value = await response.json();
  };

  const fetchGamesByDivisionId = async (id) => {
    const response = await ky.get(`${API_URL}/division/${id}/games`);
    games.value = await response.json();
  }

  return {
    games,
    game,
    fetchAllGames,
    fetchGame,
    fetchGamesByDivisionId,
  };
});
