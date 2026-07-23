import { ref } from "vue";
import { defineStore } from "pinia";
import ky from "ky";
import { API_URL } from "../../API_URL";

export const useSearchStore = defineStore("search", () => {
  const allItems = ref([]);
  const isLoaded = ref(false);
  const isLoading = ref(false);

  const load = async () => {
    if (isLoaded.value || isLoading.value) return;
    isLoading.value = true;

    try {
      const [seasons, divisions, teams, players] = await Promise.all([
        ky.get(`${API_URL}/seasons`).json(),
        ky.get(`${API_URL}/divisions`).json(),
        ky.get(`${API_URL}/teams`).json(),
        ky.get(`${API_URL}/players`).json(),
      ]);

      allItems.value = [
        ...seasons.map(s => ({
          type: "Saison",
          label: s.name,
          sublabel: null,
          route: `/season/${s.id}`,
        })),
        ...divisions.map(d => ({
          type: "Division",
          label: d.name,
          sublabel: d.season_name ?? null,
          route: `/division/${d.id}`,
        })),
        ...teams.map(t => ({
          type: "Équipe",
          label: t.name,
          sublabel: null,
          route: `/team/${t.id}`,
        })),
        ...players.map(p => ({
          type: "Joueur",
          label: p.name,
          sublabel: null,
          route: `/player/${p.id}`,
        })),
      ];

      isLoaded.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  return { allItems, isLoaded, isLoading, load };
});
