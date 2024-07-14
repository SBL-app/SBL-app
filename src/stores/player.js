import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";

const API_URL = "http://localhost:8000";

export const usePlayerStore = defineStore("players", () => {
  const players = ref([]);
  const player = ref({});

  const fetchAllPlayers = async () => {
    const response = await ky.get(`${API_URL}/players`);
    players.value = await response.json();
  };

  const fetchPlayer = async (id) => {
    const response = await ky.get(`${API_URL}/player/${id}`);
    player.value = await response.json();
  };

  return {
    players,
    player,
    fetchAllPlayers,
    fetchPlayer,
  };
});
