import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";

export const usePlayerStore = defineStore("players", () => {
  const players = ref([]);
  const player = ref({});

  const fetchAllPlayers = async () => {
    const response = await ky.get(`${API_URL}/players`);
    players.value = await response.json();
  };

  const fetchPlayersByTeam = async (teamId) => {
    const response = await ky.get(`${API_URL}/players/${teamId}`);
    players.value = await response.json();
  }

  const fetchPlayer = async (id) => {
    const response = await ky.get(`${API_URL}/player/${id}`);
    player.value = await response.json();
  };

  return {
    players,
    player,
    fetchAllPlayers,
    fetchPlayersByTeam,
    fetchPlayer,
  };
});
