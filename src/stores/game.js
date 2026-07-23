import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";
import { useAuthStore } from "@/stores/auth";

export const useGameStore = defineStore("games", () => {
  const games = ref([]);
  const game = ref({});

  const fetchAllGames = async () => {
    const response = await ky.get(`${API_URL}/games`);
    games.value = await response.json();
  };

  const fetchGame = async (id) => {
    const response = await ky.get(`${API_URL}/games/${id}`);
    game.value = await response.json();
  };

  const fetchGamesByDivisionId = async (id) => {
    const response = await ky.get(`${API_URL}/games`, {
      searchParams: { division_id: id }
    });
    games.value = await response.json();
  }

  /**
   * Reporte un match (le capitaine authentifié reporte le match de son équipe).
   * L'API déduit l'équipe du capitaine et applique la limite par saison.
   * @param {number|string} gameId
   * @param {string} [reason]
   * @returns {Promise<object>}
   */
  const reportGame = async (gameId, reason) => {
    const auth = useAuthStore();
    const response = await auth.api.post(`games/${gameId}/report`, {
      json: { reason: reason || null },
    });
    return await response.json();
  };

  return {
    games,
    game,
    fetchAllGames,
    fetchGame,
    fetchGamesByDivisionId,
    reportGame,
  };
});
